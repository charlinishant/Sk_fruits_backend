const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
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
//   "route" : "*",
//   "customer_name" : "Deva"
// }

//Fetch purchase Data
function encodeMarathi(text) {
  return decodeURIComponent(encodeURIComponent(text));
}
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
    if (data.customer_name && data.customer_name !== "") {
      doc.text(`Customer Name: ${data.customer_name}`, 50, 50);
      startY = 60; // Adjust startY for the next line
    }
    if (data.route && data.route !== "") {
      doc.text(`Route: ${data.route}`, 50, startY);
      startY += 10; // Adjust startY for the next section
    }
    const customHeaders = [
      "ID",
      "Name",
      "Address",
      "Route Detail",
      "Mobile No",
      "Amount",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.id,
      report.name,
      report.address,
      report.route_detail,
      report.mobile_no,
      report.Amount,
    ]);
    // Calculate grand total
    const grandTotal = data.reports.reduce(
      (sum, report) => sum + report.Amount,
      0
    );

    // Add grand total row
    reportData.push(["", "", "", "", "Grand Total", grandTotal]);

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
      "attachment; filename=Customer_Outstanding.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/", async (req, res) => {
  // Get THe data from request body
  let { route, customer_name } = req.body;

  // Handle route array from Select2 multiple
  if (Array.isArray(route)) {
    route = route.length > 0 ? route[0] : "*";
  }

  // Validate incoming data

  const sql =
    'SELECT id,name,address,route_detail,mobile_no,current_balance"Amount",last_update FROM account_table  ';
  var where = " where account_group = 'Customer'  ";
  var values = [];

  if (route !== "*") {
    where += "and route_detail = ?  ";
    values.push(route);
  }

  if (customer_name !== "*") {
    where += "and name = ? ";
    values.push(customer_name);
  }

  query(sql + where, values)
    .then((results) => {
      if (results.length === 0) {
        res.status(404).send("No Report Found");
      } else {
        var amount = 0;
        results.forEach((element) => {
          amount += element.Amount;
        });

        const data = { reports: results, Grand: { "Grand Amournt": amount } };
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
