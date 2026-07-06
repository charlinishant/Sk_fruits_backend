const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const bodyParser = require("body-parser");
const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
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
//   "from_date" : "2024-01-01",
//   "to_date" : "2024-02-01",
//   "customer_name" : "Deva"
// }

//Fetch purchase Data

router.post("/generate-bill/:receipt_id", async (req, res) => {
  try {
    const receipt_id = req.params.receipt_id;

    const data = await req.body;

    const utcDate = new Date(data.reports[0].date);
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
          <title>Receipt</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .header {
                  background-color: #f9f9f9;
                  padding: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .header .logo {
                  width: auto;
                  margin-right: 20px;
              }
              .header .logo img {
                  height: 80px;
              }
              .header .details {
                  width: 80%;
                  text-align: right;
              }
              .header h1, .header p {
                  margin: 5px 0;
                  font-size: 16px;
              }
              .container2 {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 10px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  font-size: 12px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
              }
              th, td {
                  border: 1px solid #ccc;
                  padding: 6px;
                  text-align: left;
              }
              th {
                  background-color: #f2f2f2;
              }
              .details {
                  text-align: center;
                  margin-top: 10px;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="logo">
                  <img src="data:image/png;base64,${imgData}" alt="Company Logo">
              </div>
              <div>
                  <h1>सावता फ्रुट सप्लायर्स</h1>
                  <p>ममु.पोस्ट- काष्टी ता.- श्रीगोंदा, जि. अहमदनगर - 414701</p>
                  <p>मोबाईल नं:- 9860601102 / 9175129393/ 9922676380 / 9156409970</p>
              </div>
          </div>
          <div class="container2">
              <!-- Receipt details -->
              <table>
                  <tbody>
                      ${generateTableRows(data, receipt_id, utcDate, options)}
                  </tbody>
              </table>
              
              <!-- Footer details -->
              <table>
                  <tfoot style="background-color: #e8e6e4;">
                      ${generateFooterRows(data)}
                  </tfoot>
              </table>
          </div>
          <!-- Thank you message -->
          <div class="details">
              <h4>Thank you, visit again!</h4>
              <p><a href="https://datacrushanalytics.com/" style="color: #B1B6BA; font-size: 14px;">www.DataCrushAnalytics.com (Contact No: 7040040015)</a></p>
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
      `attachment; filename=Receipt_${receipt_id}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

function generateTableRows(data, receipt_id, utcDate, options) {
  console.log('Receipt data:', data.reports[0]); // Debug log
  
  // Format created_at timestamp to show time
  const createdAt = new Date(data.reports[0].created_at);
  const timeString = createdAt.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  
  const billDetails = [
    { label: "जमा पावती क्र.:", value: receipt_id },
    { label: "तारीख:", value: utcDate.toLocaleString("en-IN", options) },
    { label: "ग्राहकाचे नाव:", value: data.reports[0].Customer },
    { label: "संपर्क क्र.:", value: data.reports[0].mobile_no },
    { label: "पत्ता:", value: data.reports[0].address },
    { label: "वेळ:", value: timeString },
    { label: "टिप्पणी:", value: data.reports[0].note || 'N/A' },
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

function generateFooterRows(data) {
  const footerDetails = [
    { label: "मागील बाकी:", value: data.reports[0].previous_balance },
    {
      label: `बाकी कॅरेट : 100 X ${data.reports[0].carate_100} 150 X ${data.reports[0].carate_150} 250 X ${data.reports[0].carate_250} 350 X ${data.reports[0].carate_350}`,
      value: "",
    },
    { label: "रोख जमा रक्कम:", value: data.reports[0].PaidAmt },
    { label: "ऑनलाईन जमा बँक :", value: data.reports[0].online_deposite_bank },
    { label: "ऑनलाईन जमा रक्कम:", value: data.reports[0].onlineAmt },
    { label: "सूट रक्कम:", value: data.reports[0].discount },
    {
      label: `जमा कॅरेट: -100 * ${data.reports[0].c100} | 150 * ${data.reports[0].c150} | 250 * ${data.reports[0].c250} | 350 * ${data.reports[0].c350}`,
      value: data.reports[0].inCarat,
    },
    { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.reports[0].Balance },
  ];

  return footerDetails
    .map(
      (detail) => `
      <tr>
          <td align="right" colspan="1"><font color="black">${detail.label}</font></td>
          <td align="right" colspan="1"><font color="black">${detail.value}</font></td>
      </tr>
  `
    )
    .join("");
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
    // if (data.reports[0].Customer && data.reports[0].Customer !== "") {
    //   doc.text(`Customer Name: ${data.reports[0].Customer}`, 50, 50);
    //   startY = 60; // Adjust startY for the next line
    // }
    // if (data.reports[0].route && data.reports[0].route !== "") {
    //   doc.text(`Route: ${data.reports[0].route}`, 50, startY);
    //   startY += 10; // Adjust startY for the next section
    // }
    const customHeaders = [
      "receipt_id",
      "date",
      "Customer",
      "mobile_no",
      "note",
      "PaidAmt",
      "online_deposite_bank",
      "onlineAmt",
      "discount",
      "inCarat",
      "Balance",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.receipt_id,
      new Date(report.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      report.Customer,
      report.mobile_no,
      report.note || '',
      report.PaidAmt,
      report.online_deposite_bank,
      report.onlineAmt,
      report.discount,
      report.inCarat,
      report.Balance,
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
      "attachment; filename=Receipt_Report.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, customer_name, route, user } = req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    'SELECT receipt_id,date,from_account "Customer",mobile_no,note,deposite "PaidAmt",online_deposite_bank,online_deposite "onlineAmt",discount,deposite_carate_price"inCarat",remaining "Balance" FROM receipt  ';
  var where = " where date between ?  and ? ";
  var values = [from_date, to_date];

  if (customer_name !== "*") {
    where += "and from_account = ? ";
    values.push(customer_name);
  }
  if (route !== "*") {
    where += "and route = ? ";
    values.push(route);
  }

  if (user !== "*") {
    where += "and added_by = ? ";
    values.push(user);
  }

  query(sql + where, values)
    .then((results) => {
      if (results.affectedRows === 0) {
      // if (!results || results.length === 0) {

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

router.get("/:receipt_id", async (req, res) => {
  receipt_id = req.params.receipt_id;
  // Get THe data from request body
  // const {from_date, to_date, customer_name} = req.body;

  // // Validate incoming data
  // if (!from_date || !to_date) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // }

  const sql =
    'SELECT receipt_id,date,from_account "Customer",r.mobile_no,note,deposite "PaidAmt",online_deposite_bank,online_deposite "onlineAmt",discount,deposite_carate_price"inCarat",remaining "Balance",a.address, previous_balance,r.carate_100 +baki_100 "carate_100",r.carate_150 +baki_150 "carate_150", r.carate_250 +baki_250 "carate_250",r.carate_350 +baki_350 "carate_350",r.carate_100"c100",r.carate_150"c150",r.carate_250"c250",r.carate_350"c350",r.created_at,baki_100,baki_150,baki_250,baki_350,COALESCE(a.cr_dr_type,"yes") as cr_dr_type FROM receipt r LEFT JOIN account_table a on(r.from_account=a.name) LEFT JOIN carate_user cu on(cu.user_id = a.name) ';
  var where = " where r.receipt_id = ? ";
  var values = [receipt_id];

  query(sql + where, values)
    .then((results) => {
      if (!results || results.length === 0) {
        res.status(404).send("No Report Found");
      } else {
        const data = { reports: results };
        res.send(data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

// Delete account data
router.delete("/deleteReceiptReport/:receiptId?", async (req, res) => {
  const receiptId = req.params.receiptId;
  if (!receiptId) {
    return res.status(400).send("Invalid account ID");
  }

  const [receiptToDelete] = await query(
    "SELECT * FROM receipt WHERE receipt_id = ?",
    [receiptId]
  );

  if (!receiptToDelete) {
    return res.status(404).send("Receipt not found");
  }

  const deletedReceiptSnapshot = {
    date: receiptToDelete.date,
    mobile_no: receiptToDelete.mobile_no,
    cash: receiptToDelete.deposite,
    online_deposite_bank: receiptToDelete.online_deposite_bank,
    online: receiptToDelete.online_deposite,
    discount: receiptToDelete.discount,
    inCarat: receiptToDelete.deposite_carate_price,
    note: receiptToDelete.note,
    remaining: receiptToDelete.remaining,
    added_by: receiptToDelete.added_by,
  };

  await query(
    `INSERT INTO edit_history (type, bill_no, customer_name, product_details, edited_by, edit_date, edit_time)
     VALUES ('receipt', ?, ?, ?, ?, CURDATE(), NOW())`,
    [
      receiptId,
      receiptToDelete.from_account,
      `RECEIPT_DELETED:${JSON.stringify(deletedReceiptSnapshot)}`,
      receiptToDelete.added_by || "System",
    ]
  );

  var sql1 =
    'update account_table set current_balance = current_balance + (select previous_balance - remaining  from receipt where receipt_id = ? ) where account_group = "Customer" and name = (select from_account from receipt where receipt_id = ? )';
  const values1 = [receiptId, receiptId];
  let reslt = await query(sql1, values1);
  console.log("reslt", reslt);

  var sql2 = "DELETE FROM ledger where summary = ?";
  const values2 = ["Receipt(" + receiptId + ")"];

  var sql3 = "DELETE FROM carate_report where summary = ?";
  const values3 = ["Receipt(" + receiptId + ")"];

  var sql4 =
    "update carate_user set carate_100 = carate_100  + (select carate_100 from receipt where receipt_id = ?) ,carate_150 = carate_150 + (select carate_150 from receipt where receipt_id = ?), carate_250 = carate_250 + (select carate_250 from receipt where receipt_id = ?) , carate_350 = carate_350 + (select carate_350 from receipt where receipt_id = ?) where user_id = (select from_account from receipt where receipt_id = ?)";
  const values4 = [receiptId, receiptId, receiptId, receiptId, receiptId];

  var sql = "DELETE FROM receipt where receipt_id = ? ";
  const values = [receiptId];

  // const queries = [
  //   query(sql2, values2),
  //   query(sql3, values3),
  //   query(sql4, values4),
  //   query(sql, values),
  // ];

  // const results = await Promise.all(queries);

  // res.send(results); // Send all results
  await query(sql2, values2);
  await query(sql3, values3);
  await query(sql4, values4);
  await query(sql, values);

  res.send({ message: "All queries executed sequentially" });

  // try {
  //   await query("START TRANSACTION");
  //   await query(sql2, values2);
  //   await query(sql3, values3);
  //   await query(sql4, values4);
  //   await query(sql, values);

  //   await query("COMMIT");
  //   res.send({ message: "Receipt deleted successfully" });
  // } catch (err) {
  //   await query("ROLLBACK");
  //   res.status(500).send(err.message);
  // }
});

module.exports = router;
