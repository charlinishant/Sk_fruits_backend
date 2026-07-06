const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

function trimText(value) {
  return String(value || "").trim();
}

function normalizeName(value) {
  return trimText(value).replace(/\s+/g, " ").toUpperCase();
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function getSessionName(req) {
  return trimText(req.body.updated_by || req.body.created_by || req.body.user) || "System";
}

function validateProductInput(body) {
  const product = {
    name: trimText(body.name),
    category: trimText(body.category),
    rate: trimText(body.rate),
    w_rate: trimText(body.w_rate),
    minimum_stock: trimText(body.minimum_stock),
    rate_editable: body.rate_editable ? 1 : 0,
    barcode: trimText(body.barcode),
  };

  if (!product.name) return { error: "Product name is required" };
  if (!product.category) return { error: "Category is required" };
  if (product.name.length > 50) return { error: "Product name must be 50 characters or less" };
  if (product.category.length > 50) return { error: "Category must be 50 characters or less" };

  const rate = toNumber(product.rate);
  const wholesaleRate = toNumber(product.w_rate);
  const minimumStock = toNumber(product.minimum_stock);

  if (!Number.isFinite(rate) || rate < 0) return { error: "Rate must be a valid positive number" };
  if (!Number.isFinite(wholesaleRate) || wholesaleRate < 0) {
    return { error: "W Rate must be a valid positive number" };
  }
  if (!Number.isFinite(minimumStock) || minimumStock < 0) {
    return { error: "Minimum Stock must be a valid positive number" };
  }
  if (product.barcode && product.barcode.length > 80) {
    return { error: "Barcode must be 80 characters or less" };
  }

  return {
    product: {
      ...product,
      rate: String(rate),
      w_rate: wholesaleRate,
      minimum_stock: minimumStock,
    },
  };
}

async function tableColumns(tableName) {
  const rows = await query(`SHOW COLUMNS FROM ${tableName}`);
  return new Set(rows.map((row) => row.Field));
}

async function ensureProductSchema() {
  const productColumns = await tableColumns("product");
  if (!productColumns.has("barcode")) {
    await query("ALTER TABLE product ADD COLUMN barcode VARCHAR(80) DEFAULT NULL AFTER minimum_stock");
  }

  await query(`
    CREATE TABLE IF NOT EXISTS product_edit_history (
      id INT NOT NULL AUTO_INCREMENT,
      product_id INT NOT NULL,
      old_product_json LONGTEXT NOT NULL,
      new_product_json LONGTEXT NOT NULL,
      edited_by VARCHAR(100) DEFAULT NULL,
      edit_date DATE NOT NULL,
      edit_time TIME NOT NULL,
      action VARCHAR(20) NOT NULL,
      PRIMARY KEY (id),
      KEY idx_product_edit_history_product (product_id, edit_date, edit_time)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
}

async function findDuplicateProduct(name, barcode, excludeId) {
  const params = [normalizeName(name)];
  let sql = "SELECT id, name, barcode FROM product WHERE UPPER(TRIM(name)) = ? AND COALESCE(is_active, 1) = 1";

  if (excludeId) {
    sql += " AND id <> ?";
    params.push(excludeId);
  }

  const [nameDuplicate] = await query(sql, params);
  if (nameDuplicate) {
    return { field: "name", message: "Product name already exists" };
  }

  if (barcode) {
    const barcodeParams = [barcode];
    let barcodeSql = "SELECT id FROM product WHERE barcode = ? AND COALESCE(is_active, 1) = 1";
    if (excludeId) {
      barcodeSql += " AND id <> ?";
      barcodeParams.push(excludeId);
    }
    const [barcodeDuplicate] = await query(barcodeSql, barcodeParams);
    if (barcodeDuplicate) {
      return { field: "barcode", message: "Barcode already exists" };
    }
  }

  return null;
}

async function productStock(productName) {
  const [row] = await query(
    "SELECT COALESCE(SUM(closing), 0) AS current_stock FROM stock WHERE product_name = ?",
    [productName]
  );
  return Number(row && row.current_stock) || 0;
}

async function addHistory(productId, oldProduct, newProduct, action, editedBy) {
  await ensureProductSchema();
  await query(
    `INSERT INTO product_edit_history
      (product_id, old_product_json, new_product_json, edited_by, edit_date, edit_time, action)
     VALUES (?, ?, ?, ?, CURDATE(), CURTIME(), ?)`,
    [
      productId,
      JSON.stringify(oldProduct || {}),
      JSON.stringify(newProduct || {}),
      editedBy,
      action,
    ]
  );
}

async function productList(filters = {}) {
  await ensureProductSchema();
  const params = [];
  let where = "WHERE COALESCE(p.is_active, 1) = 1";

  if (filters.search) {
    where += " AND (p.name LIKE ? OR p.category LIKE ? OR p.barcode LIKE ?)";
    const search = `%${filters.search}%`;
    params.push(search, search, search);
  }
  if (filters.barcode) {
    where += " AND p.barcode = ?";
    params.push(filters.barcode);
  }

  return query(
    `SELECT
       p.*,
       COALESCE(st.current_stock, 0) AS current_stock,
       CASE
         WHEN COALESCE(st.current_stock, 0) <= COALESCE(p.minimum_stock, 0) THEN 'Low Stock'
         ELSE 'In Stock'
       END AS stock_status
     FROM product p
     LEFT JOIN (
       SELECT product_name, SUM(closing) AS current_stock
       FROM stock
       GROUP BY product_name
     ) st ON st.product_name = p.name
     ${where}
     ORDER BY p.name`,
    params
  );
}

router.get("/history/:productId", async function (req, res) {
  try {
    await ensureProductSchema();
    const rows = await query(
      `SELECT *
         FROM product_edit_history
        WHERE product_id = ?
        ORDER BY id DESC`,
      [req.params.productId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching product history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:productId?", async function (req, res) {
  try {
    const productId = req.params.productId;

    if (productId) {
      await ensureProductSchema();
      const rows = await productList({});
      const product = rows.find((row) => String(row.id) === String(productId));
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.json([product]);
    }

    const results = await productList({
      search: trimText(req.query.search),
      barcode: trimText(req.query.barcode),
    });
    res.json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/deleteproductId/:productId?", async (req, res) => {
  try {
    await ensureProductSchema();
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const [oldProduct] = await query("SELECT * FROM product WHERE id = ?", [productId]);
    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentStock = await productStock(oldProduct.name);
    if (currentStock > 0) {
      return res.status(409).json({ message: "Cannot delete product while stock is available" });
    }

    const result = await query("UPDATE product SET is_active = 0 WHERE id = ?", [productId]);
    await addHistory(productId, oldProduct, { ...oldProduct, is_active: 0 }, "DELETE", "System");
    res.json(result);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/insertproduct", async (req, res) => {
  try {
    await ensureProductSchema();
    const validation = validateProductInput(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const product = validation.product;
    const duplicate = await findDuplicateProduct(product.name, product.barcode);
    if (duplicate) {
      return res.status(409).json({ message: duplicate.message, field: duplicate.field });
    }

    const sql =
      `INSERT INTO product
        (name, category, rate, w_rate, minimum_stock, barcode, rate_editable, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      product.name,
      product.category,
      product.rate,
      product.w_rate,
      product.minimum_stock,
      product.barcode || null,
      product.rate_editable,
      1,
    ];

    const results = await query(sql, values);
    await addHistory(results.insertId, null, { id: results.insertId, ...product, is_active: 1 }, "CREATE", getSessionName(req));
    res.json(results);
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/updateProduct/:productId", async (req, res) => {
  try {
    await ensureProductSchema();
    const productId = req.params.productId;
    const validation = validateProductInput(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const product = validation.product;
    const [oldProduct] = await query("SELECT * FROM product WHERE id = ?", [productId]);
    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const duplicate = await findDuplicateProduct(product.name, product.barcode, productId);
    if (duplicate) {
      return res.status(409).json({ message: duplicate.message, field: duplicate.field });
    }

    const currentStock = await productStock(oldProduct.name);
    if (currentStock < 0) {
      return res.status(409).json({ message: "Stock validation failed for this product" });
    }

    const sql =
      `UPDATE product
          SET name = ?, category = ?, rate = ?, w_rate = ?, minimum_stock = ?,
              barcode = ?, rate_editable = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`;
    const values = [
      product.name,
      product.category,
      product.rate,
      product.w_rate,
      product.minimum_stock,
      product.barcode || null,
      product.rate_editable,
      1,
      productId,
    ];
    const result = await query(sql, values);

    if (normalizeName(oldProduct.name) !== normalizeName(product.name)) {
      await query("UPDATE purchase_product SET product_name = ? WHERE product_name = ?", [product.name, oldProduct.name]);
      await query("UPDATE stock SET product_name = ? WHERE product_name = ?", [product.name, oldProduct.name]);
      await query("UPDATE sale_product SET product = ? WHERE product = ?", [product.name, oldProduct.name]);
    }

    await addHistory(
      productId,
      oldProduct,
      { id: Number(productId), ...product, is_active: 1 },
      "UPDATE",
      getSessionName(req)
    );

    res.status(200).json({ message: "Product updated successfully", data: result });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
