const express = require("express");
const router = express.Router();

const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");
const { jsPDF } = require("jspdf");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { getProductsForBill, clearProductsForBill } = require("../state/saleTempStore");
require("jspdf-autotable");
router.use(bodyParser.json());
const imagePath = path.join(__dirname, "..", "public", "images", "logo.png");
var imgData = fs.readFileSync(imagePath).toString("base64");
const imagePath1 = path.join(__dirname, "..", "public", "images", "a4.png");
var imgData1 = fs.readFileSync(imagePath1).toString("base64");
const fontPath =
  "./Noto_Sans_Devanagari/NotoSansDevanagari-VariableFont_wdth,wght.ttf";
const fontFile = fs.readFileSync(fontPath);
const base64Font = fontFile.toString("base64");

async function persistPendingSaleProducts(billNo, products) {
  if (!products || products.length === 0) {
    return;
  }

  for (const product of products) {
    const sqlProduct =
      "INSERT INTO sale_product (bill_id, bata, mark, product, quantity, rate, price) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const valuesProduct = [
      billNo,
      product.bata || "",
      product.mark || "",
      product.product || "",
      product.quantity || 0,
      product.rate || 0,
      product.price || 0,
    ];
    await query(sqlProduct, valuesProduct);

    const checkTodayStockSql =
      "SELECT * FROM stock WHERE Bata = ? AND DATE(date) = CURDATE()";
    const todayStock = await query(checkTodayStockSql, [product.bata]);

    if (todayStock.length > 0) {
      const updateStockSql =
        "UPDATE stock SET sale = sale + ?, closing = closing - ? WHERE Bata = ? AND DATE(date) = CURDATE()";
      await query(updateStockSql, [product.quantity, product.quantity, product.bata]);
    } else {
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
              COALESCE(purchase_id, '') as purchase_id,
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
      await query(stockInsertSql, [
        product.bata,
        product.product,
        product.mark,
        product.quantity,
        product.quantity,
        product.bata,
      ]);
    }
  }

  clearProductsForBill(billNo);
}

