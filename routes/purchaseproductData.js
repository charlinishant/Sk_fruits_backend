const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

async function recalculateStockTimeline(bata) {
  const stockRows = await query(
    "SELECT id, purchase, sale FROM stock WHERE Bata = ? ORDER BY Date ASC, id ASC",
    [bata]
  );

  let previousClosing = 0;
  let isFirstRow = true;

  for (const row of stockRows) {
    const purchase = Number(row.purchase) || 0;
    const sale = Number(row.sale) || 0;
    const opening = previousClosing;
    const closing = isFirstRow ? purchase - sale : opening - sale;

    await query(
      "UPDATE stock SET opening = ?, closing = ? WHERE id = ?",
      [opening, closing, row.id]
    );

    previousClosing = closing;
    isFirstRow = false;
  }
}

//Fetch purchaseproduct Data
router.get("/productBata/:purchaseproductId?", function (req, res) {
  const purchaseproductId = req.params.purchaseproductId;
  let sql = "SELECT * FROM purchase_product";
  // let params = [];

  if (purchaseproductId) {
    sql += ` WHERE purchase_id = ${mysql.escape(purchaseproductId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("purchaseproductId not found");
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

//Fetch purchaseproduct Data
router.get("/purchaseId/:purchaseproductId?", function (req, res) {
  const purchaseproductId = req.params.purchaseproductId;
  let sql = "SELECT distinct purchase_id FROM purchase_product";
  // let params = [];

  if (purchaseproductId) {
    sql += ` WHERE purchase_id = ${mysql.escape(purchaseproductId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("purchaseproductId not found");
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

//Fetch purchaseproduct Data
router.get("/product/:purchaseproductId?", function (req, res) {
  const purchaseproductId = req.params.purchaseproductId;
  let sql =
    "SELECT DISTINCT product_name COLLATE utf8mb4_bin AS product_name FROM purchase_product";

  // let params = [];

  if (purchaseproductId) {
    sql += ` WHERE purchase_id = ${mysql.escape(purchaseproductId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("purchaseproductId not found");
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

//Fetch purchaseproduct Data
router.get("/bata/:purchaseproductId?", function (req, res) {
  const purchaseproductId = req.params.purchaseproductId;
  let sql = "SELECT distinct bata FROM purchase_product";
  // let params = [];

  if (purchaseproductId) {
    sql += ` WHERE product_name = ${mysql.escape(purchaseproductId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("purchaseproductId not found");
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

//Fetch purchaseproduct Data
router.post("/", function (req, res) {
  const { fromdate, todate, bata, product, gadi_number, barcode, date } =
    req.body;

  console.log("Dates", fromdate, todate);
  let sql =
    "SELECT purchase_id,p_date,product_name, bata, mark, purchase_price, selling_price,gadi_number FROM purchase_product pp join purchase p on(pp.purchase_id = p.id) ";
  var where = " where pp.id > 0  ";
  var values = [];
  // let params = [];

  if (bata !== "*") {
    where += "and bata = ? ";
    values.push(bata);
  }
  if (product !== "*") {
    where += "and product_name = ? ";
    values.push(product);
  }

  if (gadi_number !== "*") {
    where += "and gadi_number = ? ";
    values.push(gadi_number);
  }

  if (date == "yes") {
    where += " and p_date between ?  and ?  ";
    values.push(fromdate, todate);
  }

  if (barcode == "yes") {
    where += " order by p_date desc ";
    values.push(gadi_number);
  }

  query(sql + where, values)
    .then((results) => {
      console.log("Results:", values);

      if (results.length === 0) {
        res.status(404).send("Product not found");
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

router.get("/:purchaseproductId", function (req, res) {
  const purchaseproductId = req.params.purchaseproductId;
  // const {bata, product,gadi_number} = req.body;
  let sql =
    "SELECT pp.id,purchase_id,p_date,product_name, bata, mark, purchase_price, selling_price,gadi_number,quantity,unit,price,editable FROM purchase_product pp join purchase p on(pp.purchase_id = p.id) ";
  // var where = ' where pp.id > 0  ';
  // var values = [];
  // let params = [];

  if (purchaseproductId) {
    sql += ` WHERE purchase_id = ${mysql.escape(purchaseproductId)}`;
  }
  // if (product !== '*'){
  //   where += "and product_name = ? "
  //   values.push(product)
  // }

  // if (gadi_number !== '*'){
  //   where += "and gadi_number = ? "
  //   values.push(gadi_number)
  // }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Product not found");
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

//Fetch product by bata Data
router.get("/getBataProduct/:bata?", function (req, res) {
  const bata = req.params.bata;
  let sql = "SELECT product_name,selling_price,mark FROM purchase_product";
  // let params = [];

  if (bata) {
    sql += ` WHERE bata = ${mysql.escape(bata)} limit 1`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("purchaseproductId not found");
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

// Delete User data
router.delete("/deletepurchaseproductId/:purchaseproductId?", (req, res) => {
  const purchaseproductId = req.params.purchaseproductId;
  // Need to change this condition as purchase id was not updated in table
  var sql =
    "DELETE FROM stock where Bata = (select bata from purchase_product where id = ? )";
  const values = [purchaseproductId];
  if (!purchaseproductId) {
    return res.status(400).send("Invalid purchaseproduct ID");
  }

  query("SELECT bata FROM purchase_product WHERE id = ?", values)
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).send("User purchaseproductId not found");
      }

      const deletedBata = results[0].bata;

      return query(sql, values).then((stockResults) => {
        console.log("Results:", stockResults);

        const sql1 = "DELETE FROM purchase_product where id = ?";
        const values1 = [purchaseproductId];

        return query(sql1, values1).then(async () => {
          await recalculateStockTimeline(deletedBata);
          res.send(stockResults);
        });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

// update purchseproduct data
router.put("/updatePurchaseproduct/:purchaseproductId", async (req, res) => {
  try {
    const purchaseproductId = req.params.purchaseproductId;
    const {
      product_name,
      bata,
      purchase_id,
      mark,
      purchase_price,
      selling_price,
      quantity,
      unit,
    } = req.body;

    // Step 1: Fetch the old purchase product so we can sync stock history correctly
    const oldProductSql =
      "SELECT bata, purchase_id, quantity FROM purchase_product WHERE id = ?";
    const oldProductResult = await query(oldProductSql, [purchaseproductId]);

    if (oldProductResult.length === 0) {
      return res.status(404).json({ message: "purchaseproduct not found" });
    }

    const oldBata = oldProductResult[0].bata;
    const oldPurchaseId = oldProductResult[0].purchase_id;

    // Calculate price automatically
    const price = (purchase_price || 0) * (quantity || 0);

    // Step 2: Update purchase_product table
    const sql =
      "UPDATE purchase_product SET product_name = ?, bata = ?, purchase_id = ?, mark = ?, purchase_price = ?, selling_price = ?, quantity = ?, unit = ?, price = ? WHERE id = ?";
    const values = [
      product_name,
      bata,
      purchase_id,
      mark,
      purchase_price,
      selling_price,
      quantity,
      unit,
      price,
      purchaseproductId,
    ];
    const result = await query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "purchaseproduct not found" });
    }

    // Step 3: Update stock rows for this purchase line
    const updateStockSql = `
      UPDATE stock 
      SET Bata = ?, product_name = ?, mark = ?, purchase_id = ?, purchase = ?
      WHERE bata = ? AND purchase_id = ?
    `;
    const updateStockValues = [
      bata,
      product_name,
      mark,
      purchase_id,
      quantity,
      oldBata,
      oldPurchaseId,
    ];
    await query(updateStockSql, updateStockValues);

    if (oldBata !== bata) {
      await recalculateStockTimeline(oldBata);
    }
    await recalculateStockTimeline(bata);

    // Send response
    res
      .status(200)
      .json({ message: "purchaseproduct updated successfully and stock synced", data: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/insertPurchaseproduct", async (req, res) => {
  try {
    // Get the data from request body
    const {
      product_name,
      bata,
      p_date,
      purchase_id,
      mark,
      purchase_price,
      selling_price,
      quantity,
      unit,
      price,
      editable,
    } = req.body;

    // Validate incoming data
    if (
      !product_name ||
      !bata ||
      !p_date ||
      !purchase_id ||
      !mark ||
      !purchase_price ||
      !selling_price ||
      !quantity ||
      !unit ||
      !price
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if bata already exists in the purchase_product table
    const checkBataSql =
      "SELECT 1 FROM purchase_product WHERE bata = ? LIMIT 1";
    const [bataExists] = await query(checkBataSql, [bata]);

    if (bataExists) {
      return res.status(409).json({ message: "Bata already exists" });
    }

    // Insert data into the database
    const insertSql =
      "INSERT INTO purchase_product (product_name, bata, p_date, purchase_id, mark, purchase_price, selling_price, quantity, unit, price,editable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    const values = [
      product_name,
      bata,
      p_date,
      purchase_id,
      mark,
      purchase_price,
      selling_price,
      quantity,
      unit,
      price,
      editable,
    ];

    const results = await query(insertSql, values);
    console.log("Results:", results);

    if (results.affectedRows === 0) {
      return res.status(404).send("Purchase product not inserted");
    }

    // Insert data into stock table
    const insertStockSql =
      "INSERT INTO stock (Date, product_name, bata, purchase, sale, closing, purchase_id,mark) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
    const stockValues = [
      p_date,
      product_name,
      bata,
      quantity,
      0,
      quantity,
      purchase_id,
      mark,
    ];
    await query(insertStockSql, stockValues);
    await recalculateStockTimeline(bata);

    // Send success response
    res.send(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
