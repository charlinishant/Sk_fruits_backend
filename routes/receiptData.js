const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const path = require("path");
const { jsPDF } = require("jspdf");
const puppeteer = require("puppeteer");
const fs = require("fs");
require("jspdf-autotable");

const bodyParser = require("body-parser");
const imagePath = path.join(__dirname, "..", "public", "images", "logo.png");
var imgData = fs.readFileSync(imagePath).toString("base64");
const imagePath1 = path.join(__dirname, "..", "public", "images", "a4.png");
var imgData1 = fs.readFileSync(imagePath1).toString("base64");
const fontPath =
  "./Noto_Sans_Devanagari/NotoSansDevanagari-VariableFont_wdth,wght.ttf";
const fontFile = fs.readFileSync(fontPath);

router.post("/generate-bill/:receiptId?", async (req, res) => {
  try {
    const receiptId = req.params.receiptId;
    const datafinal = req.body.reports[0]; // Assuming the data is sent in the request body

    const base64Font = fs.readFileSync(fontPath).toString("base64");

    // HTML Content
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt</title>
        <style>
            @font-face {
                font-family: 'Noto Sans Devanagari';
               src: url('data:font/ttf;base64,${base64Font}') format('truetype');
            }
            body {
                font-family: 'Noto Sans Devanagari', Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
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
    content: url("data:image/png;base64,${imgData}"); /* Replace with your watermark image path */
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
            }
            th {
                background-color: #f2f2f2;
            }
            .details {
                text-align: center;
                margin-top: 10px;
            }
             @media print {
                  @page {
                      size: A5 portrait;
                      margin: 5mm;
                  }
                  body {
                      margin: 0;
                      padding: 0;
                  }
              }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">
                <img src="data:image/png;base64,${imgData1}" alt="Company Logo">
            </div>
        </div>
        <div class="container2">
            <table>
                <tbody>
                    ${generateTableRows(datafinal)}
                </tbody>
            </table>
            <table>
                <tfoot>
                    ${generateFooterRows(datafinal)}
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

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: "A5" });
    await browser.close();

    // Send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt_${receiptId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

function generateTableRows(datafinal) {
  // Format the date
  const utcDate = new Date(datafinal.date);
  const formattedDate = utcDate.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  // Convert the creation timestamp to IST
  function convertToIST(dateString) {
    const utcDate = new Date(dateString);
    return utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  // Define table rows
  const rows = [
    {
      label: "जमा पावती क्र.:   " + `${datafinal.receipt_id}`,
      value: "तारीख:   " + `${formattedDate}`,
    },
    {
      label: "ग्राहकाचे नाव:   " + `${datafinal.Customer}`,
      value: "संपर्क क्र.:   " + `${datafinal.mobile_no}`,
    },
    {
      label: "पत्ता:   " + `${datafinal.address}`,
      value: "Time:   " + `${convertToIST(datafinal.created_at)}`,
    },
  ];

  // Generate table rows dynamically
  return rows
    .map(
      (row) => `
    <tr>
      <td><b>${row.label}</b></td>
      <td>${row.value}</td>
    </tr>
  `
    )
    .join("");
}

function generateFooterRows(datafinal) {
  const label =
    "बाकी कॅरेट : " +
    (datafinal.carate_100 > 0 ? "100 X " + datafinal.carate_100 + " " : "") +
    (datafinal.carate_150 > 0 ? "150 X " + datafinal.carate_150 + " " : "") +
    (datafinal.carate_250 > 0 ? "250 X " + datafinal.carate_250 + " " : "") +
    (datafinal.carate_350 > 0 ? "350 X " + datafinal.carate_350 : "");

  const label1 =
    "जमा कॅरेट : " +
    (datafinal.c100 > 0 ? "100 X " + datafinal.c100 + " " : "") +
    (datafinal.c150 > 0 ? "150 X " + datafinal.c150 + " " : "") +
    (datafinal.c250 > 0 ? "250 X " + datafinal.c250 + " " : "") +
    (datafinal.c350 > 0 ? "350 X " + datafinal.c350 : "");

  const label2 =
    "आत्ता पर्यंतचे येणे बाकी कॅरेट: " +
    (datafinal.baki_100 > 0 ? "100 X " + datafinal.baki_100 + " " : "") +
    (datafinal.baki_150 > 0 ? "150 X " + datafinal.baki_150 + " " : "") +
    (datafinal.baki_250 > 0 ? "250 X " + datafinal.baki_250 + " " : "") +
    (datafinal.baki_350 > 0 ? "350 X " + datafinal.baki_350 : "");

  var showLabels = true;
  if (datafinal.cr_dr_type == "no") {
    showLabels = false;
  }

  var footerDetails = [
    //{ label: "गेलेले कॅरेट : +", value: data.results[0].carate_amount },
    //{ label: "चालू कलम रक्कम:", value: data.results[0].amount },
    { label: "मागील बाकी:", value: datafinal.previous_balance, visible: true },
    // { label: "बाकी कॅरेट : 100 X  " + datafinal.carate_100 + "  150 X  " + datafinal.carate_150 + "  250 X  " + datafinal.carate_250 + "  350 X  " +  datafinal.carate_350, value: ''},
    { label: label.trim(), value: "", visible: showLabels },
    //{ label: "एकूण रक्कम:", value: data.results[0].total_amount },
    { label: "रोख जमा रक्कम:", value: datafinal.PaidAmt, visible: true },
    {
      label: "जमा रक्कम  (ऑनलाईन जमा बँक) :",
      value: datafinal.onlineAmt + "(" + datafinal.online_deposite_bank + ")",
      visible: true,
    },
    // { label: "ऑनलाईन जमा रक्कम:", value: datafinal.onlineAmt },
    { label: "सूट रक्कम:", value: datafinal.discount, visible: true },
    // { label: "जमा कॅरेट:  -" + "100 * " +datafinal.c100 +" | 150 * " + datafinal.c150+ " | 250 * " +datafinal.c250 + " | 350 * " + datafinal.c350, value: datafinal.inCarat },
    { label: label1.trim(), value: datafinal.inCarat, visible: showLabels },
    { label: label2.trim(), value: "", visible: showLabels },
    {
      label: "आत्ता पर्यंतचे येणे बाकी:",
      value: datafinal.Balance,
      visible: true,
    },
    // Add other bill details similarly
  ];

  let rows = "";

  footerDetails.forEach((detail) => {
    rows += `
      <tr>
        <td align="right" colspan="6" style="text-align:right;"><font color="black">${
          detail.label
        }</font></td>
        ${
          detail.visible
            ? `<td align="right" colspan="1" style="text-align:right;"><font color="black">${detail.value}</font></td>`
            : ""
        }
      </tr>
    `;
  });

  return rows;
}

function formatCaratDetails(c100, c150, c250, c350) {
  return [
    c100 > 0 ? `100 X ${c100}` : "",
    c150 > 0 ? `150 X ${c150}` : "",
    c250 > 0 ? `250 X ${c250}` : "",
    c350 > 0 ? `350 X ${c350}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

router.use(bodyParser.json());

//Fetch recipt Data
router.get("/:reciptId?", function (req, res) {
  const reciptId = req.params.reciptId;
  let sql = "SELECT * FROM receipt";
  // let params = [];

  if (reciptId) {
    sql += ` WHERE receipt_id = ${mysql.escape(reciptId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("recipt not found");
      } else {
        res.send(results); // Send all results
        // Do something with the results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

router.get("/validate/:reciptId?", function (req, res) {
  const reciptId = req.params.reciptId;
  let sql = "Update receipt set validate = 'Verified' ";
  // let params = [];

  if (reciptId) {
    sql += ` WHERE receipt_id = ${mysql.escape(reciptId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("receipt data not found");
      } else {
        res.send(results); // Send all results
        // Do something with the results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

router.delete("/deleteReceipt/:receiptId", async (req, res) => {
  const { receiptId } = req.params;
  const { userType } = req.body;

  if (!receiptId) {
    return res.status(400).json({ message: "Receipt ID is required" });
  }

  if (userType !== "Super") {
    return res.status(403).json({ message: "Only Super Admin can delete receipts" });
  }

  try {
    // Fetch receipt info first for rollback purposes
    const receiptSql = "SELECT * FROM receipt WHERE receipt_id = ?";
    const [receipt] = await query(receiptSql, [receiptId]);

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    const {
      from_account,
      date,
      mobile_no,
      note,
      previous_balance,
      remaining,
      deposite,
      online_deposite,
      discount,
      carate_100,
      carate_150,
      carate_250,
      carate_350,
      deposite_carate_price,
    } = receipt;

    // Calculate the amount to add back
    const amountToRevert = previous_balance - remaining;

    const deletedReceiptSnapshot = {
      date,
      mobile_no,
      cash: deposite,
      online_deposite_bank,
      online: online_deposite,
      discount,
      inCarat: deposite_carate_price,
      note,
      remaining,
      added_by: receipt.added_by,
    };

    await query(
      `INSERT INTO edit_history (type, bill_no, customer_name, product_details, edited_by, edit_date, edit_time)
       VALUES ('receipt', ?, ?, ?, ?, CURDATE(), NOW())`,
      [
        receiptId,
        from_account,
        `RECEIPT_DELETED:${JSON.stringify(deletedReceiptSnapshot)}`,
        receipt.added_by || userType || "System",
      ]
    );

    // 1. Delete from carate_report
    const sql1 = "DELETE FROM carate_report WHERE summary = ?";
    const values1 = [`Receipt(${receiptId})`];
    await query(sql1, values1);

    // 2. Delete from ledger
    const sql2 = "DELETE FROM ledger WHERE summary = ?";
    await query(sql2, values1);

    // 3. Delete from receipt
    const sql3 = "DELETE FROM receipt WHERE receipt_id = ?";
    const result = await query(sql3, [receiptId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Failed to delete receipt" });
    }

    // 4. Revert `carate_user` counts
    const sql4 = `
      UPDATE carate_user SET 
        carate_100 = carate_100 + ?, 
        carate_150 = carate_150 + ?, 
        carate_250 = carate_250 + ?, 
        carate_350 = carate_350 + ? 
      WHERE user_id = ?
    `;
    const values4 = [
      carate_100,
      carate_150,
      carate_250,
      carate_350,
      from_account,
    ];
    await query(sql4, values4);

    // 5. Revert balance in `account_table` using stored value
    const sql5 = `
      UPDATE account_table 
      SET current_balance = current_balance + ?
      WHERE account_group = "Customer" AND name = ?
    `;
    await query(sql5, [amountToRevert, from_account]);

    return res
      .status(200)
      .json({ message: "Receipt and related data deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete recipt data
// router.delete("/deletereciptId/:reciptId?", (req, res) => {
//   const reciptId = req.params.reciptId;
//   var sql = "DELETE FROM receipt";

//   if (!reciptId) {
//     return res.status(400).send("Invalid recipt ID");
//   } else {
//     sql += ` WHERE receipt_id = ${mysql.escape(reciptId)}`;
//   }

//   query(sql)
//     .then((results) => {
//       console.log("Results:", results);

//       if (results.affectedRows === 0) {
//         res.status(404).send("recipt not found");
//       } else {
//         res.send(results); // Send all results
//         // Do something with the results
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       res.status(500).send("Internal Server Error"); // Send an error response to the client
//     });
// });

// Add receipt data
router.post("/insertReceipt", async (req, res) => {
  // Get THe data from request body
  const {
    receiptId,
    date,
    from_account,
    to_account,
    note,
    previous_balance,
    deposite,
    online_deposite_bank,
    online_deposite,
    discount,
    carate_100,
    carate_150,
    carate_250,
    carate_350,
    deposite_carate_price,
    remaining,
    added_by,
    baki_100,
    baki_150,
    baki_250,
    baki_350,
  } = req.body;

  // Convert date from DD-MM-YYYY to YYYY-MM-DD
  const convertDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr; // Already in correct format
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY to YYYY-MM-DD
    }
    return dateStr;
  };
  
  const formattedDate = convertDate(date);

  // Validate incoming data
  if (!receiptId || !date || !from_account || !to_account) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql =
    "INSERT INTO receipt (receipt_id,date, from_account, mobile_no, note, previous_balance, deposite, online_deposite_bank, online_deposite, discount, carate_100, carate_150, carate_250, carate_350, deposite_carate_price, remaining, added_by,validate,baki_100,baki_150,baki_250,baki_350,previous_baki_100,previous_baki_150,previous_baki_250,previous_baki_350 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
  const values = [
    receiptId,
    formattedDate,
    from_account,
    to_account,
    note,
    previous_balance,
    deposite,
    online_deposite_bank,
    online_deposite,
    discount,
    carate_100,
    carate_150,
    carate_250,
    carate_350,
    deposite_carate_price,
    remaining,
    added_by,
    "Pending",
    baki_100,
    baki_150,
    baki_250,
    baki_350,
    carate_100 + baki_100,
    carate_150 + baki_150,
    carate_250 + baki_250,
    carate_350 + baki_350,
  ];

  query(sql, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.affectedRows === 0) {
        res.status(404).send("receipt not inserted");
      } else {
        const sql1 =
          'update account_table set current_balance = ? where account_group = "Customer" and mobile_no = ?';
        const values1 = [remaining, to_account];
        query(sql1, values1).then((results1) => {
          console.log("Results:", results);
          if (results1.affectedRows === 0) {
            res.status(404).send("Account Table not updated");
          }
        });

        const sql8 =
          'update receipt set route = (select route_detail from account_table where account_group = "Customer" and mobile_no  = ?  limit 1) where receipt_id = ? ';
        const values8 = [to_account, receiptId];
        query(sql8, values8).then((results1) => {
          console.log("Results:", results);
          if (results1.affectedRows === 0) {
            res.status(404).send("receipt Table not updated");
          }
        });

        const updateBillTrackingSql = `
          UPDATE bill_tracking_receipt 
          SET status = 'inactive' 
          WHERE user_id = ? AND bill_id = ?
        `;

        const updateBillTrackingValues = [added_by, receiptId];

        query(updateBillTrackingSql, updateBillTrackingValues)
          .then((btResult) => {
            if (btResult.affectedRows === 0) {
              console.warn(
                `Bill tracking not updated for user: ${added_by}, bill: ${receiptId}`
              );
            } else {
              console.log(
                `Bill tracking updated: ${added_by} → bill ${receiptId} marked as inactive`
              );
            }
          })
          .catch((err) => {
            console.error("Failed to update bill_tracking_receipt:", err);
            // You can decide to continue or abort the response here depending on criticality
          });

        const sql2 =
          "INSERT INTO ledger (date,summary,balance,out_carate,total_balance,cash,online,discount,in_carate,remaining,customer_name,online_bank,added_by ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?) ";
        const values2 = [
          formattedDate,
          "Receipt(" + receiptId + ")",
          // previous_balance,
          0,
          0,
          remaining,
          deposite,
          online_deposite,
          discount,
          deposite_carate_price,
          remaining,
          from_account,
          online_deposite_bank,
          added_by,
        ];
        query(sql2, values2)
          .then((ledger) => {
            const sql6 =
              'Update ledger set route = (select route_detail from account_table where account_group = "Customer" and name = ?) where summary = ?  ';
            const values6 = [from_account, "Receipt(" + receiptId + ")"];
            query(sql6, values6)
              .then((ledger1) => {
                if (ledger1.affectedRows === 0) {
                  res.status(404).send("Ledger Data not Updated");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
                res.status(500).send("Internal Server Error"); // Send an error response to the client
              });

            if (ledger.affectedRows === 0) {
              res.status(404).send("Ledger Data not inserted");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error"); // Send an error response to the client
          });

        const sql3 =
          "INSERT INTO carate_report (carate_date,summary,customer_name,in_carate_100,in_carate_150, in_carate_250, in_carate_350, out_carate_100, out_carate_150, out_carate_250, out_carate_350, in_carate_total, out_carate_total ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values3 = [
          formattedDate,
          "Receipt(" + receiptId + ")",
          from_account,
          carate_100,
          carate_150,
          carate_250,
          carate_350,
          0,
          0,
          0,
          0,
          deposite_carate_price,
          0,
        ];
        query(sql3, values3)
          .then((carate) => {
            if (carate.affectedRows === 0) {
              res.status(404).send("Carate Data not inserted");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error"); // Send an error response to the client
          });

        const sql4 = "Select * from carate_user where user_id = ?";
        const values4 = [from_account];
        query(sql4, values4)
          .then((results) => {
            let sql5;
            let values5;
            console.log("Results:", results);
            if (results.length === 0) {
              sql5 =
                "INSERT INTO carate_user (user_id,carate_100,carate_150, carate_250, carate_350) VALUES (?, ?, ?, ?, ?)";
              values5 = [
                from_account,
                carate_100,
                carate_150,
                carate_250,
                carate_350,
              ];
            } else {
              sql5 =
                "update carate_user set carate_100 = carate_100 - ? ,carate_150 = carate_150 - ?, carate_250 = carate_250 - ? , carate_350 = carate_350 - ? where user_id = ?";
              console.log(
                "Updated Data",
                carate_100,
                carate_150,
                carate_250,
                carate_350,
                from_account
              );
              values5 = [
                carate_100,
                carate_150,
                carate_250,
                carate_350,
                from_account,
              ];
            }
            query(sql5, values5).then((carate) => {
              console.log("Query5");

              if (carate.affectedRows === 0) {
                res.status(404).send("Carate User Data not inserted");
              }
            });
          })

          .catch((error) => {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error"); // Send an error response to the client
          });

        res.send(results); // Send all results
        // Do something with the results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

// update receipt data
// router.put("/updateReceipt/:receiptId", async (req, res) => {

//   const { query, beginTransaction, commit, rollback } = require('./db'); // Adjust the import according to your project structure

router.put("/updateReceipt/:receiptId", async (req, res) => {
  try {
    const receiptId1 = req.params.receiptId;
    const {
      receiptId,
      date,
      from_account,
      to_account,
      note,
      previous_balance,
      deposite,
      online_deposite_bank,
      online_deposite,
      discount,
      carate_100,
      carate_150,
      carate_250,
      carate_350,
      deposite_carate_price,
      remaining,
      added_by,
      baki_100,
      baki_150,
      baki_250,
      baki_350,
    } = req.body;

    // Convert date from DD-MM-YYYY to YYYY-MM-DD
    const convertDate = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    };
    
    const formattedDate = convertDate(date);

    const [oldReceipt] = await query(
      "SELECT remaining, added_by FROM receipt WHERE receipt_id = ?",
      [receiptId]
    );

    if (!oldReceipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    const oldRemaining = oldReceipt.remaining;
    const originalAddedBy = oldReceipt.added_by;

    const deleteQueries = [
      {
        sql: "DELETE FROM ledger WHERE summary = ?",
        values: [`Receipt(${receiptId1})`],
      },
      {
        sql: "DELETE FROM carate_report WHERE summary = ?",
        values: [`Receipt(${receiptId1})`],
      },
    ];

    for (const queryObj of deleteQueries) {
      await query(queryObj.sql, queryObj.values);
    }

    const insertLedgerSql = `
      INSERT INTO ledger (date, summary, balance, out_carate, total_balance, cash, online, discount, in_carate, remaining, customer_name, online_bank,added_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertLedgerValues = [
      formattedDate,
      `Receipt(${receiptId})`,
      previous_balance,
      0,
      remaining,
      deposite,
      online_deposite,
      discount,
      deposite_carate_price,
      remaining,
      from_account,
      online_deposite_bank,
      originalAddedBy,
    ];

    await query(insertLedgerSql, insertLedgerValues);

    const insertCarateReportSql = `
      INSERT INTO carate_report (carate_date, summary, customer_name, in_carate_100, in_carate_150, in_carate_250, in_carate_350, out_carate_100, out_carate_150, out_carate_250, out_carate_350, in_carate_total, out_carate_total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertCarateReportValues = [
      formattedDate,
      `Receipt(${receiptId})`,
      from_account,
      carate_100,
      carate_150,
      carate_250,
      carate_350,
      0,
      0,
      0,
      0,
      deposite_carate_price,
      0,
    ];

    await query(insertCarateReportSql, insertCarateReportValues);

    const updateLedgerRouteSql = `
      UPDATE ledger SET route = (SELECT route_detail FROM account_table WHERE account_group = "Customer" AND name = ?)
      WHERE summary = ?
    `;
    const updateLedgerRouteValues = [from_account, `Receipt(${receiptId})`];

    await query(updateLedgerRouteSql, updateLedgerRouteValues);

    // const updateAccountTableSql = `
    //   UPDATE account_table
    //   SET current_balance = current_balance + (? - current_balance)
    //   WHERE account_group = "Customer" AND name = ?
    // `;
    // const updateAccountTableValues = [remaining, from_account];

    const balanceDifference = remaining - oldRemaining;

    const updateAccountTableSql = `
      UPDATE account_table
      SET current_balance = current_balance + ?
      WHERE account_group = "Customer" AND name = ?
    `;
    const updateAccountTableValues = [balanceDifference, from_account];

    await query(updateAccountTableSql, updateAccountTableValues);

    const updateCarateUserSql = `
      UPDATE carate_user
      SET carate_100 = carate_100 + (SELECT carate_100 FROM receipt WHERE receipt_id = ?) - ?,
          carate_150 = carate_150 + (SELECT carate_150 FROM receipt WHERE receipt_id = ?) - ?,
          carate_250 = carate_250 + (SELECT carate_250 FROM receipt WHERE receipt_id = ?) - ?,
          carate_350 = carate_350 + (SELECT carate_350 FROM receipt WHERE receipt_id = ?) - ?
      WHERE user_id = ?
    `;
    const updateCarateUserValues = [
      receiptId,
      carate_100,
      receiptId,
      carate_150,
      receiptId,
      carate_250,
      receiptId,
      carate_350,
      from_account,
    ];

    await query(updateCarateUserSql, updateCarateUserValues);

    const updateReceiptSql = `
      UPDATE receipt
      SET date = ?, from_account = ?, mobile_no = ?, note = ?, previous_balance = ?, deposite = ?, online_deposite_bank = ?, online_deposite = ?, discount = ?, carate_100 = ?, carate_150 = ?, carate_250 = ?, carate_350 = ?, deposite_carate_price = ?, remaining = ?, baki_100 = ? ,baki_150 = ?, baki_250 = ? , baki_350 = ?
      WHERE receipt_id = ?
    `;
    const updateReceiptValues = [
      formattedDate,
      from_account,
      to_account,
      note,
      previous_balance,
      deposite,
      online_deposite_bank,
      online_deposite,
      discount,
      carate_100,
      carate_150,
      carate_250,
      carate_350,
      deposite_carate_price,
      remaining,
      baki_100,
      baki_150,
      baki_250,
      baki_350,
      receiptId,
    ];

    await query(updateReceiptSql, updateReceiptValues);

    // Log edit history
    const logEditSql = `
      INSERT INTO edit_history (type, bill_no, customer_name, old_quantity, new_quantity, edited_by, edit_date, edit_time)
      VALUES ('receipt', ?, ?, ?, ?, ?, CURDATE(), NOW())
    `;
    await query(logEditSql, [receiptId, from_account, oldRemaining, remaining, added_by]);

    //await commit(connection); // Commit the transaction
    res.status(200).json({ message: "Receipt updated successfully" });
  } catch (error) {
    // await rollback(connection); // Rollback the transaction in case of error
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// try {
//   const receiptId1 = req.params.receiptId;
//   const {
//     receiptId,
//     date,
//     from_account,
//     to_account,
//     note,
//     previous_balance,
//     deposite,
//     online_deposite_bank,
//     online_deposite,
//     discount,
//     carate_100,
//     carate_150,
//     carate_250,
//     carate_350,
//     deposite_carate_price,
//     remaining,
//     added_by,
//   } = req.body;

//   const sql1 = 'Delete from ledger where summary = ? ';
//   const values1 = ['Receipt(' + receiptId1 + ')'];
//   const result1 = await query(sql1, values1);

//   const sql4 = 'Delete from carate_report where summary = ? ';
//   const values4 = ['Receipt(' + receiptId1 + ')'];
//   const result4 = await query(sql4, values4);

//   const sql2 =
//         "INSERT INTO ledger (date,summary,balance,out_carate,total_balance,cash,online,discount,in_carate,remaining,customer_name,online_bank ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?) ";
//       const values2 = [
//         date,
//         "Receipt(" + receiptId + ")",
//         previous_balance,
//         0,
//         remaining,
//         deposite,
//         online_deposite,
//         discount,
//         deposite_carate_price,
//         remaining,
//         from_account,
//         online_deposite_bank,
//       ];
//   query(sql2, values2)
//     .then(ledger => {
//       console.log("Query2")
//       if (ledger.affectedRows === 0) {
//         res.status(404).send('Ledger Data not inserted');
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       res.status(500).send('Internal Server Error'); // Send an error response to the client
//     });

//     const sql3 =
//     "INSERT INTO carate_report (carate_date,summary,customer_name,in_carate_100,in_carate_150, in_carate_250, in_carate_350, out_carate_100, out_carate_150, out_carate_250, out_carate_350, in_carate_total, out_carate_total ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//   const values3 = [
//     date,
//     "Receipt(" + receiptId + ")",
//     from_account,
//     carate_100,
//     carate_150,
//     carate_250,
//     carate_350,
//     0,
//     0,
//     0,
//     0,
//     deposite_carate_price,
//     0,
//   ];
//   query(sql3, values3)
//     .then(carate => {
//       console.log("Query3")

//       if (carate.affectedRows === 0) {
//         res.status(404).send('Carate Data not inserted');
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       res.status(500).send('Internal Server Error'); // Send an error response to the client
//     });

//     const sql6 =
//             'Update ledger set route = (select route_detail from account_table where account_group = "Customer" and name = ?) where summary = ?  ';
//           const values6 = [from_account, "Receipt(" + receiptId + ")"];
//           query(sql6, values6)

//       const sql5 = 'update account_table set current_balance = current_balance + (current_balance - ?) where account_group = "Customer" and name = ?';
//       const values5 = [remaining, from_account];
//       query(sql5, values5)
//         .then(results1 => {
//           //console.log('Results:', results);
//           if (results1.affectedRows === 0) {
//             res.status(404).send('Account Table not updated');
//           }
//         })

//         sql7 = 'update carate_user set carate_100 = carate_100 + (select carate_100  from receipt where receipt_id = ?) - ? ,carate_150 = carate_150 + (select carate_150 from receipt where receipt_id = ?) - ?, carate_250 = carate_250 + (select carate_250 from receipt where receipt_id = ?) - ?, carate_350 = carate_350 + (select carate_350 from receipt where receipt_id = ?) - ? where user_id = ?';
//   //console.log("Updated Data", in_carate_100, in_carate_150, in_carate_250, in_carate_350, cust_name)
//   values7 = [receiptId, carate_100, receiptId, carate_150, receiptId, carate_250, receiptId, carate_350, from_account];
//   const result7 = await query(sql7, values7);

//   // Update data in the database
//   const sql =
//     "UPDATE receipt SET date = ?, from_account = ?, mobile_no = ?, note = ?, previous_balance = ? , deposite = ?, online_deposite_bank = ?, online_deposite = ?, discount = ?, carate_100 = ?, carate_150 = ?, carate_250 = ?, carate_350 = ? , deposite_carate_price = ?, remaining = ?, added_by = ? ,validate = 'Verified'  WHERE receipt_id = ?";
//   const values = [
//     date,
//     from_account,
//     to_account,
//     note,
//     previous_balance,
//     deposite,
//     online_deposite_bank,
//     online_deposite,
//     discount,
//     carate_100,
//     carate_150,
//     carate_250,
//     carate_350,
//     deposite_carate_price,
//     remaining,
//     added_by,
//     receiptId,
//   ];
//   const result = await query(sql, values);

//   // // Check if user was found and updated
//   // if (result.affectedRows === 0) {
//   //   return res.status(404).json({ message: "receipt not found" });
//   // }

//   // Send response
// //   res
// //     .status(200)
// //     .json({ message: "receipt updated successfully", data: result });
// } catch (error) {
//   console.error("Error:", error);
//   res.status(500).json({ message: "Internal Server Error" });
// }
// });

module.exports = router;
