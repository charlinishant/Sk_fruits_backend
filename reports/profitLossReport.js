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
//     "bata" : "*",
//     "product" : "*"
//   }

//SQL Query

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
      "bill_no",
      "gadi_number",
      "bata",
      "product",
      "sold_quantity",
      "purchase_price",
      "selling_price",
      "Amount",
      "profit_loss",
    ];

    // Map data for autoTable (Reports)
    const reportData = data.reports.map((report) => [
      report.bill_no,
      report.gadi_number,
      report.bata,
      report.product,
      report.sold_quantity,
      report.purchase_price,
      report.selling_price,
      report.Amount,
      report.profit_loss,
    ]);
    // Calculate grand total
    // const grandTotal = reportData.reduce((acc, curr) => acc + curr[3], 0);
    // Calculate grand totals
    const grandTotalSoldQuantity = data.reports.reduce(
      (total, report) => total + parseFloat(report.sold_quantity),
      0
    );
    const grandTotalAmount = data.reports.reduce(
      (total, report) => total + parseFloat(report.purchase_price),
      0
    );
    const grandTotalQuantity = data.reports.reduce(
      (total, report) => total + parseFloat(report.selling_price),
      0
    );

    const grandTotalFinalAmount = data.reports.reduce(
      (total, report) => total + parseFloat(report.Amount),
      0
    );
    const grandTotalProfit = data.reports.reduce(
      (total, report) =>
        total + parseFloat(report.profit_loss.split("Profit:")[1]),
      0
    );

    // Add grand totals row to reportData
    // reportData.push(['Grand Total:', '', '', '','', grandTotalAmount.toFixed(2), grandTotalQuantity.toFixed(2)]);

    // Add grand total to the report data
    const reportDataWithTotal = [
      ...reportData,
      [
        "Grand Total:",
        "",
        "",
        "",
        grandTotalSoldQuantity.toFixed(2),
        grandTotalAmount.toFixed(2),
        grandTotalQuantity.toFixed(2),
        grandTotalFinalAmount.toFixed(2),
        grandTotalProfit.toFixed(2),
      ],
    ];

    // Add report data to PDF
    doc.autoTable({
      head: [customHeaders],
      body: reportDataWithTotal,
      startY: startY + 20,
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
      "attachment; filename=Supplier_Outstanding.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/detail/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, bata, vehicle, customer, user, route, product } =
    req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    select  
        st.bill_no,st.date,cust_name,gadi_number,sp.bata,sp.product,sum(sp.quantity)"sold_quantity", sum(sp.quantity) * purchase_price "purchase_price"  ,rate"selling_price" , sum(sp.quantity) * rate "Amount",
        CASE
        WHEN (sp.rate - pp.purchase_price) * SUM(sp.quantity) > 0 THEN CONCAT('Profit: ', (sp.rate - pp.purchase_price) * SUM(sp.quantity))
        WHEN (sp.rate - pp.purchase_price) * SUM(sp.quantity) < 0 THEN CONCAT('Loss: ', ABS((sp.rate - pp.purchase_price) * SUM(sp.quantity)))
        ELSE 'No Profit No Loss'
    END AS profit_loss
    from sale_table st join sale_product sp on (st.bill_no=sp.bill_id) join purchase_product pp on(sp.bata= pp.bata) join purchase p on (pp.purchase_id=p.id) `;

  var where = " where st.date between ?  and ? ";
  var values = [from_date, to_date];
  var groupby =
    " group by st.bill_no,sp.bata,sp.product,purchase_price,rate,gadi_number,cust_name,st.date";
  if (bata !== "*") {
    where += "and sp.bata = ? ";
    values.push(bata);
  }
  if (vehicle !== "*") {
    where += "and p.gadi_number = ? ";
    values.push(vehicle);
  }

  if (customer !== "*") {
    where += "and st.cust_name = ? ";
    values.push(customer);
  }

  if (user !== "*") {
    where += "and st.added_by = ? ";
    values.push(user);
  }

  if (route !== "*") {
    where += "and st.route = ? ";
    values.push(route);
  }

  if (product !== "*") {
    where += "and sp.product = ? ";
    values.push(product);
  }

  query(sql + where + groupby, values)
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



router.post("/undetail/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date, bata, vehicle, customer, user, route, product } =
    req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }


  // Construct the base SQL query
let baseSql = `
SELECT 
    bata,
    product,
    SUM(sold_quantity) AS total_sold_quantity,
    SUM(total_purchase_price) AS total_purchase_price,
    SUM(total_selling_price) AS total_selling_price,
    SUM(total_amount) AS total_amount,
    CASE
            WHEN SUM(total_profit_loss) > 0 THEN CONCAT('Profit: ', SUM(total_profit_loss))
            WHEN SUM(total_profit_loss) < 0 THEN CONCAT('Loss: ', ABS(SUM(total_profit_loss)))
            ELSE 'No Profit No Loss'
        END AS net_profit_loss
FROM (
    SELECT  
        sp.bata,
        sp.product,
        SUM(sp.quantity) AS sold_quantity,
        SUM(sp.quantity) * pp.purchase_price AS total_purchase_price,
        sp.rate AS total_selling_price,
        SUM(sp.quantity) * sp.rate AS total_amount,
        SUM(
            CASE
                WHEN (sp.rate - pp.purchase_price) > 0 THEN (sp.rate - pp.purchase_price) * sp.quantity
                WHEN (sp.rate - pp.purchase_price) < 0 THEN (sp.rate - pp.purchase_price) * sp.quantity
                ELSE 0
            END
        ) AS total_profit_loss
    FROM sale_table st 
    JOIN sale_product sp ON st.bill_no = sp.bill_id
    JOIN purchase_product pp ON sp.bata = pp.bata
    JOIN purchase p ON pp.purchase_id = p.id
    WHERE st.date BETWEEN ? AND ?
`;

// Initialize where clause and values
let where = "  ";
const values = [from_date, to_date];

// Add conditions dynamically
if (bata !== "*") {
where += " AND sp.bata = ? ";
values.push(bata);
}
if (vehicle !== "*") {
where += " AND p.gadi_number = ? ";
values.push(vehicle);
}
if (customer !== "*") {
where += " AND st.cust_name = ? ";
values.push(customer);
}
if (user !== "*") {
where += " AND st.added_by = ? ";
values.push(user);
}
if (route !== "*") {
where += " AND st.route = ? ";
values.push(route);
}
if (product !== "*") {
where += " AND sp.product = ? ";
values.push(product);
}

// Append dynamic conditions and finalize query
const dynamicConditions = where ? where.replace(/^AND/, "") : "";
const finalSql = `${baseSql} ${dynamicConditions} GROUP BY sp.bata, sp.product, pp.purchase_price, sp.rate
) AS aggregated
GROUP BY bata, product;`;

// Execute the query
query(finalSql, values)
.then((results) => {
if (results.length === 0) {
  res.status(404).send("No Report Found");
} else {
  res.send({ reports: results });
}
})
.catch((error) => {
console.error("Error:", error);
res.status(500).send("Internal Server Error");
});


});

// router.post("/group[/", async (req, res) => {
//   // Get THe data from request body
//   const { from_date, to_date, bata, vehicle, customer, user, route, product } =
//     req.body;

//   // Validate incoming data
//   if (!from_date || !to_date) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const sql = `
//     select  
//         st.bill_no,cust_name,gadi_number,sp.bata,sp.product,sum(sp.quantity)"sold_quantity", sum(sp.quantity) * purchase_price "purchase_price"  ,rate"selling_price" , sum(sp.quantity) * rate "Amount",
//         CASE
//         WHEN (sp.rate - pp.purchase_price) * S
//         UM(sp.quantity) > 0 THEN CONCAT('Profit: ', (sp.rate - pp.purchase_price) * SUM(sp.quantity))
//         WHEN (sp.rate - pp.purchase_price) * SUM(sp.quantity) < 0 THEN CONCAT('Loss: ', ABS((sp.rate - pp.purchase_price) * SUM(sp.quantity)))
//         ELSE 'No Profit No Loss'
//     END AS profit_loss
//     from sale_table st join sale_product sp on (st.bill_no=sp.bill_id) join purchase_product pp on(sp.bata= pp.bata) join purchase p on (pp.purchase_id=p.id) `;

//   var where = " where st.date between ?  and ? ";
//   var values = [from_date, to_date];
//   var groupby =
//     " group by st.bill_no,sp.bata,sp.product,purchase_price,rate,gadi_number,cust_name";
//   if (bata !== "*") {
//     where += "and sp.bata = ? ";
//     values.push(bata);
//   }
//   if (vehicle !== "*") {
//     where += "and p.gadi_number = ? ";
//     values.push(vehicle);
//   }

//   if (customer !== "*") {
//     where += "and st.cust_name = ? ";
//     values.push(customer);
//   }

//   if (user !== "*") {
//     where += "and st.added_by = ? ";
//     values.push(user);
//   }

//   if (route !== "*") {
//     where += "and st.route = ? ";
//     values.push(route);
//   }

//   if (product !== "*") {
//     where += "and sp.product = ? ";
//     values.push(product);
//   }

//   query(sql + where + groupby, values)
//     .then((results) => {
//       if (results.affectedRows === 0) {
//         res.status(404).send("No Report Found");
//       } else {
//         const data = { reports: results };
//         res.send(data); // Send all results
//         // Do something with the results
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       res.status(500).send("Internal Server Error"); // Send an error response to the client
//     });
// });

module.exports = router;
