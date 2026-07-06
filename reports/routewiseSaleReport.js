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
    console.log(data);
    const doc = new jsPDF('landscape'); // Changed to landscape mode
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

    doc.addImage(imgData, "PNG", 10, 8, 270, 50); // Adjusted width for landscape
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
    // if (data.reports[0].cust_name && data.reports[0].cust_name !== "") {
    //   doc.text(`Customer Name: ${data.reports[0].cust_name}`, 50, 50);
    //   startY = 60; // Adjust startY for the next line
    // }
    // if (data.reports[0].route && data.reports[0].route !== "") {
    //   doc.text(`Route: ${data.reports[0].route}`, 50, startY);
    //   startY += 10; // Adjust startY for the next section
    // }
    const customHeaders = [
      "bill_no",
      "date",
      "amount",
      "carate_amount",
      "pre_balance",
      "total_amount",
      "online_amt",
      "discount",
      "inCarat",
      "PaidAmount",
      "balance",
      "comment",
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
      report.amount,
      report.carate_amount,
      report.pre_balance,
      report.total_amount,
      report.online_amt,
      report.discount,
      report.inCarat,
      report.PaidAmount,
      report.balance,
      report.comment,
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

router.post("/detail/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, cust_name, route, product, bata, user, vehicle } =
    req.body;
  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    'select bill_no,st.date,cust_name,route,amount,carate_amount, total_amount,pre_balance,online_amt, discount,inCarat,cash "PaidAmount", balance, comment from sale_table st join sale_product sp on (st.bill_no=sp.bill_id) left join purchase_product pp on (sp.bata=pp.bata) left join purchase p on (pp.purchase_id=p.id) ';
    // 'select bill_no,st.date,cust_name,route,amount,carate_amount, total_amount,pre_balance,online_amt, discount,inCarat,sum(cash + online_amt) "PaidAmount", balance, comment from sale_table st join sale_product sp on (st.bill_no=sp.bill_id) left join purchase_product pp on (sp.bata=pp.bata) left join purchase p on (pp.purchase_id=p.id) ';
  var where = " where st.date between ?  and ? ";
  const group =
    " group by bill_no,date,cust_name,route,amount,carate_amount, total_amount,pre_balance,online_amt, discount,inCarat,balance,comment";
  var values = [from_date, to_date];

  if (route !== "*") {
    where += "and route = ? ";
    values.push(route);
  }
  if (cust_name !== "*") {
    where += "and cust_name = ?";
    values.push(cust_name);
  }
  if (product !== "*") {
    where += "and product = ?";
    values.push(product);
  }
  if (bata !== "*") {
    where += "and sp.bata = ?";
    values.push(bata);
  }
  if (user !== "*") {
    where += "and st.added_by = ?";
    values.push(user);
  }
  if (vehicle !== "*") {
    where += "and gadi_number = ?";
    values.push(vehicle);
  }

  query(sql + where + group, values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        var billAmt = 0,
          outCarat = 0,
          totaBillAmt = 0,
          pre_bal = 0,
          online_amt = 0,
          discount = 0,
          inCarte = 0,
          paidAmt = 0,
          balance = 0;
        results.forEach((element) => {
          billAmt += element.amount;
          outCarat += element.carate_amount;
          totaBillAmt += element.total_amount;
          pre_bal += element.pre_balance;
          online_amt += element.online_amt;
          discount += element.discount;
          inCarte += element.inCarat;
          paidAmt += element.PaidAmount;
          balance += element.balance;
        });
        const data = {
          reports: results,
          Grand: {
            "Grand Bill Amount": billAmt,
            "Grand outCarate": outCarat,
            "Total Bill Amount": totaBillAmt,
            "Previous Balance": pre_bal,
            "Online Amount": online_amt,
            "Grand Discount": discount,
            "Grand inCarate": inCarte,
            "Grand Paid Amount": paidAmt,
            "Grand Balance": balance,
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

router.post("/undetail/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, cust_name, route, product, bata, user, vehicle } =
    req.body;
  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "select bill_no,st.date,cust_name,mobile_no,quantity,rate,price,product,mark,bata from sale_table st join sale_product sp on (st.bill_no=sp.bill_id)  ";
  var where = " where st.date between ?  and ? ";
  const group = " ";
  var values = [from_date, to_date];

  if (route !== "*") {
    where += "and route = ? ";
    values.push(route);
  }
  if (cust_name !== "*") {
    where += "and cust_name = ?";
    values.push(cust_name);
  }
  if (product !== "*") {
    where += "and product = ?";
    values.push(product);
  }
  if (bata !== "*") {
    where += "and sp.bata = ?";
    values.push(bata);
  }
  if (user !== "*") {
    where += "and st.added_by = ?";
    values.push(user);
  }
  if (vehicle !== "*") {
    where += "and gadi_number = ?";
    values.push(vehicle);
  }

  query(sql + where + group, values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        var quantity = 0,
          rate = 0,
          price = 0;
        results.forEach((element) => {
          quantity += element.quantity;
          rate += element.rate;
          price += element.price;
        });
        const data = {
          reports: results,
          Grand: {
            "Grand Quantity": quantity,
            "Grand Rate": rate,
            "Total Price": price,
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
