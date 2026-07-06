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
//format 'JPEG', 'PNG', 'WEBP'
const imagePath = path.join(__dirname, "..", "public", "images", "a4.png");
// const imagePath = path.join(__dirname, "..", "public", "images", "logo.png");
var imgData = fs.readFileSync(imagePath).toString("base64");
router.use(bodyParser.json());
const fontPath =
  "./Noto_Sans_Devanagari/NotoSansDevanagari-VariableFont_wdth,wght.ttf";
const fontFile = fs.readFileSync(fontPath);
const base64Font = fontFile.toString("base64");
// sample Input
//SQL Query
router.post("/generate-pdf", (req, res) => {
  try {
    const data = req.body;

    const doc = new jsPDF();

    // Adding header details
    doc.setFontSize(10);
    // doc.text("Mobile:- 9960607512", 10, 10);
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
   
    // doc.addImage(imgData, format, 10, 15, 30, 30);
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
    // let startY = 50;

      // Use a4.png as full header image
    doc.addImage(imgData, format, 10, 8, 270, 50); // Adjusted for landscape
    let startY = 70;

    if (data.customerName && data.customerName !== "") {
      doc.text(`Customer Name: ${data.customerName}`, 50, 50);
      startY = 60; // Adjust startY for the next line
    }
    if (data.route && data.route !== "") {
      doc.text(`Route: ${data.route}`, 50, startY);
      startY += 10; // Adjust startY for the next section
    }
    const customHeaders = [
      "name",
      "address",
      "mobile_no",
      "last_update",
      "current_balance",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.name,
      report.address,
      report.mobile_no,
      new Date(report.last_update).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      report.current_balance,
    ]);

    const grandTotalAmount = data.reports.reduce(
      (total, report) => total + parseFloat(report.current_balance),
      0
    );

    // Add grand total row
    const grandTotalRow = ["Grand Total", "", "", "", grandTotalAmount];
    reportData.push(grandTotalRow);

    // Add table to PDF
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
      "attachment; filename=Reminder_Report.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});



router.post("/:route?", async (req, res) => {

  const route = req.params.route;
  const { customer} = req.body;
  var values = []

  const sql =
    "SELECT name,address,mobile_no,last_update,current_balance FROM account_table ";
  var where = ' where account_group = "Customer" and current_balance > 0 ';

  if (route) {
    where += ` and route_detail = ${mysql.escape(route)}`;
  }

  if (customer !== "*") {
    where += " and name = ? ";
    values.push(customer);
  }

  query(sql + where,values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        var grand_Amount = 0;
        results.forEach((element) => {
          grand_Amount += element.current_balance;
        });
        // const data = {"reports" : results ,"Grand" : {"Grand Amount" : grand_Amount}};
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

router.put("/updateRemainder/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const { date } = req.body;

    // Validate incoming data (optional but recommended)
    if (!date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql =
      'UPDATE account_table SET last_update = ? WHERE account_group="Customer" and name = ?';
    const values = [date, name];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "accountdata not found" });
    }

    // Send response
    res
      .status(200)
      .json({ message: "accountdata updated successfully", data: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
