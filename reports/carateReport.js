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
//     "customer_name" : "*",
//   }

//SQL Query
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
      startY = 60; // Adjust startY for the next line
    }
    if (data.route && data.route !== "") {
      doc.text(`Route: ${data.route}`, 50, startY);
      startY += 10; // Adjust startY for the next section
    }
    const customHeaders = [
      "Date",
      "Customer Name",
      "Summary",
      "Out Carate",
      "Out Carate Total",
      "In Carate",
      "In Carate Total",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.carate_date,
      report.customer_name,
      report.summary,
      report.outCarate,
      report.out_carate_total,
      report.inCarate,
      report.in_carate_total,
    ]);

    const grandTotalRow = [
      "Grand Total",
      "",
      "",
      "",
      data.Grand["Grand out_carate_total"],
      "",
      data.Grand["Grand in_carate_total"],
    ];

    reportData.push(grandTotalRow);

    // Add report data and grand total to PDF
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
      "attachment; filename=Carate_Report.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, customer_name,route } = req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // const sql =
  //   'SELECT carate_date,customer_name,summary,concat("100 X ",in_carate_100,", 150 X ",in_carate_150,", 250 X ",in_carate_250,", 350 X ",in_carate_350)"inCarate",in_carate_total,concat("100 X ",out_carate_100,", 150 X ",out_carate_150,", 250 X ",out_carate_250,", 350 X ",out_carate_350)"OutCarate",out_carate_total FROM carate_report ';
  const sql = `
  SELECT carate_date,
       customer_name,
       route_detail,
       summary,
       CONCAT(
         CASE WHEN in_carate_100 > 0 THEN CONCAT("100 X ", in_carate_100, ", ") ELSE '' END,
         CASE WHEN in_carate_150 > 0 THEN CONCAT("150 X ", in_carate_150, ", ") ELSE '' END,
         CASE WHEN in_carate_250 > 0 THEN CONCAT("250 X ", in_carate_250, ", ") ELSE '' END,
         CASE WHEN in_carate_350 > 0 THEN CONCAT("350 X ", in_carate_350) ELSE '' END
       ) AS inCarate,
       in_carate_total,
       CONCAT(
         CASE WHEN out_carate_100 > 0 THEN CONCAT("100 X ", out_carate_100, ", ") ELSE '' END,
         CASE WHEN out_carate_150 > 0 THEN CONCAT("150 X ", out_carate_150, ", ") ELSE '' END,
         CASE WHEN out_carate_250 > 0 THEN CONCAT("250 X ", out_carate_250, ", ") ELSE '' END,
         CASE WHEN out_carate_350 > 0 THEN CONCAT("350 X ", out_carate_350) ELSE '' END
       ) AS outCarate,
       out_carate_total
FROM carate_report c join account_table a on (c.customer_name COLLATE utf8mb4_general_ci = a.name COLLATE utf8mb4_general_ci)


  `;
  var where = " where a.account_group = 'Customer' and carate_date between ?  and ? ";
  var values = [from_date, to_date];

  if (customer_name !== "*") {
    where += "and customer_name = ? ";
    values.push(customer_name);
  }

  if (route !== "*") {
    where += "and route_detail = ? ";
    values.push(route);
  }

  query(sql + where, values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        var grand_in_carate = 0,
          grand_out_carate = 0;
        results.forEach((element) => {
          grand_in_carate += element.in_carate_total;
          grand_out_carate += element.out_carate_total;
        });

        const data = {
          reports: results,
          Grand: {
            "Grand in_carate_total": grand_in_carate,
            "Grand out_carate_total": grand_out_carate,
          },
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

module.exports = router;