router.post("/generate-bill/:billNo?", async (req, res) => {
  try {
    const billNo = req.params.billNo;
    const data = req.body;

    const utcDate = new Date(data.results[0].date);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Kolkata",
    };

    const base64Font = fs.readFileSync(fontPath).toString("base64");

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bill</title>
          <style>
              @font-face {
                  font-family: 'Noto Sans Devanagari';
                  src: url('data:font/ttf;base64,${base64Font}') format('truetype');
              }
              body {
                  font-family: 'Noto Sans Devanagari', Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .header .logo img {
                  height: 125px;
              }
.container2 {
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 12px; /* Adjust font size */
    font-weight: bold;
}
    .container2::after {
    content: url("data:image/png;base64,${imgData}"); /* Replace with your watermark image path */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center the watermark */
    opacity: 0.2; /* Adjust watermark opacity (0 for transparent, 1 for solid) */
    z-index: -0; /* Place the watermark behind the content */
    }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: right;
              }
              th {
                  background-color: #f2f2f2;
              }
              .details {
                  text-align: center;
                  margin-top: 20px;
              }
              @media print {
                  @page {
                      size: A5 portrait;
                      margin: 5mm;
                  }
                  body {
                      margin: 0;
                      padding: 0;
                  }
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="logo">
                  <img src="data:image/png;base64,${imgData1}" alt="Company Logo">
              </div>
          </div>
          <div class="container2">
              <!-- Bill Details -->
              <table>
                  <tbody>
                      ${generateTableRows(data, utcDate, options, billNo)}
                  </tbody>
              </table>
              <!-- Items Table -->
              <table>
                  <thead>
                      <tr>
                          <th>अनु क्र.</th>
                          <th>प्रॉडक्ट</th>
                          <th>बटा</th>
                          <th>मार्क</th>
                          <th>नग</th>
                          <th>किंमत</th>
                          <th>रक्कम</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${generateItemsTableRows(data)}
                  </tbody>
                  <tfoot>
                      ${generateFooterRows(data)}
                  </tfoot>
              </table>
              <!-- Thank You Note -->
          </div>
      </body>
      </html>
    `;

    // Launch Puppeteer with flags
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Create a new page
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF with A5 size
    const pdfBuffer = await page.pdf({ format: "A5" });

    // Close the browser
    await browser.close();

    // Send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=saleReport_${billNo}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

function generateTableRows(data, utcDate, options, billNo) {
  var utcDate = new Date(data.results[0].date);
  var options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  };

  function convertToIST(dateString) {
    const utcDate = new Date(dateString); // Parse the UTC date
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return utcDate.toLocaleString("en-IN", options);
  }

  const currentDate = new Date(); // Get the current date and time
  const timestamp = currentDate.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }); // Format onl
  var billDetails = [
    {
      label: "बिल क्र.:" + billNo,
      value:
        "तारीख:" +
        utcDate.toLocaleString("en-IN", options) +
        " (" +
        convertToIST(data.results[0].created_at) +
        ")",
    },
    {
      label: "ग्राहकाचे नाव:" + data.results[0].cust_name,
      value: "संपर्क क्र.:" + data.results[0].mobile_no,
    },
    {
      label: "पत्ता:" + data.results[0].address,
      value: "संदर्भ :  " + data.results[0].comment,
    },
    // Add other bill details similarly
  ];

  return billDetails
    .map(
      (detail) => `
      <tr>
        <td><b>${detail.label}</b></td>
        <td>${detail.value}</td>
      </tr>
    `
    )
    .join("");
}

function generateItemsTableRows(data) {
  return data.products
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.product}</td>
        <td>${item.bata}</td>
        <td>${item.mark}</td>
        <td>${item.quantity}</td>
        <td>${item.rate}</td>
        <td>${item.price}</td>
      </tr>
    `
    )
    .join("");
}

function generateFooterRows(data) {
  const label =
    "आत्ता पर्यंतचे येणे बाकी कॅरेट : " +
    (data.results[0].baki_100 > 0
      ? "100 X " + data.results[0].baki_100 + " "
      : "") +
    (data.results[0].baki_150 > 0
      ? "150 X " + data.results[0].baki_150 + " "
      : "") +
    (data.results[0].baki_250 > 0
      ? "250 X " + data.results[0].baki_250 + " "
      : "") +
    (data.results[0].baki_350 > 0 ? "350 X " + data.results[0].baki_350 : "");

  const label1 =
    "गेलेले कॅरेट : " +
    (data.results[0].in_carate_100 > 0
      ? "100 X " + data.results[0].in_carate_100 + " "
      : "") +
    (data.results[0].in_carate_150 > 0
      ? "150 X " + data.results[0].in_carate_150 + " "
      : "") +
    (data.results[0].in_carate_250 > 0
      ? "250 X " + data.results[0].in_carate_250 + " "
      : "") +
    (data.results[0].in_carate_350 > 0
      ? "350 X " + data.results[0].in_carate_350
      : "");

  const label2 =
    "जमा कॅरेट : " +
    (data.results[0].out_carate_100 > 0
      ? "100 X " + data.results[0].out_carate_100 + " "
      : "") +
    (data.results[0].out_carate_150 > 0
      ? "150 X " + data.results[0].out_carate_150 + " "
      : "") +
    (data.results[0].out_carate_250 > 0
      ? "250 X " + data.results[0].out_carate_250 + " "
      : "") +
    (data.results[0].out_carate_350 > 0
      ? "350 X " + data.results[0].out_carate_350
      : "");

  var showLabels = true;
  if (data.results[0].cr_dr_type == "no") {
    showLabels = false;
  }
  const footerDetails = [
    {
      label: label1.trim(),
      value: data.results[0].carate_amount,
      visible: showLabels,
    },
    { label: "चालू कलम रक्कम:", value: data.results[0].amount, visible: true },
    { label: "मागील बाकी:", value: data.results[0].pre_balance, visible: true },
    {
      label: "एकूण रक्कम:",
      value: data.results[0].total_amount,
      visible: true,
    },
    { label: "रोख जमा रक्कम:", value: data.results[0].cash, visible: true },
    {
      label: "ऑनलाईन जमा रक्कम (जमा बँक) :",
      value:
        data.results[0].online_amt + "(" + data.results[0].online_acc + ")",
      visible: true,
    },
    // { label: "ऑनलाईन जमा बँक :", value: data.results[0].online_acc, visible: true },
    // { label: "ऑनलाईन जमा रक्कम:", value: data.results[0].online_amt, visible: true },
    { label: "सूट रक्कम:", value: data.results[0].discount, visible: true },
    // { label: "जमा कॅरेट: 100 X  " + data.results[0].out_carate_100 + "  150 X  " + data.results[0].out_carate_150 + "  250 X  " + data.results[0].out_carate_250 + "  350 X  " +  data.results[0].out_carate_350, value: data.results[0].inCarat },
    {
      label: label2.trim(),
      value: data.results[0].inCarat,
      visible: showLabels,
    },
    { label: label.trim(), value: "", visible: showLabels },
    {
      label: "आत्ता पर्यंतचे येणे बाकी:",
      value: data.results[0].balance,
      visible: true,
    },
  ];

  let rows = "";

  footerDetails.forEach((detail) => {
    rows += `
      <tr>
        <td align="right" colspan="6" style="text-align:right;"><font color="black">${
          detail.label
        }</font></td>
        ${
          detail.visible
            ? `<td align="right" colspan="1" style="text-align:right;"><font color="black">${detail.value}</font></td>`
            : ""
        }
      </tr>
    `;
  });

  return rows;
}

//Fetch Sale Data
router.get("/:saleId?", function (req, res) {
  const saleId = req.params.saleId;
  let sql = "SELECT * FROM sale_table";
  // let params = [];

  if (saleId) {
    sql += ` WHERE bill_no = ${mysql.escape(saleId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("sale data not found");
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

router.get("/validate/:saleId?", function (req, res) {
  const saleId = req.params.saleId;
  let sql = "Update sale_table set validate = 'Verified' ";
  // let params = [];

  if (saleId) {
    sql += ` WHERE bill_no = ${mysql.escape(saleId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("sale data not found");
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

// Delete sale data
router.delete("/deletesaleId/:saleId?", async (req, res) => {
  const saleId = req.params.saleId;

  // Validate saleId
  if (!saleId) {
    return res.status(400).send("Invalid sale ID");
  }

  try {
    // Delete from ledger table
    const sql1 = "DELETE FROM ledger WHERE summary = ?";
    const values1 = ["Sale(" + saleId + ")"];
    await query(sql1, values1);

    // Delete from carate_report table
    const sql4 = "DELETE FROM carate_report WHERE summary = ?";
    const values4 = ["Sale(" + saleId + ")"];
    await query(sql4, values4);

    // Update account_table
    const sql = `
      UPDATE account_table
      SET current_balance = current_balance - (
        SELECT balance - pre_balance  FROM sale_table WHERE bill_no = ?
      )
      WHERE account_group = "Customer"
      AND name = (
        SELECT cust_name FROM sale_table WHERE bill_no = ?
      )
    `;
    const values = [saleId, saleId];
    await query(sql, values);

    // Update carate_user
    const sql5 = `
      UPDATE carate_user
      SET carate_100 = carate_100 + (
        SELECT out_carate_100 - in_carate_100 FROM sale_table WHERE bill_no = ?
      ),
      carate_150 = carate_150 + (
        SELECT out_carate_150 - in_carate_150 FROM sale_table WHERE bill_no = ?
      ),
      carate_250 = carate_250 + (
        SELECT out_carate_250 - in_carate_250 FROM sale_table WHERE bill_no = ?
      ),
      carate_350 = carate_350 + (
        SELECT out_carate_350 - in_carate_350 FROM sale_table WHERE bill_no = ?
      )
      WHERE user_id = (
        SELECT cust_name FROM sale_table WHERE bill_no = ?
      )
    `;
    const values5 = [saleId, saleId, saleId, saleId, saleId];
    await query(sql5, values5);

    // Revert stock - add back the sold quantity
    const saleProducts = await query(
      "SELECT bata, quantity FROM sale_product WHERE bill_id = ?",
      [saleId]
    );
    
    for (const product of saleProducts) {
      await query(
        "UPDATE stock SET sale = sale - ?, closing = closing + ? WHERE Bata = ? AND DATE(date) = CURDATE()",
        [product.quantity, product.quantity, product.bata]
      );
    }
    
    // Delete from sale_product
    await query("DELETE FROM sale_product WHERE bill_id = ?", [saleId]);

    // Delete from sale_table
    const sql2 = "DELETE FROM sale_table WHERE bill_no = ?";
    const values2 = [saleId];
    const result2 = await query(sql2, values2);

    if (result2.affectedRows === 0) {
      res.status(404).send("saleId not found");
    } else {
      res.send(result2);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add sale data
router.post("/insertsale", async (req, res) => {
  // Get THe data from request body
  const {
    bill_no,
    date,
    cust_name,
    route,
    address,
    mobile_no,
    comment,
    amount,
    carate_amount,
    pre_balance,
    total_amount,
    cash,
    online_acc,
    online_amt,
    discount,
    inCarate,
    balance,
    note,
    in_carate_100,
    in_carate_150,
    in_carate_250,
    in_carate_350,
    out_carate_100,
    out_carate_150,
    out_carate_250,
    out_carate_350,
    added_by,
    baki_100,
    baki_150,
    baki_250,
    baki_350,
    products = [],
  } = req.body;

  const normalizedProducts = Array.isArray(products)
    ? products
        .map((product) => ({
          bata: (product && product.bata) || "",
          mark: (product && product.mark) || "",
          product: (product && product.product) || "",
          quantity: Number((product && product.quantity) || 0),
          rate: Number((product && product.rate) || 0),
          price: Number((product && product.price) || 0),
        }))
        .filter(
          (product) =>
            product.bata &&
            product.product &&
            product.quantity > 0 &&
            product.rate >= 0 &&
            product.price >= 0
        )
    : [];

  const productsToSave =
    normalizedProducts.length > 0 ? normalizedProducts : getProductsForBill(bill_no);

  // Validate incoming data
  if (!bill_no || !date || !cust_name || !route || !address || !mobile_no) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!comment || !String(comment).trim()) {
    return res.status(400).json({ message: "Reference is required" });
  }
  if (!note || !String(note).trim()) {
    return res.status(400).json({ message: "Sandarbh is required" });
  }
  if (!productsToSave || productsToSave.length === 0) {
    return res.status(400).json({ message: "At least one product is required to save a bill" });
  }

  // Insert data into the database
  const sql =
    "INSERT INTO sale_table (bill_no , date ,cust_name, route,address, mobile_no , comment , amount, carate_amount, pre_balance,total_amount, cash ,online_acc ,online_amt,discount ,balance,inCarat ,note,in_carate_100,in_carate_150, in_carate_250, in_carate_350, out_carate_100, out_carate_150, out_carate_250, out_carate_350,added_by,validate,baki_100,baki_150,baki_250,baki_350  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)";
  const values = [
    bill_no,
    date,
    cust_name,
    route,
    address,
    mobile_no,
    comment,
    amount,
    carate_amount,
    pre_balance,
    total_amount,
    cash,
    online_acc,
    online_amt,
    discount,
    balance,
    inCarate,
    note,
    in_carate_100,
    in_carate_150,
    in_carate_250,
    in_carate_350,
    out_carate_100,
    out_carate_150,
    out_carate_250,
    out_carate_350,
    added_by,
    "Pending",
    baki_100,
    baki_150,
    baki_250,
    baki_350,
  ];

  try {
    // STEP 1: Save bill to sale_table FIRST
    const results = await query(sql, values);
    console.log("Sale INSERT Results:", results);
    console.log("Sale data:", { bill_no, date, cust_name, balance });

    if (results.affectedRows === 0) {
      console.error("Sale table INSERT failed - no rows affected");
      return res.status(404).send("saletable not inserted");
    }

    // STEP 2: Update related tables
    const sql1 =
      'update account_table set current_balance = ? where account_group = "Customer" and mobile_no = ?';
    const values1 = [balance, mobile_no];
    await query(sql1, values1);

    const updateBillTrackingSql = `
      UPDATE bill_tracking 
      SET status = 'inactive' 
      WHERE user_id = ? AND bill_id = ?
    `;
    await query(updateBillTrackingSql, [added_by, bill_no]);

    const sql2 =
      "INSERT INTO ledger (date,summary,balance,out_carate,total_balance,cash,online,discount,in_carate,remaining,route,customer_name,online_bank,added_by ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values2 = [
      date,
      "Sale(" + bill_no + ")",
      amount,
      carate_amount,
      total_amount,
      cash,
      online_amt,
      discount,
      inCarate,
      balance,
      route,
      cust_name,
      online_acc,
      added_by,
    ];
    await query(sql2, values2);

    const sql3 =
      "INSERT INTO carate_report (carate_date,summary,customer_name,in_carate_100,in_carate_150, in_carate_250, in_carate_350, out_carate_100, out_carate_150, out_carate_250, out_carate_350, in_carate_total, out_carate_total ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values3 = [
      date,
      "sale(" + bill_no + ")",
      cust_name,
      out_carate_100,
      out_carate_150,
      out_carate_250,
      out_carate_350,
      in_carate_100,
      in_carate_150,
      in_carate_250,
      in_carate_350,
      inCarate,
      carate_amount,
    ];
    await query(sql3, values3);

    const sql4 = "Select * from carate_user where user_id = ?";
    const values4 = [cust_name];
    const carateResults = await query(sql4, values4);
    
    let sql5;
    let values5;
    if (carateResults.length === 0) {
      sql5 =
        "INSERT INTO carate_user (user_id,carate_100,carate_150, carate_250, carate_350) VALUES (?, ?, ?, ?, ?)";
      values5 = [
        cust_name,
        in_carate_100,
        in_carate_150,
        in_carate_250,
        in_carate_350,
      ];
    } else {
      sql5 =
        "update carate_user set carate_100 = carate_100 + ? - ? ,carate_150 = carate_150 + ? - ?, carate_250 = carate_250 + ? - ?, carate_350 = carate_350 + ? - ? where user_id = ?";
      values5 = [
        in_carate_100,
        out_carate_100,
        in_carate_150,
        out_carate_150,
        in_carate_250,
        out_carate_250,
        in_carate_350,
        out_carate_350,
        cust_name,
      ];
    }
    await query(sql5, values5);

    // STEP 3: Insert products ONLY AFTER bill is saved
    if (productsToSave && productsToSave.length > 0) {
      for (const product of productsToSave) {
        const sqlProduct = "INSERT INTO sale_product (bill_id, bata, mark, product, quantity, rate, price) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const valuesProduct = [bill_no, product.bata || '', product.mark || '', product.product || '', product.quantity || 0, product.rate || 0, product.price || 0];
        await query(sqlProduct, valuesProduct);
        console.log(`✅ Product inserted: ${product.product} (${product.bata}) - Qty: ${product.quantity}`);
        
        const checkTodayStockSql = "SELECT * FROM stock WHERE Bata = ? AND DATE(date) = CURDATE()";
        const todayStock = await query(checkTodayStockSql, [product.bata]);
        
        if (todayStock.length > 0) {
          const updateStockSql = "UPDATE stock SET sale = sale + ?, closing = closing - ? WHERE Bata = ? AND DATE(date) = CURDATE()";
          await query(updateStockSql, [product.quantity, product.quantity, product.bata]);
          console.log(`✅ Stock updated: ${product.bata} - Sold: ${product.quantity}`);
        } else {
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
              COALESCE(purchase_id, '') as purchase_id,
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
          await query(stockInsertSql, [product.bata, product.product, product.mark, product.quantity, product.quantity, product.bata]);
          console.log(`✅ New stock entry created: ${product.bata}`);
        }
      }

      clearProductsForBill(bill_no);
    }

    res.send(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// update sale data
router.put("/updateSale/:saleId", async (req, res) => {
  try {
    const saleId = req.params.saleId;
    const {
      bill_no,
      date,
      cust_name,
      route,
      address,
      mobile_no,
      comment,
      amount,
      carate_amount,
      pre_balance,
      total_amount,
      cash,
      online_acc,
      online_amt,
      discount,
      inCarate,
      balance,
      note,
      in_carate_100,
      in_carate_150,
      in_carate_250,
      in_carate_350,
      out_carate_100,
      out_carate_150,
      out_carate_250,
      out_carate_350,
      added_by,
      baki_100,
      baki_150,
      baki_250,
      baki_350,
    } = req.body;

    const sql1 = "Delete from ledger where summary = ? ";
    const values1 = ["Sale(" + bill_no + ")"];
    const result1 = await query(sql1, values1);

    const sql4 = "Delete from carate_report where summary = ? ";
    const values4 = ["Sale(" + bill_no + ")"];
    const result4 = await query(sql4, values4);

    const [oldSale] = await query(
      "SELECT balance FROM sale_table WHERE bill_no = ?",
      [bill_no]
    );

    if (!oldSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const oldBalance = oldSale.balance;

    const sql2 =
      "INSERT INTO ledger (date,summary,balance,out_carate,total_balance,cash,online,discount,in_carate,remaining,route,customer_name,online_bank,added_by ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values2 = [
      date,
      "Sale(" + bill_no + ")",
      amount,
      carate_amount,
      total_amount,
      cash,
      online_amt,
      discount,
      inCarate,
      balance,
      route,
      cust_name,
      online_acc,
      added_by,
    ];
    const ledger = await query(sql2, values2);
    if (ledger.affectedRows === 0) {
      return res.status(404).json({ message: "Ledger Data not inserted" });
    }

    const sql3 =
      "INSERT INTO carate_report (carate_date,summary,customer_name,in_carate_100,in_carate_150, in_carate_250, in_carate_350, out_carate_100, out_carate_150, out_carate_250, out_carate_350, in_carate_total, out_carate_total ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values3 = [
      date,
      "sale(" + bill_no + ")",
      cust_name,
      out_carate_100,
      out_carate_150,
      out_carate_250,
      out_carate_350,
      in_carate_100,
      in_carate_150,
      in_carate_250,
      in_carate_350,
      inCarate,
      carate_amount,
    ];
    const carate = await query(sql3, values3);
    if (carate.affectedRows === 0) {
      return res.status(404).json({ message: "Carate Data not inserted" });
    }

    const balanceDifference = balance - oldBalance;

    // const sql5 =
    //   'update account_table set current_balance = current_balance + (? - current_balance) where account_group = "Customer" and name = ?';
    // const values5 = [balance, cust_name];
    const sql5 = `
      UPDATE account_table
      SET current_balance = current_balance + ?
      WHERE account_group = "Customer" AND name = ?
    `;

    const values5 = [balanceDifference, cust_name];
    
    const results1 = await query(sql5, values5);
    if (results1.affectedRows === 0) {
      return res.status(404).json({ message: "Account Table not updated" });
    }

    sql6 =
      "update carate_user set carate_100 = carate_100 + (select out_carate_100 - in_carate_100 from sale_table where bill_no = ?) + ? - ? ,carate_150 = carate_150 + (select out_carate_150 - in_carate_150 from sale_table where bill_no = ?) + ? - ?, carate_250 = carate_250 + (select out_carate_250 - in_carate_250 from sale_table where bill_no = ?) + ? - ?, carate_350 = carate_350 + (select out_carate_350 - in_carate_350 from sale_table where bill_no = ?) + ? - ? where user_id = ?";
    console.log(
      "Updated Data",
      in_carate_100,
      in_carate_150,
      in_carate_250,
      in_carate_350,
      cust_name
    );
    values6 = [
      bill_no,
      in_carate_100,
      out_carate_100,
      bill_no,
      in_carate_150,
      out_carate_150,
      bill_no,
      in_carate_250,
      out_carate_250,
      bill_no,
      in_carate_350,
      out_carate_350,
      cust_name,
    ];
    const result6 = await query(sql6, values6);

    // Update data in the database
    const sql =
      'UPDATE sale_table SET date = ?, cust_name = ?, route = ?, address = ?, mobile_no = ?, comment = ?, amount = ?, carate_amount = ?, total_amount = ?, cash = ?, online_acc = ?, online_amt = ?, discount = ?,balance = ?, note =?, inCarat = ?,in_carate_100 = ?,in_carate_150 = ?, in_carate_250 = ?, in_carate_350 = ?, out_carate_100 = ?, out_carate_150 = ?, out_carate_250 = ?, out_carate_350 = ?,validate = "Pending", baki_100 = ? ,baki_150 = ? ,baki_250 = ? ,baki_350 = ? WHERE bill_no = ?';
    const values = [
      date,
      cust_name,
      route,
      address,
      mobile_no,
      comment,
      amount,
      carate_amount,
      total_amount,
      cash,
      online_acc,
      online_amt,
      discount,
      balance,
      note,
      inCarate,
      in_carate_100,
      in_carate_150,
      in_carate_250,
      in_carate_350,
      out_carate_100,
      out_carate_150,
      out_carate_250,
      out_carate_350,
      baki_100,
      baki_150,
      baki_250,
      baki_350,
      saleId,
    ];
    //date, cust_name, route, address, mobile_no, comment, amount, carate_amount, pre_balance, total_amount, cash, online_acc, online_amt, discount, inCarate, balance, note, in_carate_100, in_carate_150, in_carate_250, in_carate_350, out_carate_100, out_carate_150, out_carate_250, out_carate_350, added_by
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "saledata not found" });
    }

    await persistPendingSaleProducts(bill_no, getProductsForBill(bill_no));

    // Send response
    res
      .status(200)
      .json({ message: "Saledata updated successfully", data: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
