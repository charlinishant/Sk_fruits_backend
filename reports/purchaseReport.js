const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");
const { jsPDF } = require("jspdf");
const puppeteer = require("puppeteer");
const fs = require("fs");
require("jspdf-autotable");
router.use(bodyParser.json());
const imagePath = path.join(__dirname, "..", "public", "images", "a4.png");
var imgData = fs.readFileSync(imagePath).toString("base64");
const imagePath1 = path.join(__dirname, "..", "public", "images", "logo.png");
var imgData1 = fs.readFileSync(imagePath1).toString("base64");
router.use(bodyParser.json());
const fontPath =
  "./Noto_Sans_Devanagari/NotoSansDevanagari-VariableFont_wdth,wght.ttf";
const fontFile = fs.readFileSync(fontPath);
const base64Font = fontFile.toString("base64");
// sample Input
// {
//     "from_date" : "2024-01-01",
//     "to_date" : "2024-02-01",
//     "supplier_name" : "*",
//     "bata" : "*",
//     "gadi_number" : "*"
//   }

//SQL Query
//
//Fetch purchase Data

router.post("/generate-bill/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    const hasBodyData =
      req.body &&
      Array.isArray(req.body.reports) &&
      Array.isArray(req.body.Receipt);
    const data = hasBodyData ? req.body : await getPurchaseBillData(reportId);

    if (!data || !data.reports.length) {
      return res.status(404).send("No Report Found");
    }

    const productTotal = getProductTotal(data.Receipt);
    const expenses = parseFloat(data.reports[0].expenses) || 0;
    const grandTotal = productTotal + expenses;

    // Define the font path for Marathi support
    const base64Font = fs.readFileSync(fontPath).toString("base64");

    // Generate the HTML content
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Purchase Report</title>
            <style>
                @font-face {
                    font-family: 'Noto Sans Devanagari';
                    src: url('data:font/ttf;base64,${base64Font}') format('truetype');
                }
                body {
                    font-family: 'Noto Sans Devanagari', Arial, sans-serif;
                    padding: 0;
                    background-color: #f4f4f4;
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
    content: url("data:image/png;base64,${imgData1}"); /* Replace with your watermark image path */
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
                    margin-bottom: 10px;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                    background-color: #fffef4;
                }
                th {
                    background-color: #f2f2f2;
                }
                .details {
                    text-align: center;
                    margin-top: 20px;
                }
                @media print {
                    .details, .header-details, .close {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">
                    <img src="data:image/png;base64,${imgData}" alt="Company Logo">
                </div>
            </div>
            <div class="container2">
                <!-- Bill Details -->
                <table>
                    <tbody>
                        ${generateBillDetails(data.reports[0])}
                    </tbody>
                </table>
                <!-- Items Table -->
                <table>
                    <thead>
                        <tr>
                            <th>अनु क्र.</th>
                            <th>Product</th>
                            <th>बटा</th>
                            <th>Mark</th>
                            <th>नग</th>
                            <th>किंमत</th>
                            <th>रक्कम</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateItemsTable(data.Receipt)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="6" style="text-align: right; font-weight: bold;">Product Total:</td>
                            <td style="text-align: right; font-weight: bold;">${productTotal.toFixed(
                              2
                            )}</td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: right; font-weight: bold;">Expenses:</td>
                            <td style="text-align: right; font-weight: bold;">${(
                              expenses
                            ).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: right; font-weight: bold;">Grand Total:</td>
                            <td style="text-align: right; font-weight: bold;">${(
                              grandTotal
                            ).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="details">
                <h4>Thank you, visit again!</h4>
                <p><a href="https://datacrushanalytics.com/" style="color: #B1B6BA; font-size: 14px;">www.DataCrushAnalytics.com (Contact No: 7040040015)</a></p>
            </div>
        </body>
        </html>
        `;

    // Launch Puppeteer and generate the PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A5" });
    await browser.close();

    // Send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=PurchaseReport_${reportId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to generate bill details rows
function generateBillDetails(report) {
  const utcDate = new Date(report.date);
  const formattedDate = utcDate.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  const billDetails = [
    {
      label: `बिल क्र.: ${report.id}`,
      value: `तारीख: ${formattedDate}`,
    },
    {
      label: `सप्लायर नाव: ${report.supplier_name}`,
      value: `गाडी नंबर: ${report.gadi_number}`,
    },
    {
      label: `संपर्क क्र.: ${report.mobile_no}`,
      value: `पत्ता: ${report.address}`,
    },
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

// Function to generate items table rows
function generateItemsTable(receipt) {
  let counter = 1;

  return receipt
    .map((item) => {
      return `
          <tr>
              <td>${counter++}</td>
              <td>${item.product_name}</td>
              <td>${item.bata}</td>
              <td>${item.mark}</td>
              <td>${item.quantity}</td>
              <td>${item.purchase_price}</td>
              <td>${item.price}</td>
          </tr>
        `;
    })
    .join("");
}

function getProductTotal(receipt) {
  return receipt.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);
}

async function getPurchaseBillData(purchaseId) {
  const reports = await query(
    `SELECT p.id, p.date, p.supplier_name, p.gadi_number,
            a.mobile_no, a.address, COALESCE(p.expenses, 0) AS expenses
     FROM purchase p
     LEFT JOIN account_table a ON p.supplier_name = a.name
     WHERE p.id = ?`,
    [purchaseId]
  );

  if (reports.length === 0) return null;

  const receipt = await query(
    "SELECT * FROM purchase_product WHERE purchase_id = ?",
    [purchaseId]
  );
  const productTotal = getProductTotal(receipt);
  const expenses = parseFloat(reports[0].expenses) || 0;
  const quantity = receipt.reduce(
    (total, item) => total + (parseFloat(item.quantity) || 0),
    0
  );

  return {
    reports,
    Receipt: receipt,
    Grand: {
      "Grand Amournt": parseFloat((productTotal + expenses).toFixed(2)),
      "Grand Quantity": quantity,
    },
  };
}

// Example usage in an Express route

router.post("/generate-pdf", (req, res) => {
  try {
    const data = req.body;

    const doc = new jsPDF();

    // Adding header details
    doc.setFontSize(10);
    // doc.text("Mobile:- 9960607512", 10, 10);
    // Add an example image (base64 or URL)
    // Adjust the position and size as needed
    // doc.addImage("../public/images/skfruit.png", "PNG", 10, 15, 30, 30);
    const notoSansDevanagariBase64 = base64Font;

    // In your existing code, add these lines before using the font
    doc.addFileToVFS(
      "NotoSansDevanagari-VariableFont_wdth,wght.ttf",
      notoSansDevanagariBase64
    );
    doc.addFont(
      "NotoSansDevanagari-VariableFont_wdth,wght.ttf",
      "NotoSansDevanagari",
      "normal"
    );

    // var pageWidth = doc.internal.pageSize.getWidth(); // Get the page width
    // var pageHeight = doc.internal.pageSize.getHeight(); // Get the page height
    doc.setFont("NotoSansDevanagari", "normal");
    // doc.text("HEllo From Images", 15, 30);
    doc.addImage(imgData, "PNG", 10, 8, 190, 50);
    // doc.setFontSize(16);
    // doc.text("Savata Fruits Suppliers", 50, 20);
    // doc.setFontSize(12);
    // doc.text(
    //   "At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701",
    //   50,
    //   30
    // );
    // doc.text(
    //   "Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970",
    //   50,
    //   40
    // );
    let startY = 50;
    if (data.customerName && data.customerName !== "") {
      doc.text(`Customer Name: ${data.customerName}`, 50, 50);
      startY = 50; // Adjust startY for the next line
    }
    if (data.route && data.route !== "") {
      doc.text(`Route: ${data.route}`, 50, startY);
      startY += 10; // Adjust startY for the next section
    }
    const customHeaders = [
      "id",
      "date",
      "gadi_number",
      // "bata",
      "supplier_name",
      "Expenses",
      "BillAmount",
      "TotalQuantity",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.id,
      new Date(report.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      report.gadi_number,
      // report.bata,
      report.supplier_name,
      report.expenses,
      report.BillAmount,
      report.TotalQuantity,
    ]);

    // Calculate grand totals for Reports
    const grandTotalAmount = data.reports.reduce(
      (total, report) => total + parseFloat(report.BillAmount),
      0
    );
    const grandTotalQuantity = data.reports.reduce(
      (total, report) => total + parseFloat(report.TotalQuantity),
      0
    );

    reportData.push([
      "Grand Total:",
      "",
      "",
      "",
      "",
      grandTotalAmount.toFixed(2),
      grandTotalQuantity.toFixed(2),
    ]);

    // Add Reports table to PDF
    doc.autoTable({
      head: [customHeaders],
      body: reportData,
      startY: startY + 20,
      theme: "grid",
      styles: {
        font: "NotoSansDevanagari",
        fontStyle: "normal",
      },
      // Apply encoding to all cell data
      didParseCell: function (data) {
        if (data.cell.raw) {
          data.cell.text = encodeMarathi(data.cell.raw.toString());
        }
      },
    });

    // Helper function to encode Marathi text
    function encodeMarathi(text) {
      return decodeURIComponent(encodeURIComponent(text));
    }

    // Append grand totals to Reports table

    // Generate PDF as a buffer and send it as a response
    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Purchase_Report.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  // Get THe data from request body
  const {
    from_date,
    to_date,
    supplier_name,
    bata,
    product,
    gadi_number,
    purchase_id,
  } = req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    'select p.id,p.date,p.supplier_name,p.gadi_number,round(sum(price) + COALESCE(p.expenses, 0), 2) "BillAmount" , sum(pp.quantity) "TotalQuantity",COALESCE(p.expenses, 0) expenses from purchase p join purchase_product pp on(p.id=pp.purchase_id)';
  var where = "where date between ?  and ? ";
  const group = "group by p.id,p.date,p.supplier_name,p.gadi_number,p.expenses";
  var values = [from_date, to_date];

  if (supplier_name !== "*") {
    where += "and supplier_name = ? ";
    values.push(supplier_name);
  }
  if (bata !== "*") {
    where += "and bata = ?";
    values.push(bata);
  }

  if (product !== "*") {
    where += "and product_name = ?";
    values.push(product);
  }
  if (gadi_number !== "*") {
    where += "and gadi_number = ? ";
    values.push(gadi_number);
  }
  if (purchase_id !== "*") {
    where += "and purchase_id = ? ";
    values.push(purchase_id);
  }

  query(sql + where + group, values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        var amount = 0,
          quantity = 0;
        results.forEach((element) => {
          quantity += element.TotalQuantity;
          amount += parseFloat(element.BillAmount) || 0;
        });
        const data = {
          reports: results,
          Grand: { "Grand Amournt": amount, "Grand Quantity": quantity },
        };
        res.send(data); // Send all results
        // Do something with the results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

router.get("/:purchase_id", async (req, res) => {
  // Get THe data from request body
  purchase_id = req.params.purchase_id;

  // Validate incoming data
  // if (!from_date || !to_date) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // }

  const sql =
    "select p.id,p.date,p.supplier_name,p.gadi_number,mobile_no,address,expenses from purchase p join account_table a on(p.supplier_name=a.name) ";
  var where = "where p.id = ? ";
  var values = [purchase_id];

  // if (supplier_name !== '*'){
  //   where += "and supplier_name = ? "
  //   values.push(supplier_name)
  // }
  // if (bata !== '*'){
  //   where += "and bata = ?"
  //   values.push(bata)
  // }
  // if (gadi_number !== '*'){
  //   where += "and gadi_number = ? "
  //   values.push(gadi_number)
  // }

  query(sql + where, values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        const sql1 = "SELECT * FROM purchase_product ";
        var where1 = " where purchase_id = ? ";
        var values1 = [purchase_id];
        query(sql1 + where1, values1)
          .then((receipt) => {
            if (receipt.affectedRows === 0) {
              res.status(404).send("No Report Found");
            } else {
              var amount = 0,
                quantity = 0;
              receipt.forEach((element) => {
                quantity += element.quantity;
                amount += element.price;
              });
              const expenses = parseFloat(results[0].expenses) || 0;
              amount = parseFloat((amount + expenses).toFixed(2));
              // const data = {"reports" : results ,"Grand" : {"Grand Amournt" : amount,"Grand Quantity" : quantity}};
              // res.send(data); // Send all results
              // // Do something with the results

              const data = {
                reports: results,
                Receipt: receipt,
                Grand: { "Grand Amournt": amount, "Grand Quantity": quantity },
              };
              res.send(data); // Send all results
              // Do something with the results
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error"); // Send an error response to the client
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

// router.delete("/deletePurchaseReport/:purchaseId?", async (req, res) => {
//   const purchaseId = req.params.purchaseId;
//   if (!purchaseId) {
//     return res.status(400).send("Invalid account ID");
//   }

//   const sql1 =
//     'update account_table set current_balance = current_balance - (select total_quantity from purchase where id = ? ) where account_group = "Supplier" and name = (select supplier_name from purchase where id = ? )';
//   const values1 = [purchaseId, purchaseId];

//   var sql2 = "DELETE FROM stock where purchase_id = ?";
//   const values2 = [purchaseId];

//   var sql3 = "DELETE FROM purchase_product where purchase_id = ?";
//   const values3 = [purchaseId];

//   var sql = "DELETE FROM purchase where id = ? ";
//   const values = [purchaseId];

//   const queries = [
//     query(sql1, values1),
//     query(sql2, values2),
//     query(sql3, values3),
//     query(sql, values),
//   ];

//   const results = await Promise.all(queries);
//   res.send(results); // Send all results
// });

router.delete("/deletePurchaseReport/:purchaseId?", async (req, res) => {
  const purchaseId = req.params.purchaseId;
  if (!purchaseId) {
    return res.status(400).send("Invalid purchase ID");
  }

  try {
    const sql1 = `
      UPDATE account_table 
      SET current_balance = current_balance - (
        SELECT total_quantity FROM purchase WHERE id = ?
      )
      WHERE account_group = "Supplier" 
      AND name = (
        SELECT supplier_name FROM purchase WHERE id = ?
      )`;
    const result1 = await query(sql1, [purchaseId, purchaseId]);

    const sql2 = "DELETE FROM stock WHERE purchase_id = ?";
    const result2 = await query(sql2, [purchaseId]);

    const sql3 = "DELETE FROM purchase_product WHERE purchase_id = ?";
    const result3 = await query(sql3, [purchaseId]);

    const sql4 = "DELETE FROM purchase WHERE id = ?";
    const result4 = await query(sql4, [purchaseId]);

    res.status(200).send({
      message: "Purchase report deleted successfully",
      results: [result1, result2, result3, result4],
    });
  } catch (err) {
    console.error("Error deleting purchase report:", err);
    res.status(500).send("Failed to delete purchase report");
  }
});

module.exports = router;
