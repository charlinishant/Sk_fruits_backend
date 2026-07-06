const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

let purchaseColumnsCache = null;

async function getPurchaseColumns() {
  if (purchaseColumnsCache) return purchaseColumnsCache;

  const rows = await query("SHOW COLUMNS FROM purchase");
  purchaseColumnsCache = new Set(rows.map((row) => row.Field));
  return purchaseColumnsCache;
}

async function updatePurchaseCurrentBalanceIfSupported(supplierName, purchaseId) {
  const purchaseColumns = await getPurchaseColumns();
  if (!purchaseColumns.has("current_balance")) return;

  const sql =
    'UPDATE purchase SET current_balance = (select current_balance from account_table WHERE account_group = "Supplier" AND name = ?)  WHERE id = ?';
  await query(sql, [supplierName, purchaseId]);
}

async function getPurchaseProductTotal(purchaseId) {
  if (!purchaseId) return null;

  const rows = await query(
    "SELECT COALESCE(SUM(price), 0) AS product_total FROM purchase_product WHERE purchase_id = ?",
    [purchaseId]
  );
  return parseFloat(rows[0]?.product_total) || 0;
}

//Fetch purchase Data
router.get("/:purchaseId?", function (req, res) {
  const purchaseId = req.params.purchaseId;
  let sql = "SELECT * FROM purchase";
  // let params = [];

  if (purchaseId) {
    sql += ` WHERE id = ${mysql.escape(purchaseId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("purchaseId not found");
      } else {
        res.send(results); // Send all results
        // Do something with the results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

// Delete purchase data
// router.delete("/deletepurchaseId/:purchaseId?", (req, res) => {
//   const purchaseId = req.params.purchaseId;
//   var sql = 'DELETE FROM purchase';

//   if (!purchaseId) {
//     return res.status(400).send('Invalid purchase ID');
//   } else{
//     sql += ` WHERE id = ${mysql.escape(purchaseId)}`;
//   }

//   query(sql)
//       .then(results => {
//         console.log('Results:', results);

//         if (results.affectedRows === 0) {
//           res.status(404).send('purchaseId not found');
//         } else {
//           res.send(results); // Send all results
//           // Do something with the results
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error'); // Send an error response to the client
//       });
// });

router.delete("/deletePurchase/:purchaseId", async (req, res) => {
  const { purchaseId } = req.params;

  if (!purchaseId) {
    return res.status(400).json({ message: "Missing purchaseId parameter" });
  }

  try {
    // Step 1: Fetch the purchase entry
    const selectSql = "SELECT * FROM purchase WHERE id = ?";
    const purchaseResult = await query(selectSql, [purchaseId]);

    if (purchaseResult.length === 0) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const purchase = purchaseResult[0];
    const { supplier_name, total_quantity } = purchase;

    // Step 2: Revert supplier balance
    const updateBalanceSql = `
      UPDATE account_table 
      SET current_balance = current_balance - ? 
      WHERE account_group = "Supplier" AND name = ?
    `;
    await query(updateBalanceSql, [total_quantity, supplier_name]);

    // Step 3 (Optional): Remove purchase reference in stock
    const updateStockSql = `
      UPDATE stock 
      SET gadi_number = NULL, supplier_name = NULL 
      WHERE purchase_id = ?
    `;
    await query(updateStockSql, [purchaseId]);

    // Step 4: Delete the purchase
    const deleteSql = "DELETE FROM purchase WHERE id = ?";
    const deleteResult = await query(deleteSql, [purchaseId]);

    const deleteSql1 = "DELETE FROM purchase_product WHERE purchase_id = ?";
    const deleteResult1 = await query(deleteSql1, [purchaseId]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: "Purchase not deleted" });
    }

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Delete Purchase Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add purchaseproduct data
// router.post("/insertPurchase", async (req, res) => {
//   // Get THe data from request body
//   const {date ,supplier_name,gadi_number,total_quantity} = req.body;

//   // Validate incoming data
//   if (!date || !supplier_name || !gadi_number || !total_quantity) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   // Insert data into the database
//   const sql = 'INSERT INTO purchase (date ,supplier_name,gadi_number,total_quantity) VALUES (?, ?, ?, ?)';
//   const values = [date ,supplier_name,gadi_number,total_quantity];

//   query(sql, values)
//       .then(results => {
//         console.log('Results:', results);

//         if (results.affectedRows === 0) {
//           res.status(404).send('purchase not inserted');
//         } else {
//           // Update account_table
//           const sql2 = 'UPDATE account_table SET current_balance = current_balance + ? WHERE account_group = "Supplier" AND name = (SELECT supplier_name FROM purchase WHERE id = ?)';
//           const values2 = [price, purchase_id];
//           await query(sql2, values2);
//           res.send(results); // Send all results
//           // Do something with the results
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error'); // Send an error response to the client
//       });
// });

router.post("/insertPurchase", async (req, res) => {
  // Get the data from request body
  const {
    purchase_id,
    date,
    supplier_name: supplierName,
    gadi_number: gadiNumber,
    total_quantity,
    price,
    added_by,
    expenses,
  } = req.body;
  const supplier_name = (supplierName || "").trim();
  const gadi_number = (gadiNumber || "").trim();
  const requestedPurchaseId = Number(purchase_id) || null;
  const expensesAmount = parseFloat(expenses) || 0;

  // Validate incoming data
  if (!date || !supplier_name || !gadi_number || !total_quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const sql4 =
      'select current_balance from account_table where account_group = "Supplier" AND name =  ? ';
    const values4 = [supplier_name];

    const results5 = await query(sql4, values4);
    if (results5.length === 0) {
      return res.status(400).json({
        message: `Supplier account not found: ${supplier_name}`,
      });
    }
    console.log("Results:", results5[0].current_balance);
    const prev_balance = results5[0].current_balance;
    const productTotal = await getPurchaseProductTotal(requestedPurchaseId);
    const grandTotal =
      productTotal === null
        ? parseFloat(total_quantity) || 0
        : parseFloat((productTotal + expensesAmount).toFixed(2));

    const purchaseColumns = await getPurchaseColumns();
    const insertColumns = [
      "date",
      "supplier_name",
      "gadi_number",
      "total_quantity",
      "added_by",
    ];
    const values = [date, supplier_name, gadi_number, grandTotal, added_by];

    if (requestedPurchaseId) {
      const existingPurchase = await query("SELECT id FROM purchase WHERE id = ?", [
        requestedPurchaseId,
      ]);

      if (existingPurchase.length > 0) {
        return res.status(409).json({
          message: `Purchase bill already exists: ${requestedPurchaseId}`,
        });
      }

      insertColumns.unshift("id");
      values.unshift(requestedPurchaseId);
    }

    if (purchaseColumns.has("expenses")) {
      insertColumns.push("expenses");
      values.push(expensesAmount);
    }

    if (purchaseColumns.has("previous_balance")) {
      insertColumns.push("previous_balance");
      values.push(prev_balance);
    }

    // Insert data into the database
    const sql = `INSERT INTO purchase (${insertColumns.join(
      ", "
    )}) VALUES (${insertColumns.map(() => "?").join(", ")})`;

    const results = await query(sql, values);
    console.log("Results:", results);

    if (results.affectedRows === 0) {
      return res.status(404).send("Purchase not inserted");
    }

    const purchase_id = requestedPurchaseId || results.insertId; // Retrieve the inserted purchase ID

    // Update account_table
    const sql2 =
      'UPDATE account_table SET current_balance = current_balance + ?   WHERE account_group = "Supplier" AND name = ?';
    const values2 = [grandTotal, supplier_name];
    await query(sql2, values2);

    // Update account_table
    const sql3 =
      "UPDATE stock SET gadi_number =  ?,supplier_name =  ? WHERE purchase_id = ?";
    const values3 = [gadi_number, supplier_name, purchase_id];

    await query(sql3, values3);

    await updatePurchaseCurrentBalanceIfSupported(supplier_name, purchase_id);

    res.status(200).json({
      message: "Purchase inserted and account updated successfully",
      results,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.sqlMessage || error.message || "Internal Server Error",
    });
  }
});

// update purchase data
router.put("/updatePurchase/:purchaseId", async (req, res) => {
  try {
    const purchaseId = req.params.purchaseId;
    const { total_quantity, supplier_name, expenses } = req.body;
    const expensesAmount = parseFloat(expenses) || 0;
    const productTotal = await getPurchaseProductTotal(purchaseId);
    const grandTotal = parseFloat((productTotal + expensesAmount).toFixed(2));

    // Validate incoming data (optional but recommended)
    if (!grandTotal) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sql =
      "UPDATE account_table SET  current_balance = current_balance - ((select total_quantity from purchase where id = ? ) - ?)  WHERE name = ? ";
    const values = [purchaseId, grandTotal, supplier_name];
    const result = await query(sql, values);

    // Update data in the database

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "purchase not found" });
    }
    const purchaseColumns = await getPurchaseColumns();
    const updateColumns = ["total_quantity = ?"];
    const values1 = [grandTotal];

    if (purchaseColumns.has("expenses")) {
      updateColumns.push("expenses = ?");
      values1.push(expensesAmount);
    }

    const sql1 = `UPDATE purchase SET ${updateColumns.join(", ")} WHERE id = ?`;
    values1.push(purchaseId);
    const result1 = await query(sql1, values1);
// Update current_balance in purchase table
    await updatePurchaseCurrentBalanceIfSupported(supplier_name, purchaseId);
    // Send response
    res
      .status(200)
      .json({ message: "Purchase updated successfully", data: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
