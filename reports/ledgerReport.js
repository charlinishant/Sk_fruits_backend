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
//     "route" : "*"
//   }

//SQL Query
//
//Fetch Sale Data accroding to customer or Route
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

    // doc.text("HEllo From Images", 15, 30);
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
    // if (data.reports[0].customer_name && data.reports[0].customer_name !== "") {
    //   doc.text(`Customer Name: ${data.reports[0].customer_name}`, 50, 50);
    //   startY = 60; // Adjust startY for the next line
    // }
    // if (data.reports[0].route && data.reports[0].route !== "") {
    //   doc.text(`Route: ${data.reports[0].route}`, 50, startY);
    //   startY += 10; // Adjust startY for the next section
    // }
    const customHeaders = [
      "Date",
      "Summary",
      "Sale", //balance to sale pdf header name change 
      "Out Carate",
      "Total Balance",
      "Cash",
      "Online",
      "Discount",
      "In Carate",
      "Remaining",
    ];

    // Map data.reports[0] for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      new Date(report.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      report.summary,
      report.balance,
      report.out_carate,
      report.total_balance,
      report.cash,
      report.online,
      report.discount,
      report.in_carate,
      report.remaining,
    ]);
    const grandTotalRow = [
      "Grand Total",

      "",
      data.Grand["Grand Balance"],
      data.Grand["Grand outCarate"],
      data.Grand["Total Balance"],
      data.Grand["Total Cash"],
      data.Grand["Total Online"],
      data.Grand["Grand Discount"],
      data.Grand["Grand inCarate"],
      data.Grand["Grand Remaining Amount"],
    ];
    reportData.push(grandTotalRow);
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
      "attachment; filename=Ledger_Report.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, customer_name, route } = req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "SELECT date,route,customer_name,summary,balance,out_carate,total_balance,cash,online_bank,online,discount,in_carate,remaining FROM ledger  ";
  var where = " where date between ?  and ? ";
  const group = " order by date";
  var values = [from_date, to_date];

  if (route !== "*") {
    where += "and route = ? ";
    values.push(route);
  }
  if (customer_name !== "*") {
    where += "and customer_name = ?";
    values.push(customer_name);
  }

  query(sql + where + group, values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        var balance = 0,
          out_carate = 0,
          total_balance = 0,
          cash = 0,
          online = 0,
          discount = 0,
          in_carate = 0,
          remaining = 0;
        results.forEach((element) => {
          balance += element.balance;
          out_carate += element.out_carate;
          total_balance += element.total_balance;
          cash += element.cash;
          online += element.online;
          discount += element.discount;
          in_carate += element.in_carate;
          remaining += element.remaining;
        });
        const data = {
          reports: results,
          Grand: {
            "Grand Balance": balance,
            "Grand outCarate": out_carate,
            "Total Balance": total_balance,
            "Total Cash": cash,
            "Total Online": online,
            "Grand Discount": discount,
            "Grand inCarate": in_carate,
            "Grand Remaining Amount": remaining,
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
