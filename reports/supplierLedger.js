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
//     "vehicle_no" : "*"
//   }

//SQL Query
//
//Fetch purchase Data
router.post("/generate-pdf", (req, res) => {
  try {
    const data = req.body;

    const doc = new jsPDF('landscape');

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
    doc.addImage(imgData, "PNG", 10, 8, 270, 50);
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

    const customHeaders = [
      "Record",
      "Type",
      "Date",
      "Supplier Name",
      "Mobile Number	",
      "Vehicle",
      "Bill Amount",
      "Expenses",
      "Cash",
      "Bank Account	",
      "Online",
      "Discount",
      "Balance",
      "Comment",
    ];

    // Map data for autoTable (Reports)
    // Map data for autoTable (Reports)
    console.log(data.reports)
    const reportData = data.reports.map((report) => [
      report.record_id,
      report.type,
      new Date(report.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      report.account_name,
      report.mobile_no,
      report.reference,
      report.amount,
      report.expenses,
      report.cash,
      report.from_account,
      report.online,
      report.discount,
      report.prev_balance,
      report.comment,
    ]);


    // Add Reports table to PDF
    doc.autoTable({
      head: [customHeaders],
      body: reportData,
      startY: startY + 20,
      theme: "grid",
      headStyles: { fillColor: [255, 0, 0] },
      margin: { top: 10 },
    });





    // // Add Receipts table to PDF
    // doc.autoTable({
    //   head: [customHeaders],
    //   body: reportData,
    //   startY: startY + 20,
    //   theme: "grid",
    //   styles: {
    //     font: "NotoSansDevanagari",
    //     fontStyle: "normal",
    //   },
    //   // Apply encoding to all cell data
    //   didParseCell: function (data) {
    //     if (data.cell.raw) {
    //       data.cell.text = encodeMarathi(data.cell.raw.toString());
    //     }
    //   },
    // });

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
// router.post("/", async (req, res) => {
//   // Get THe data from request body
//   const { from_date, to_date, supplier_name } = req.body;

//   // Validate incoming data
//   if (!from_date || !to_date) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const sql =
//     "SELECT id,date,supplier_name,gadi_number,total_quantity FROM purchase st ";
//   var where = " where date between ?  and ? ";
//   var values = [from_date, to_date];

//   if (supplier_name !== "*") {
//     where += "and supplier_name = ? ";
//     values.push(supplier_name);
//   }

//   query(sql + where, values)
//     .then((results) => {
//       if (results.affectedRows === 0) {
//         res.status(404).send("No Report Found");
//       } else {
//         const sql1 =
//           "SELECT p_id,date,from_account,to_account,comment,prev_balance,amounr FROM payment ";
//         var where1 = " where date between ?  and ? ";
//         var values1 = [from_date, to_date];

//         if (supplier_name !== "*") {
//           console.log("HELLO");
//           where1 += " and to_account = ? ";
//           values1.push(supplier_name);
//         }
//         query(sql1 + where1, values1)
//           .then((receipt) => {
//             console.log(sql1);
//             if (receipt.affectedRows === 0) {
//               res.status(404).send("No Report Found");
//             } else {
//               const data = { reports: results, Receipt: receipt };
//               res.send(data); // Send all results
//               // Do something with the results
//             }
//           })
//           .catch((error) => {
//             console.error("Error:", error);
//             res.status(500).send("Internal Server Error"); // Send an error response to the client
//           });

//         // const data = {"reports" : results."Receipt": receipt};
//         // res.send(data); // Send all results
//         // Do something with the results
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       res.status(500).send("Internal Server Error"); // Send an error response to the client
//     });
// });


router.post("/", async (req, res) => {
  // Get the data from the request body
  const { from_date, to_date, supplier_name } = req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Query for purchase with placeholders for non-existing fields in the payment table
  const purchaseSql = `
    SELECT 
      id AS record_id, 
      date, 
      '-' AS from_account,
      supplier_name AS account_name, 
      gadi_number AS reference, 
      total_quantity - expenses AS amount, 
      'purchase' AS type, 
      current_balance AS prev_balance, 
      '-' AS comment,
      expenses,
      created_at,
      '-' AS mobile_no, 
      '-' AS cash,
      '-' AS online, 
      '-' AS discount,
      previous_balance
    FROM purchase
  `;
  let purchaseWhere = " WHERE date BETWEEN ? AND ?";
  let values = [from_date, to_date];

  if (supplier_name !== "*") {
    purchaseWhere += " AND supplier_name = ?";
    values.push(supplier_name);
  }

  const purchaseGroupBy = " GROUP BY id, date, supplier_name, gadi_number, total_quantity, expenses, created_at";

  // Query for payment with placeholders for non-existing fields in the purchase table
  const paymentSql = `
    SELECT 
      p_id AS record_id, 
      date, 
      from_account, 
      to_account AS account_name, 
      '-' AS reference, 
      '_' AS amount, 
      'payment' AS type, 
      amounr as prev_balance, 
      comment,
      '-' AS expenses,
      created_at,
      mobile_no, 
      cash, 
      online, 
      discount,
      prev_balance as previous_balance
    FROM payment
  `;
  let paymentWhere = " WHERE date BETWEEN ? AND ?";
  let values1 = [from_date, to_date];

  if (supplier_name !== "*") {
    paymentWhere += " AND to_account = ?";
    values1.push(supplier_name);
  }

  const paymentGroupBy = " GROUP BY p_id, date, from_account, to_account, prev_balance, comment, created_at, mobile_no, cash, online, discount";

  // Combine both queries using UNION ALL and order by created_at
  const combinedSql = `
    (${purchaseSql + purchaseWhere + purchaseGroupBy})
    UNION ALL
    (${paymentSql + paymentWhere + paymentGroupBy})
    ORDER BY created_at ASC
  `;

  // Combine the values for the UNION ALL query
  const combinedValues = values.concat(values1);

  try {
    const results = await query(combinedSql, combinedValues);

    if (results.length === 0) {
      return res.status(404).send("No Report Found");
    }

    // Add a single empty entry with the previous balance of the last result
    const lastResult = results[0];
    const emptyEntry = {
      record_id: "",
      date: lastResult.date,
      from_account: "",
      account_name: "",
      reference: "",
      amount: "",
      type: "",
      prev_balance: lastResult ? lastResult.previous_balance : "0", // Use 0 if no results
      comment: "",
      expenses: "",
      created_at: "",
      mobile_no: "",
      cash: "",
      online: "",
      discount: "",
    };

    results.unshift(emptyEntry);

    res.send({ reports: results });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }

});




module.exports = router;
