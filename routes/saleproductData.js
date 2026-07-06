const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const {
  getProductsForBill,
  clearProductsForBill,
  upsertProduct,
  updateProduct: updateTempProduct,
  deleteProduct: deleteTempProduct,
} = require("../state/saleTempStore");

router.use(bodyParser.json());

// Fetch saleproduct Data
router.get("/:saleproductId?", function (req, res) {
  const saleproductId = req.params.saleproductId;
  let sql = "SELECT * FROM sale_product";

  if (saleproductId) {
    sql += ` WHERE bill_id = ${mysql.escape(saleproductId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);
      const tempProducts = saleproductId ? getProductsForBill(saleproductId) : [];

      if (results.length === 0) {
        if (tempProducts.length === 0) {
          res.status(404).send("saleproductId not found");
        } else {
          res.send(tempProducts);
        }
      } else {
        res.send([...results, ...tempProducts]);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

// Delete sale product data
router.delete("/deletesaleproduct/:saleproductId?", async (req, res) => {
  const saleproductId = req.params.saleproductId;
  if (!saleproductId) {
    return res.status(400).send("Invalid saleproduct ID");
  }

  if (String(saleproductId).startsWith("temp-")) {
    const deletedTempProduct = deleteTempProduct(saleproductId);

    if (!deletedTempProduct) {
      return res.status(404).send("Sale product not found");
    }

    return res.send({
      message: "Temporary sale product deleted",
      affectedRows: 1,
    });
  }

  try {
    const getSaleProductSql = "SELECT id, bill_id, bata, quantity FROM sale_product WHERE id = ?";
    const saleProduct = await query(getSaleProductSql, [saleproductId]);

    if (saleProduct.length === 0) {
      return res.status(404).send("Sale product not found");
    }

    const linkedBill = await query(
      `
        SELECT bill_no
        FROM sale_table
        WHERE TRIM(CAST(bill_no AS CHAR)) = TRIM(CAST(? AS CHAR))
        LIMIT 1
      `,
      [saleProduct[0].bill_id]
    );

    if (linkedBill.length > 0) {
      return res.status(400).send("Cannot delete sale product because it belongs to an existing bill");
    }

    const { bata, quantity } = saleProduct[0];

    const updateStockSql = `
      UPDATE stock 
      SET sale = sale - ?, closing = closing + ?
      WHERE Bata = ? AND DATE(date) = CURDATE()
    `;
    const updateStockValues = [quantity, quantity, bata];
    await query(updateStockSql, updateStockValues);

    console.log(`Stock reversed for bata ${bata}: -${quantity} sale, +${quantity} closing`);

    const updateFutureStockSql = `
      UPDATE stock 
      SET opening = opening + ?, closing = closing + ?
      WHERE Bata = ? AND DATE(date) > CURDATE()
    `;
    const updateFutureValues = [quantity, quantity, bata];
    await query(updateFutureStockSql, updateFutureValues);

    console.log(`Future stock entries updated for bata ${bata}`);

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

// Add product to TEMPORARY storage (NOT database)
router.post("/insertsaleproduct", async (req, res) => {
  const { bill_id, bata, mark, product, quantity, rate, price } = req.body;

  if (!bill_id || !bata || !mark || !product || !quantity || !rate || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { item, products } = upsertProduct({
      bill_id,
      bata,
      mark,
      product,
      quantity,
      rate,
      price,
    });

    console.log(`Temporary sale item ready for bill ${bill_id}: ${item.product} (${item.bata})`);

    return res.status(200).json({
      message: "Product added to temporary storage. Will be saved when bill is saved.",
      tempProducts: products,
    });
  } catch (error) {
    console.error("Error adding product to temp storage:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Get temporary products for a bill
router.get("/temp/:bill_id", (req, res) => {
  const bill_id = req.params.bill_id;
  const products = getProductsForBill(bill_id);
  return res.status(200).json({
    bill_id,
    products,
    count: products.length,
  });
});

// Clear temporary products after bill is saved
router.delete("/temp/:bill_id", (req, res) => {
  const bill_id = req.params.bill_id;
  clearProductsForBill(bill_id);
  console.log(`Temporary products cleared for bill: ${bill_id}`);
  return res.status(200).json({ message: "Temporary products cleared" });
});

// Update sale product
router.put("/updatesaleproduct", async (req, res) => {
  const { bill_id, bata, mark, product, quantity, rate, price, id } = req.body;

  if (!bill_id || !bata || !mark || !product || !quantity || !rate || !price || !id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (String(id).startsWith("temp-")) {
    const updatedTempProduct = updateTempProduct(id, {
      bill_id,
      bata,
      mark,
      product,
      quantity,
      rate,
      price,
    });

    if (!updatedTempProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Temporary product updated successfully",
      updatedProduct: updatedTempProduct,
    });
  }

  const checkSql = "SELECT bata, quantity FROM sale_product WHERE id = ?";
  const checkValues = [id];

  try {
    const existingProduct = await query(checkSql, checkValues);

    if (existingProduct.length > 0) {
      const oldBata = existingProduct[0].bata;
      const oldQuantity = Number(existingProduct[0].quantity) || 0;
      const newQuantity = Number(quantity) || 0;
      const quantityDifference = newQuantity - oldQuantity;

      const updateSql = "UPDATE sale_product SET bata = ?, mark = ?, product = ?, quantity = ?, rate = ?, price = ? WHERE id = ?";
      const updateValues = [bata, mark, product, newQuantity, rate, price, id];

      await query(updateSql, updateValues);
      console.log("Quantity, rate, and price updated in sale_product table");

      const updatedProductSql = "SELECT * FROM sale_product WHERE id = ?";
      const updatedProduct = await query(updatedProductSql, [id]);

      if (oldBata !== bata) {
        await query(
          "UPDATE stock SET sale = sale - ?, closing = closing + ? WHERE Bata = ? AND DATE(date) = CURDATE()",
          [oldQuantity, oldQuantity, oldBata]
        );
        await query(
          "UPDATE stock SET sale = sale + ?, closing = closing - ? WHERE Bata = ? AND DATE(date) = CURDATE()",
          [newQuantity, newQuantity, bata]
        );
      } else if (quantityDifference !== 0) {
        const checkTodayStockSql = "SELECT * FROM stock WHERE Bata = ? AND DATE(date) = CURDATE()";
        const todayStock = await query(checkTodayStockSql, [bata]);

        if (todayStock.length > 0) {
          const updateStockSql = "UPDATE stock SET sale = sale + ?, closing = closing - ? WHERE Bata = ? AND DATE(date) = CURDATE()";
          const updateStockValues = [quantityDifference, quantityDifference, bata];
          await query(updateStockSql, updateStockValues);
          console.log("Stock updated for same day update");
        } else {
          const previousStockSql = "SELECT * FROM stock WHERE Bata = ? ORDER BY date DESC, id DESC LIMIT 1";
          const previousStock = await query(previousStockSql, [bata]);

          if (previousStock.length > 0) {
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
        message: "Product updated successfully in sale_product and stock updated",
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

module.exports = router;
