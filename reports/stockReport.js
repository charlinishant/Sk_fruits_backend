const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
require("jspdf-autotable");
var format = "PNG";
//format 'JPEG', 'PNG', 'WEBP'
const imagePath = path.join(__dirname, "..", "public", "images", "a4.png");
var imgData = fs.readFileSync(imagePath).toString("base64");

router.use(bodyParser.json());
const fontPath =
  "./Noto_Sans_Devanagari/NotoSansDevanagari-VariableFont_wdth,wght.ttf";
const fontFile = fs.readFileSync(fontPath);
const base64Font = fontFile.toString("base64");
// sample Input
// {
//     "from_date" : "2024-01-01",
//     "to_date" : "2024-02-01",
//     "bata" : "*",
//     "product" : "*"
//   }

//SQL Queryw
//
//Fetch purchase Data
router.post("/generate-pdf", (req, res) => {
  try {
    const data = req.body;

    const doc = new jsPDF('landscape');

    // Adding header details
    doc.setFontSize(10);
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
    doc.setFont("NotoSansDevanagari", "normal");
    
    // Use a4.png as full header image
    doc.addImage(imgData, format, 10, 8, 270, 50); // Adjusted for landscape
    let startY = 70;


    const customHeaders = [
      "purchase_id",
      "gadi_number",
      "supplier_name",
      "product_name",
      "bata",
      "purchase",
      "opening",
      "purchase",
      "sale",
      "closing",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.Purchase_iD,
      report.gadi_number,
      report.supplier_name,
      report.product_name,
      report.bata,
      report.purchase,
      report.opening,
      report.purchase,
      report.sale,
      report.closing,
    ]);

    // Calculate grand totals for Reports
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
      "attachment; filename=Stock_Report.pdf"
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
    bata,
    product,
    gadi_number,
    supplier_name,
    purchase_id,
  } = req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    'select purchase_id,Date,gadi_number,supplier_name,product_name,bata,CASE WHEN opening IS NULL OR opening = 0 THEN purchase ELSE opening END as opening,purchase,sale,closing,mark  FROM stock';
  var where = " where date between ?  and ? ";
  var values = [from_date, to_date];

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
  if (supplier_name !== "*") {
    where += "and supplier_name = ? ";
    values.push(supplier_name);
  }
  if (purchase_id !== "*") {
    where += "and purchase_id = ? ";
    values.push(purchase_id);
  }

  query(sql + where, values)
    .then((results) => {
      console.log("Stock Report Results:", results.slice(0, 2)); // Debug: show first 2 records
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        const data = { reports: results };
        res.send(data); // Send all results
        // Do something with the results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

module.exports = router;
