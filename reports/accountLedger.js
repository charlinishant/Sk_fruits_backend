const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const { autoTable } = require("jspdf-autotable");
const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
require("jspdf-autotable");
var format = "PNG";
//format 'JPEG', 'PNG', 'WEBP'
const imagePath = path.join(__dirname, "..", "public", "images", "a4.png");
var imgData = fs.readFileSync(imagePath).toString("base64");
router.use(bodyParser.json());
// const fs = require("fs");

// Read the font file
const fontPath =
  "./Noto_Sans_Devanagari/NotoSansDevanagari-VariableFont_wdth,wght.ttf";
const fontFile = fs.readFileSync(fontPath);

// Convert to base64
const base64Font = fontFile.toString("base64");
// After adding the font to jsPDF

// console.log(base64Font);
// const path = require("path");
// console.log(
//   "Resolved path:",
//   path.resolve(__dirname, "./NotoSansDevanagari.js")
// );
// require("./NotoSansDevanagari.js");

// require("./NotoSansDevanagari.js");
// sample Input
// {
//     "from_date" : "2024-01-01",
//     "to_date" : "2024-02-01",
//     "customer_name" : "*",
//     "route" : "*"
//   }

//SQL Query
//

router.post("/generate-pdf", (req, res) => {
  try {
    const data = req.body;
    console.log(data.reports)
    const doc = new jsPDF();
    // doc.addFileToVFS("NotoSansDevanagari.ttf", NotoSansDevanagari);
    // doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
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
    // doc.text("Mobile:- 9960607512", 10, 10);
    // Then you can use it as you're already doing
    doc.setFont("NotoSansDevanagari");

    // Adding header details
    doc.setFontSize(10);
    // // doc.text("Mobile:- 9960607512", 10, 10);
    // Add an example image (base64 or URL)
    // Adjust the position and size as needed
    // doc.addImage("../public/images/skfruit.png", "PNG", 10, 15, 30, 30);

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
      startY += 50; // Adjust startY for the next section
    }
    const customHeaders = [
      "Date",
      "Bill No/ receipt No",
      "Customer Name",
      "Bank Account",
      "Amount",
      // "online_amt",
      // "discount",
      // "inCarat",
      // "PaidAmount",
      // "balance",
      // "comment",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.filter((report) => report.online_amt > 0).map((report) => [
      // report.p_id,
      new Date(report.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      report.bill_no,
      report.cust_name,
      report.online_acc,
      report.online_amt,
      // report.amounr,
      // report.discount,
      // report.inCarat,
      // report.PaidAmount,
      // report.balance,
      // report.comment,
    ]);

    // Calculate grand totals for Reports
    const grandTotals = {
      amount: 0,
      carate_amount: 0,
      pre_balance: 0,
      total_amount: 0,
      online_amt: 0,
      discount: 0,
      inCarat: 0,
      PaidAmount: 0,
      balance: 0,
    };
    reportData.forEach((row) => {
      grandTotals.amount += parseFloat(row[2]) || 0;
      grandTotals.carate_amount += parseFloat(row[3]) || 0;
      grandTotals.pre_balance += parseFloat(row[4]) || 0;
      grandTotals.total_amount += parseFloat(row[5]) || 0;
      grandTotals.online_amt += parseFloat(row[6]) || 0;
      grandTotals.discount += parseFloat(row[7]) || 0;
      grandTotals.inCarat += parseFloat(row[8]) || 0;
      grandTotals.PaidAmount += parseFloat(row[9]) || 0;
      grandTotals.balance += parseFloat(row[10]) || 0;
    });
    reportData.push([
      "",
      "Grand Total",
      grandTotals.amount.toFixed(),
      grandTotals.carate_amount.toFixed(),
      grandTotals.pre_balance.toFixed(),
      grandTotals.total_amount.toFixed(),
      grandTotals.online_amt.toFixed(),
      grandTotals.discount.toFixed(),
      grandTotals.inCarat.toFixed(),
      grandTotals.PaidAmount.toFixed(),
      grandTotals.balance.toFixed(),
      "",
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
      "attachment; filename=Routewise_SaleReport.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, account_name } = req.body;
  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let sql1 = `
  SELECT date, bill_no, cust_name, online_acc, online_amt 
  FROM sale_table 
  WHERE date BETWEEN ? AND ? AND online_amt > 0 `

  // UNION ALL

  let sql2 = `SELECT date, bill_no, cust_name, 'cash' AS online_acc, cash AS online_amt 
  FROM sale_table 
  WHERE date BETWEEN ? AND ? AND cash > 0 `

  // UNION ALL 

  let sql3= ` SELECT date, receipt_id AS bill_no, from_account AS cust_name, 'cash' AS online_acc, deposite AS online_amt 
  FROM receipt 
  WHERE date BETWEEN ? AND ? AND deposite > 0`

  // UNION ALL

  let sql4 = `SELECT date, receipt_id AS bill_no, from_account AS cust_name, online_deposite_bank AS online_acc, online_deposite AS online_amt 
  FROM receipt 
  WHERE date BETWEEN ? AND ? AND online_deposite > 0
`;

if (account_name !== "*") {
  var sql = `
    (${sql1 + ' AND online_acc = ? '})
    UNION ALL
    (${sql2 + " AND 'Cash' = ? "})
    UNION ALL
    (${sql3 + " AND 'Cash' = ? "})
    UNION ALL
    (${sql4 + " AND online_deposite_bank = ? "})
    ORDER BY date ASC
  `;

values = [
  from_date, to_date, account_name, 
  from_date, to_date, account_name, 
  from_date, to_date, account_name, 
  from_date, to_date, account_name
];
}else{
  var sql = `
    (${sql1})
    UNION ALL
    (${sql2})
    UNION ALL
    (${sql3})
    UNION ALL
    (${sql4})
    ORDER BY date ASC
  `;

  values = [from_date, to_date, from_date, to_date, from_date, to_date, from_date, to_date];
}


// if (account_name !== "*") {
//   if (account_name === 'Cash') {
//     sql += " AND online_acc = 'Cash' ";
//   } else {
//     sql += " AND online_acc = ? ";
//     values.push(account_name);
//   }
// }
// if (account_name !== "*") {
//   sql += " AND online_acc = ? ";
//   values.push(account_name);
// }

  query(sql, values)
    .then((results) => {
        console.log(sql)
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        const data = {
          reports: results,
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
