const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
// router.get('/', (req, res) => {
//     res.send('Welcome to the userData!');
// });

//Fetch saleproduct Data
router.get("/:saleproductId?", function (req, res) {
  const saleproductId = req.params.saleproductId;
  let sql = "SELECT * FROM sale_product";
  // let params = [];

  if (saleproductId) {
    sql += ` WHERE bill_id = ${mysql.escape(saleproductId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("saleproductId not found");
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

// Delete sale prodcut  data
router.delete("/deletesaleproduct/:saleproductId?", async (req, res) => {
  const saleproductId = req.params.saleproductId;
  if (!saleproductId) {
    return res.status(400).send("Invalid saleproduct ID");
  }

  try {
    // Get sale product details before deleting
    const getSaleProductSql = "SELECT bata, quantity FROM sale_product WHERE id = ?";
    const saleProduct = await query(getSaleProductSql, [saleproductId]);
    
    if (saleProduct.length === 0) {
      return res.status(404).send("Sale product not found");
    }

    const { bata, quantity } = saleProduct[0];

    // Update today's stock
    const updateStockSql = `
      UPDATE stock 
      SET sale = sale - ?, closing = closing + ?
      WHERE Bata = ? AND DATE(date) = CURDATE()
    `;
    const updateStockValues = [quantity, quantity, bata];
    await query(updateStockSql, updateStockValues);
    
    console.log(`Stock reversed for bata ${bata}: -${quantity} sale, +${quantity} closing`);

    // Update all future stock entries' opening and closing
    const updateFutureStockSql = `
      UPDATE stock 
      SET opening = opening + ?, closing = closing + ?
      WHERE Bata = ? AND DATE(date) > CURDATE()
    `;
    const updateFutureValues = [quantity, quantity, bata];
    await query(updateFutureStockSql, updateFutureValues);
    
    console.log(`Future stock entries updated for bata ${bata}`);

    // Delete from sale_product
    const deleteSql = "DELETE FROM sale_product WHERE id = ?";
    const deleteResult = await query(deleteSql, [saleproductId]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).send("Sale product not found");
    }

    res.send({ message: "Sale product deleted and stock updated", affectedRows: deleteResult.affectedRows });
  } catch (error) {
    console.error("Error deleting sale product:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Add saleproduct data
// router.post("/insertsaleproduct", async (req, res) => {
//   // Get THe data from request body
//   const { bill_id, bata, mark, product, quantity, rate, price } = req.body;
//   console.log("HELLO")
//   console.log(bill_id, bata, mark, product, quantity, rate, price);
//   // Validate incoming data
//   if (!bill_id || !bata || !mark || !product || !quantity || !rate || !price) {
//     console.log("HELLO")
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   // Insert data into the database
//   const sql = 'INSERT INTO sale_product (bill_id, bata, mark, product, quantity, rate, price) VALUES (?, ?, ?, ?, ?, ?, ?)';
//   const values = [bill_id, bata, mark, product, quantity, rate, price];
//   console.log(sql)
//   console.log(values)
//   query(sql, values)
//     .then(results => {
//       console.log('Results:', results);

//       if (results.affectedRows === 0) {
//         res.status(404).send('saleproduct not inserted');
//       } else {
//         const sql1 = 'update stock set sale = sale + ?,closing = closing - ?  where Bata = ? ';
//         const values1 = [quantity, quantity, bata];
//         console.log(sql1)
//         console.log(values1)
//         query(sql1, values1)
//           .then(results1 => {
//             console.log('Results for stock:', results1);
//             if (results1.affectedRows === 0) {
//               res.status(404).send('Stock Table not updated');
//             }
//           })

//         res.send(results); // Send all results
//         // Do something with the results
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       res.status(500).send('Internal Server Error'); // Send an error response to the client
//     });
// });

router.post("/insertsaleproduct", async (req, res) => {
  // Get the data from the request body
  const { bill_id, bata, mark, product, quantity, rate, price } = req.body;

  // Validate incoming data
  if (!bill_id || !bata || !mark || !product || !quantity || !rate || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // First, check if the entry with the same bill_id and product exists in the sale_product table
  const checkSql =
    "SELECT quantity FROM sale_product WHERE bill_id = ? AND bata = ? AND rate = ?";
  const checkValues = [bill_id, bata, rate];

  try {
    const existingProduct = await query(checkSql, checkValues);
    console.log("exitsing prod", existingProduct.length);
    if (existingProduct.length > 0) {
      console.log("insode");
      // Entry exists, update the quantity in the sale_product table
      const newQuantity = existingProduct[0].quantity + quantity;
      const updateSql =
        "UPDATE sale_product SET quantity = ?, rate = ?, price = ? WHERE bill_id = ? AND product = ? AND rate = ? AND bata = ?";
      const updateValues = [
        newQuantity,
        rate,
        rate * newQuantity,
        bill_id,
        product,
        rate,
        bata,
      ];

      await query(updateSql, updateValues);
      console.log("Quantity updated in sale_product table");
    } else {
      // Entry doesn't exist, insert new row
      const insertSql =
        "INSERT INTO sale_product (bill_id, bata, mark, product, quantity, rate, price) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const insertValues = [
        bill_id,
        bata,
        mark,
        product,
        quantity,
        rate,
        price,
      ];

      await query(insertSql, insertValues);
      console.log("New entry inserted in sale_product table");

      try {
        const insertEditableSql =
          "UPDATE sale_product SET editable = COALESCE((select editable from purchase_product where bata = ? LIMIT 1), 1) where bata = ? and bill_id = ?";
        const insertEditableValues = [bata, bata, bill_id];
        await query(insertEditableSql, insertEditableValues);
        console.log("Editable flag updated in sale_product table");
      } catch (editableError) {
        console.warn("Could not update editable flag, using default:", editableError.message);
      }
    }

    // Check if stock entry exists for this bata on current date
    const checkTodayStockSql = "SELECT * FROM stock WHERE Bata = ? AND DATE(date) = CURDATE()";
    const todayStock = await query(checkTodayStockSql, [bata]);
    
    console.log(`✅ Sale product data successfully stored: Bill=${bill_id}, Bata=${bata}, Product=${product}, Qty=${quantity}`);
    
    if (todayStock.length > 0) {
      // Same day: Update existing stock entry
      const updateStockSql = "UPDATE stock SET sale = sale + ?, closing = closing - ? WHERE Bata = ? AND DATE(date) = CURDATE()";
      const updateStockValues = [quantity, quantity, bata];
      await query(updateStockSql, updateStockValues);
      console.log("Stock updated for same day");
    } else {
      // Different day: Check if any previous stock exists
      const previousStockSql = "SELECT * FROM stock WHERE Bata = ? ORDER BY date DESC, id DESC LIMIT 1";
      const previousStock = await query(previousStockSql, [bata]);
      
      if (previousStock.length > 0) {
        // Previous stock exists: Copy data from last entry
        const stockInsertSql = `
          INSERT INTO stock (
            Bata, product_name, purchase, supplier_name, gadi_number, 
            purchase_id, mark, opening, sale, closing, date
          )
          SELECT 
            ? as Bata,
            COALESCE(product_name, ?) as product_name,
            COALESCE(purchase, 0) as purchase,
            COALESCE(supplier_name, '') as supplier_name,
            COALESCE(gadi_number, '') as gadi_number,
            COALESCE(purchase_id, 0) as purchase_id,
            COALESCE(mark, ?) as mark,
            COALESCE(closing, purchase, 0) as opening,
            ? as sale,
            GREATEST(0, COALESCE(closing, purchase, 0) - ?) as closing,
            CURDATE() as date
          FROM stock 
          WHERE Bata = ? 
          ORDER BY date DESC, id DESC 
          LIMIT 1
        `;
        const stockInsertValues = [bata, product, mark, quantity, quantity, bata];
        await query(stockInsertSql, stockInsertValues);
        console.log("New stock entry created with previous data copied");
      } else {
        // First-time entry: Create initial stock record
        const stockInsertSql = `
          INSERT INTO stock (Bata, product_name, mark, opening, sale, closing, date, unit, purchase_id) 
          VALUES (?, ?, ?, 0, ?, ?, CURDATE(), 'PCS', 0)
        `;
        const stockInsertValues = [bata, product, mark, quantity, -quantity];
        await query(stockInsertSql, stockInsertValues);
        console.log("First-time stock entry created for bata:", bata);
      }
    }

    return res.status(200).json({
      message:
        "Product Quantity updated or Added in sale_product and stock updated",
    });
  } catch (error) {
    console.error("❌ Error inserting sale product for bata:", bata);
    console.error("Error details:", error.message);
    console.error("Failed data:", { bill_id, bata, product, quantity, rate, price });
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message,
      bata: bata 
    });
  }
});

router.put("/updatesaleproduct", async (req, res) => {
  // Get the data from the request body
  const { bill_id, bata, mark, product, quantity, rate, price, id } = req.body;

  // Validate incoming data
  if (
    !bill_id ||
    !bata ||
    !mark ||
    !product ||
    !quantity ||
    !rate ||
    !price ||
    !id
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // First, check if the entry with the same id exists in the sale_product table
  const checkSql = "SELECT quantity FROM sale_product WHERE id = ?";
  const checkValues = [id];

  try {
    const existingProduct = await query(checkSql, checkValues);

    if (existingProduct.length > 0) {
      // Get the old quantity from the existing entry
      const oldQuantity = existingProduct[0].quantity;

      // Check if the quantity is being increased or decreased
      const quantityDifference = quantity - oldQuantity;

      // Update the sale_product table with the new values
      const updateSql =
        "UPDATE sale_product SET quantity = ?, rate = ?, price = ? WHERE id = ?";
      const updateValues = [quantity, rate, price, id];

      await query(updateSql, updateValues);
      console.log("Quantity, rate, and price updated in sale_product table");

      // Fetch the updated row from the sale_product table
      const updatedProductSql = "SELECT * FROM sale_product WHERE id = ?";
      const updatedProduct = await query(updatedProductSql, [id]);

      // Handle stock for updates
      if (quantityDifference !== 0) {
        const checkTodayStockSql = "SELECT * FROM stock WHERE Bata = ? AND DATE(date) = CURDATE()";
        const todayStock = await query(checkTodayStockSql, [bata]);
        
        if (todayStock.length > 0) {
          // Same day: Update existing stock entry
          const updateStockSql = "UPDATE stock SET sale = sale + ?, closing = closing - ? WHERE Bata = ? AND DATE(date) = CURDATE()";
          const updateStockValues = [quantityDifference, quantityDifference, bata];
          await query(updateStockSql, updateStockValues);
          console.log("Stock updated for same day update");
        } else {
          // Different day: Check if any previous stock exists
          const previousStockSql = "SELECT * FROM stock WHERE Bata = ? ORDER BY date DESC, id DESC LIMIT 1";
          const previousStock = await query(previousStockSql, [bata]);
          
          if (previousStock.length > 0) {
            // Previous stock exists: Copy data from last entry
            const stockInsertSql = `
              INSERT INTO stock (
                Bata, product_name, purchase, supplier_name, gadi_number, 
                purchase_id, mark, opening, sale, closing, date
              )
              SELECT 
                ? as Bata,
                COALESCE(product_name, ?) as product_name,
                COALESCE(purchase, 0) as purchase,
                COALESCE(supplier_name, '') as supplier_name,
                COALESCE(gadi_number, '') as gadi_number,
                COALESCE(purchase_id, 0) as purchase_id,
                COALESCE(mark, ?) as mark,
                COALESCE(closing, purchase, 0) as opening,
                ? as sale,
                GREATEST(0, COALESCE(closing, purchase, 0) - ?) as closing,
                CURDATE() as date
              FROM stock 
              WHERE Bata = ? 
              ORDER BY date DESC, id DESC 
              LIMIT 1
            `;
            const stockInsertValues = [bata, product, mark, quantityDifference, quantityDifference, bata];
            await query(stockInsertSql, stockInsertValues);
            console.log("New stock entry created with opening balance logic");
          } else {
            // First-time entry: Create initial stock record
            const stockInsertSql = `
              INSERT INTO stock (Bata, product_name, mark, opening, sale, closing, date, unit, purchase_id) 
              VALUES (?, ?, ?, 0, ?, ?, CURDATE(), 'PCS', 0)
            `;
            const stockInsertValues = [bata, product, mark, quantityDifference, -quantityDifference];
            await query(stockInsertSql, stockInsertValues);
            console.log("First-time stock entry created for bata during update:", bata);
          }
        }
      }

      return res.status(200).json({
        message:
          "Product updated successfully in sale_product and stock updated",
        updatedProduct: updatedProduct[0],
      });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// update saleproduct data
// router.put("/updateSaleproduct/:saleproductId", async (req, res) => {
//   try {
//     const saleproductId = req.params.saleproductId;
//     const { bill_id, bata, mark, product, quantity, rate, price } = req.body;

//     // Validate incoming data (optional but recommended)
//     if (!bill_id || !bata || !mark || !product || !quantity || !rate || !price) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Update data in the database
//     const sql = 'UPDATE sale_product SET bill_id = ?, bata = ?, mark = ?, product = ?, quantity = ?, rate = ?, price = ? WHERE id = ?';
//     const values = [bill_id, bata, mark, product, quantity, rate, price, saleproductId];
//     const result = await query(sql, values);

//     // Check if user was found and updated
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "saleproduct not found" });
//     }

//     // Send response
//     res.status(200).json({ message: "saleproduct updated successfully", data: result });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

module.exports = router;
