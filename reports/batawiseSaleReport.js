const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

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
// Read the font file
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

//SQL Query
//
//Fetch purchase Data
router.post("/generate-pdf", (req, res) => {
  try {
    const data = req.body;

    const doc = new jsPDF();

    // Adding header details
    doc.setFontSize(10);
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
    // doc.text("Mobile:- 9960607512", 10, 10);
    // Then you can use it as you're already doing

    // old header
    /*
    doc.setFont("NotoSansDevanagari");
    // doc.text("HEllo From Images", 15, 30);
    doc.addImage(imgData, format, 10, 15, 30, 30);
    doc.setFontSize(16);
    doc.text("Savata Fruits Suppliers", 50, 20);
    doc.setFontSize(12);
    doc.text(
      "At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701",
      50,
      30
    );
    doc.text(
      "Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970",
      50,
      40
    );
    let startY = 50;
    */
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
      "bill_id",
      "date",
      "cust_name",
      "address",
      "product",
      "bata",
      "mark",
      "quantity",
      "rate",
      "price",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.bill_id,
      new Date(report.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      report.cust_name,
      report.address,
      report.product,
      report.bata,
      report.mark,
      report.quantity,
      report.rate,
      report.price,
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
      "attachment; filename=Purchase_Report.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});
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

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Bill</title>
          <style>
              .header {
            background-color: #f9f9f9;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .header .logo {
            width: auto; /* Adjust as needed */
            margin-right: 20px; /* Adjust as needed */
        }
        .header .logo img {
            height: 80px; /* Adjust as needed */
        }
        .header .details {
            width: 80%; /* Adjust as needed */
            text-align: right;
        }
        .header h1, .header p {
            margin: 5px 0;
            font-size: 16px;
        }

        h6{
            top: -17px;
           position: absolute;
           font-size: 12px;
        }
    
    
        .container2 {
            max-width: 600px;
            margin: 0 auto;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 12px; /* Adjust font size */
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 6px; /* Adjust padding */
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .details {
            text-align: center;
            margin-top: 10px;
        }

        /* CSS styles for the print button */
.header-details button {
    padding: 10px 20px;
    background-color: #808080;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}


@media print {
    .details, .header-details, .close{
        display: none; /* Hide the print button and header details when printing */
    }
}
.container3 {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}
.box-container {
    display: flex;
    justify-content: space-around;
}
.carate {
    font-size: 16px;
    color: #333;
}
.data {
    font-size: 14px;
    color: #666;
}
          </style>
      </head>
      <body>
          <div class="header">
              <div><h6>Mobile:- 9960607512</h6></div>
              <div class="logo">
                  <img src="data:image/png;base64,${imgData}" alt="Company Logo">
              </div>
              <div>
                  <center>
                      <h1>सावता फ्रुट सप्लायर्स</h1>
                      <p>ममु.पोस्ट- काष्टी ता.- श्रीगोंदा, जि. अहमदनगर - 414701</p>
                      <p>मोबाईल नं:- 9860601102 / 9175129393/ 9922676380 / 9156409970</p>
                  </center>
              </div>
          </div>
          <div class="container2">
        
              <table>
                  <tbody>
                      ${generateTableRows(data, billNo, utcDate, options)}
                  </tbody>
              </table>
              <br><br>
              <!-- Items table -->
              <table>
                  <thead>
                      <tr>
                          <th>अनु क्र.</th>
                          <th>बटा</th>
                          <th>Product</th>
                          <th>नग</th>
                          <th>किंमत</th>
                          <th>रक्कम</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${generateItemsTableRows(data)}
                  </tbody>
                  <tfoot  style="background-color: #e8e6e4;" >
                      ${generateFooterRows(data)}
                  </tfoot>
              </table>
               <div class="details">
                <h4>Thank you, visit again!</h4>
                <p><a href="https://datacrushanalytics.com/" style="color: #B1B6BA; font-size: 14px;">www.DataCrushAnalytics.com (Contact No: 7040040015)</a></p>
            </div>
          </div>
      </body>
      </html>
      `;

    // Launch a new browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Set the content of the page
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: "A4" });

    // Close the browser
    await browser.close();

    // Send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=RouteWise_SaleReport_${billNo}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

function generateTableRows(data, billNo, utcDate, options) {
  const billDetails = [
    { label: "बिल क्र.:", value: billNo },
    { label: "तारीख:", value: utcDate.toLocaleString("en-IN", options) },
    { label: "ग्राहकाचे नाव:", value: data.results[0].cust_name },
    { label: "संपर्क क्र.:", value: data.results[0].mobile_no },
    { label: "पत्ता:", value: data.results[0].address },
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
          <td>${item.bata}</td>
          <td>${item.product}</td>
          <td>${item.quantity}</td>
          <td>${item.rate}</td>
          <td>${item.price}</td>
      </tr>
  `
    )
    .join("");
}

function generateFooterRows(data) {
  const footerDetails = [
    {
      label: `गेलेले कॅरेट : 100 X ${data.results[0].in_carate_100} 150 X ${data.results[0].in_carate_150} 250 X ${data.results[0].in_carate_250} 350 X ${data.results[0].in_carate_350}`,
      value: data.results[0].carate_amount,
    },
    { label: "चालू कलम रक्कम:", value: data.results[0].amount },
    { label: "मागील बाकी:", value: data.results[0].pre_balance },
    { label: "एकूण रक्कम:", value: data.results[0].total_amount },
    { label: "रोख जमा रक्कम:", value: data.results[0].cash },
    { label: "ऑनलाईन जमा बँक :", value: data.results[0].online_acc },
    { label: "ऑनलाईन जमा रक्कम:", value: data.results[0].online_amt },
    { label: "सूट रक्कम:", value: data.results[0].discount },
    {
      label: `जमा कॅरेट: 100 X ${data.results[0].out_carate_100} 150 X ${data.results[0].out_carate_150} 250 X ${data.results[0].out_carate_250} 350 X ${data.results[0].out_carate_350}`,
      value: data.results[0].inCarat,
    },
    { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.results[0].balance },
    {
      label: `बाकी कॅरेट : 100 X ${data.results[0].carate_100} 150 X ${data.results[0].carate_150} 250 X ${data.results[0].carate_250} 350 X ${data.results[0].carate_350}`,
      value: "",
    },
  ];

  return footerDetails
    .map(
      (detail) => `
      <tr>
          <td align="right" colspan="5"><font color="black">${detail.label}</font></td>
          <td align="right" colspan="1"><font color="black">${detail.value}</font></td>
      </tr>
  `
    )
    .join("");
}
router.post("/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, bata, product } = req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    'select bill_id,date,cust_name,address,mobile_no,note "Sandharbh",product,bata,mark,quantity,rate,price from sale_table st join sale_product sp on (st.bill_no=sp.bill_id) ';
  var where = " where date between ?  and ? ";
  var values = [from_date, to_date];

  if (bata !== "*") {
    where += "and bata = ? ";
    values.push(bata);
  }
  if (product !== "*") {
    where += "and product = ? ";
    values.push(product);
  }

  query(sql + where, values)
    .then((results) => {
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
