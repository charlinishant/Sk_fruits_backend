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

    const customHeaders = [
      "bill_no",
      "date",
      "cust_name",
      "route",
      "amount",
      "cash",
      "online_amt",
      "online_acc",
      "discount",
      "inCarat",
      "carate_amount",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.bill_no,
      new Date(report.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      report.cust_name,
      report.route,
      report.amount,
      report.cash,
      report.online_amt,
      report.online_acc,
      report.discount,
      report.inCarat,
      report.carate_amount,
    ]);

    // Calculate grand totals for Reports
    const grandTotalReports = {
      amount: data.GrandSale.saleAmount,
      cash: data.GrandSale.saleCash,
      online_amt: data.GrandSale.saleOnline,
      online_acc: "",
      discount: data.GrandSale.saleDiscount,
      inCarat: data.GrandSale.saleInCarat,
      carate_amount: data.GrandSale.saleCarate,
    };

    // Add Reports table to PDF
    doc.autoTable({
      head: [customHeaders],
      body: reportData,
      startY: 50,
      theme: "grid",
      headStyles: { fillColor: [255, 0, 0] },
      margin: { top: 10 },
      styles: {
        font: "NotoSansDevanagari",
        fontStyle: "normal",
      },
      didParseCell: function (data) {
        if (data.cell.raw) {
          data.cell.text = encodeMarathi(data.cell.raw.toString());
        }
      },
    });

    // Append grand totals to Reports table
    // For sales grand total
    doc.autoTable({
      body: [
        [
          "Grand Total",
          "",
          "",
          "",
          grandTotalReports.amount,
          grandTotalReports.cash,
          grandTotalReports.online_amt,
          grandTotalReports.online_acc,
          grandTotalReports.discount,
          grandTotalReports.inCarat,
          grandTotalReports.carate_amount,
        ],
      ],
      startY: doc.autoTable.previous.finalY + 10,
      theme: "grid",
      styles: {
        font: "NotoSansDevanagari",
        fontStyle: "normal",
      },
      didParseCell: function (data) {
        if (data.cell.raw) {
          data.cell.text = encodeMarathi(data.cell.raw.toString());
        }
      },
    });

    const customHeaders1 = [
      "receipt_id",
      "date",
      "Customer",
      "mobile_no",
      "note",
      "cash",
      "online",
      "discount",
      "inCarat",
      "Amt",
    ];

    // Map data for autoTable (Receipts)
    const receiptData = data.Receipt.map((receipt) => [
      receipt.receipt_id,
      new Date(receipt.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      receipt.Customer,
      receipt.mobile_no,
      receipt.note,
      receipt.cash,
      receipt.online,
      receipt.discount,
      receipt.inCarat,
      receipt.Amt,
    ]);

    // Calculate grand totals for Receipts
    const grandTotalReceipts = {
      cash: data.GrandReceipt.receiptCash,
      online: data.GrandReceipt.receiptOnline,
      discount: data.GrandReceipt.receiptDiscount,
      inCarat: data.GrandReceipt.receiptInCarat,
      Amt: data.GrandReceipt.receiptAmt,
    };

    // Add Receipts table to PDF
    // For the receipt report
    doc.autoTable({
      head: [customHeaders1],
      body: receiptData,
      startY: doc.autoTable.previous.finalY + 10,
      theme: "grid",
      headStyles: { fillColor: [0, 255, 0] },
      margin: { top: 10 },
      styles: {
        font: "NotoSansDevanagari",
        fontStyle: "normal",
      },
      didParseCell: function (data) {
        if (data.cell.raw) {
          data.cell.text = encodeMarathi(data.cell.raw.toString());
        }
      },
    });

    // Append grand totals to Receipts table
    // For receipt grand total
    doc.autoTable({
      body: [
        [
          "Grand Total",
          "",
          "",
          "",
          "",
          grandTotalReceipts.cash,
          grandTotalReceipts.online,
          grandTotalReceipts.discount,
          grandTotalReceipts.inCarat,
          grandTotalReceipts.Amt,
        ],
      ],
      startY: doc.autoTable.previous.finalY + 10,
      theme: "grid",
      styles: {
        font: "NotoSansDevanagari",
        fontStyle: "normal",
      },
      didParseCell: function (data) {
        if (data.cell.raw) {
          data.cell.text = encodeMarathi(data.cell.raw.toString());
        }
      },
    });

    // Generate PDF as a buffer and send it as a response
    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Daily_Report.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, route, added_by, customer } = req.body;

  console.log('Daily Report Request:', { from_date, to_date, route, added_by, customer });

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = "SELECT * FROM sale_table st ";
  var where = " where date between ?  and ? ";
  var values = [from_date, to_date];
  
  if (route && route !== "*") {
    where += "and route = ? ";
    values.push(route);
  }

  if (added_by && added_by !== "*") {
    where += "and added_by = ? ";
    values.push(added_by);
  }

  if (customer && customer !== "*" && customer !== "") {
    where += "and TRIM(cust_name) = TRIM(?) ";
    values.push(customer);
  }

  console.log('Sale Query:', sql + where);
  console.log('Sale Values:', values);

  query(sql + where, values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        const sql1 =
          'SELECT receipt_id,date,from_account "Customer",mobile_no,note,previous_balance,deposite "cash",online_deposite "online",discount,deposite_carate_price"inCarat",(deposite+online_deposite-discount+deposite_carate_price)"Amt",validate,carate_100,carate_150,carate_250,carate_350,note,previous_balance,online_deposite_bank,remaining,added_by,previous_baki_100,previous_baki_150,previous_baki_250,previous_baki_350 FROM receipt ';
        var where1 = " where date between ?  and ? ";
        var values1 = [from_date, to_date];
        
        if (route && route !== "*") {
          where1 +=
            "and from_account in (select distinct name from account_table where route_detail = ? )";
          values1.push(route);
        }

        if (added_by && added_by !== "*") {
          where1 += "and added_by = ? ";
          values1.push(added_by);
        }

        if (customer && customer !== "*" && customer !== "") {
          where1 += "and TRIM(from_account) = TRIM(?) ";
          values1.push(customer);
        }

        console.log('Receipt Query:', sql1 + where1);
        console.log('Receipt Values:', values1);
        query(sql1 + where1, values1)
          .then((receipt) => {
            if (receipt.affectedRows === 0) {
              res.status(404).send("No Report Found");
            } else {
              var saleAmount = 0,
                saleCash = 0,
                saleOnline = 0,
                saleDiscount = 0,
                saleInCarat = 0,
                saleCarate = 0;
              (saleincarate_100 = 0),
                (saleincarate_150 = 0),
                (saleincarate_250 = 0),
                (saleincarate_350 = 0);
              (saleoutcarate_100 = 0),
                (saleoutcarate_150 = 0),
                (saleoutcarate_250 = 0),
                (saleoutcarate_350 = 0);
              results.forEach((element) => {
                saleAmount += element.amount;
                saleCash += element.cash;
                saleOnline += element.online_amt;
                saleDiscount += element.discount;
                saleInCarat += element.inCarat;
                saleCarate += element.carate_amount;
                (saleincarate_100 += element.out_carate_100),
                  (saleincarate_150 += element.out_carate_150),
                  (saleincarate_250 += element.out_carate_250),
                  (saleincarate_350 += element.out_carate_350);
                (saleoutcarate_100 += element.in_carate_100),
                  (saleoutcarate_150 += element.in_carate_150),
                  (saleoutcarate_250 += element.in_carate_250),
                  (saleoutcarate_350 += element.in_carate_350);
              });

              var receiptCash = 0,
                receiptOnline = 0,
                receiptDiscount = 0,
                receiptInCarat = 0,
                receiptAmt = 0,
                receiptcarate_100 = 0,
                receiptcarate_150 = 0,
                receiptcarate_250 = 0,
                receiptcarate_350 = 0;
              receipt.forEach((element) => {
                receiptCash += element.cash;
                receiptOnline += parseInt(element.online);
                receiptDiscount += element.discount;
                receiptInCarat += element.inCarat;
                receiptAmt += element.Amt;
                (receiptcarate_100 += element.carate_100),
                  (receiptcarate_150 += element.carate_150),
                  (receiptcarate_250 += element.carate_250),
                  (receiptcarate_350 += element.carate_350);
              });

              const data = {
                reports: results,
                GrandSale: {
                  saleAmount: saleAmount,
                  saleCash: saleCash,
                  saleOnline: saleOnline,
                  saleDiscount: saleDiscount,
                  saleInCarat: saleInCarat
                    ? `${saleInCarat} (${[
                        saleincarate_100 > 0 ? `100*${saleincarate_100}` : "",
                        saleincarate_150 > 0 ? `150*${saleincarate_150}` : "",
                        saleincarate_250 > 0 ? `250*${saleincarate_250}` : "",
                        saleincarate_350 > 0 ? `350*${saleincarate_350}` : "",
                      ]
                        .filter(Boolean)
                        .join("|")})`
                    : null,
                  saleCarate: saleCarate
                    ? `${saleCarate} (${[
                        saleoutcarate_100 > 0 ? `100*${saleoutcarate_100}` : "",
                        saleoutcarate_150 > 0 ? `150*${saleoutcarate_150}` : "",
                        saleoutcarate_250 > 0 ? `250*${saleoutcarate_250}` : "",
                        saleoutcarate_350 > 0 ? `350*${saleoutcarate_350}` : "",
                      ]
                        .filter(Boolean)
                        .join("|")})`
                    : null,
                },
                Receipt: receipt,
                GrandReceipt: {
                  receiptCash: receiptCash,
                  receiptOnline: receiptOnline,
                  receiptDiscount: receiptDiscount,
                  receiptInCarat: receiptInCarat
                    ? `${receiptInCarat} (${[
                        receiptcarate_100 > 0 ? `100*${receiptcarate_100}` : "",
                        receiptcarate_150 > 0 ? `150*${receiptcarate_150}` : "",
                        receiptcarate_250 > 0 ? `250*${receiptcarate_250}` : "",
                        receiptcarate_350 > 0 ? `350*${receiptcarate_350}` : "",
                      ]
                        .filter(Boolean)
                        .join("|")})`
                    : null,
                  receiptAmt: receiptAmt,
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

        // const data = {"reports" : results."Receipt": receipt};
        // res.send(data); // Send all results
        // Do something with the results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

module.exports = router;
