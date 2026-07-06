const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.post("/purchase", function (req, res) {
  const { date } = req.body;
  console.log(date);
  let sql =
    'SELECT product_name,sum(quantity) "quantity",purchase_price,sum(quantity)*purchase_price "amount" FROM purchase_product where p_date = ?  group by product_name,purchase_price';
  if (!date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const values = [date];

  query(sql, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
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

router.post("/receipt", function (req, res) {
  const { date, added_by } = req.body;
  console.log(date);
  let sql =
    'SELECT from_account,mobile_no,sum(deposite + online_deposite)"TotalReceipt" FROM receipt where date = ?  ';
  let where = " ";
  let group_by = " group by from_account,mobile_no";
  if (!date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const values = [date];

  if (added_by !== "*") {
    where += " and added_by = ? ";
    values.push(added_by);
  }

  query(sql + where + group_by, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
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

router.post("/payment", function (req, res) {
  const { date, toDate } = req.body;
  console.log("From date:", date, "To date:", toDate);
  
  let sql =
    "SELECT from_account, to_account, amounr as amount, cash, online, discount, comment, date FROM payment WHERE DATE(date) >= ? AND DATE(date) <= ? ";
  
  if (!date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const values = [date, toDate || date];
  console.log("SQL:", sql);
  console.log("Values:", values);

  query(sql, values)
    .then((results) => {
      console.log("Results count:", results.length);

      if (results.length === 0) {
        res.status(404).send("Data not found");
      } else {
        res.send(results);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

// router.post("/sale", function(req, res) {
//   const {date, added_by} = req.body;
//   console.log(date)
//   let sql = 'SELECT product,sum(quantity)"quantity",sum(price)"price",sum(cash)"cash",sum(online_amt)"online_amt",sum(discount)"discount",sum(inCarat)"inCarat",sum(out_carate_100)"out_carate_100",sum(out_carate_150)"out_carate_150",sum(out_carate_250)"out_carate_250",sum(out_carate_350)"out_carate_350",sum(in_carate_100)"in_carate_100",sum(in_carate_150)"in_carate_150",sum(in_carate_250)"in_carate_250",sum(in_carate_350)"in_carate_350" FROM sale_table st join sale_product sp on(st.bill_no=sp.bill_id) ';
//   var where = ' where date = ? ';
//   var group_by = ' group by product ';
//   const values = [date];
//   if (!date) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//   if (added_by !== '*'){
//       where += " and added_by = ? "
//       values.push(added_by)
//     }

//   query(sql + where + group_by, values)
//     .then(results => {
//       console.log('Results:', results);

//       if (results.length === 0) {
//         res.status(404).send('Data not found');
//       } else {

//       var totalSale = 0,saleDiscount = 0,sale_cash=0,sale_online=0,sale_incarat=0,carate100=0,carate150=0,carate250=0,carate350 = 0,carate1100=0,carate1150=0,carate2150=0,carate3150 = 0;
//       results.forEach(element => {
//         totalSale += element.price;
//         saleDiscount += element.discount;
//         sale_cash += parseInt(element.cash);
//         sale_online += element.online_amt;
//         sale_incarat += element.inCarat;
//         carate100 += element.in_carate_100;
//         carate150 += element.in_carate_150;
//         carate250 += element.in_carate_250;
//         carate350 += element.in_carate_350;
//         carate1100 += element.out_carate_100;
//         carate1150 += element.out_carate_150;
//         carate2150 += element.out_carate_250;
//         carate3150 += element.out_carate_350;
//       });

//       var sql1 = 'SELECT sum(deposite)"receiptDeposite",sum(online_deposite)"receiptOnline",sum(discount)"receiptDiscount",sum(deposite_carate_price)"receiptIncarat",carate_100,carate_150,carate_250,carate_350 FROM receipt r ';
//       var where1  = 'where date = ?';
//       var values1 = [date]
//       if (added_by !== '*'){
//         where1 += " and added_by = ? "
//         values1.push(added_by)
//       }
//       const groupby = " group by carate_100,carate_150,carate_250,carate_350 "
//         query(sql1+ where1 + groupby, values1)
//           .then(results1 => {
//             console.log('Results 1111:', results1);
//             if (results1.length === 0) {
//               // res.status(404).send('Account Table not updated');
//               const data = {"reports" : results ,"Grand" : {"Total Sale" : totalSale}, "SaleDetails" : {"Cash" : sale_cash, "online" : sale_online, "discount" : saleDiscount, "incarat" : sale_incarat, "carate100":carate100, "carate150": carate150, "carate250": carate250, "carate350": carate350,"carate1100":carate1100, "carate1150": carate1150, "carate2150": carate2150, "carate3150": carate3150 }, "ReceiptDetails" : {"Cash" : 0, "online" : 0, "discount" : 0, "incarat" : 0, "carate1200": 0,"carate1250": 0, "carate2250": 0, "carate3250": 0}, "TotalDetails" : {"Cash" : sale_cash, "online" : sale_online, "discount" : saleDiscount, "incarat" : sale_incarat}};
//               res.send(data);
//             }else{
//             var carate1200=0,carate1250=0,carate2250=0,carate3250 = 0;
//             results1.forEach(element => {
//               carate1200 += element.carate_100;
//               carate1250 += element.carate_150;
//               carate2250 += element.carate_250;
//               carate3250 += element.out_carate_350;
//             });

//             const data = {"reports" : results ,"Grand" : {"Total Sale" : totalSale}, "SaleDetails" : {"Cash" : sale_cash, "online" : sale_online, "discount" : saleDiscount, "incarat" : sale_incarat, "carate100":carate100, "carate150": carate150, "carate250": carate250, "carate350": carate350,"carate1100":carate1100, "carate1150": carate1150, "carate2150": carate2150, "carate3150": carate3150 }, "ReceiptDetails" : {"Cash" : results1[0].receiptDeposite, "online" : results1[0].receiptOnline, "discount" : results1[0].receiptDiscount, "incarat" : results1[0].receiptIncarat, "carate1200": carate1200,"carate1250": carate1250, "carate2250": carate2250, "carate3250": carate3250}, "TotalDetails" : {"Cash" : sale_cash + results1[0].receiptDeposite, "online" : sale_online + results1[0].receiptOnline, "discount" : saleDiscount + results1[0].receiptDiscount, "incarat" : sale_incarat + results1[0].receiptIncarat}};
//             res.send(data);
//           }
//           // res.send(data); // Send all results
//          })
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       res.status(500).send('Internal Server Error'); // Send an error response to the client
//     });
// });

router.post("/sale", function (req, res) {
  const { date, added_by } = req.body;
  console.log("Filter date:", date);

  if (!date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // --- 1) SALES BY PRODUCT ---
  const sql = `
    SELECT
      bill_no,
      SUM(amount)                AS amount,
      SUM(cash)                  AS cash,
      SUM(online_amt)            AS online_amt,
      SUM(discount)              AS discount,
      SUM(inCarat)               AS inCarat,
      SUM(out_carate_100)        AS out_carate_100,
      SUM(out_carate_150)        AS out_carate_150,
      SUM(out_carate_250)        AS out_carate_250,
      SUM(out_carate_350)        AS out_carate_350,
      SUM(in_carate_100)         AS in_carate_100,
      SUM(in_carate_150)         AS in_carate_150,
      SUM(in_carate_250)         AS in_carate_250,
      SUM(in_carate_350)         AS in_carate_350
    FROM sale_table 
  `;
  let where = " WHERE date = ? ";
  const values = [date];

  if (added_by !== "*") {
    where += " AND added_by = ? ";
    values.push(added_by);
  }

  const group_by = " GROUP BY bill_no ";

  query(sql + where + group_by, values)
    .then((results) => {
      console.log("Sales results:", results);
      if (results.length === 0) {
        return res.status(404).send("No sales data found for that date.");
      }

      // compute sale aggregates
      let totalSale = 0;
      let saleDiscount = 0;
      let sale_cash = 0;
      let sale_online = 0;
      let sale_incarat = 0;
      let carate100 = 0,
        carate150 = 0,
        carate250 = 0,
        carate350 = 0,
        carate1100 = 0,
        carate1150 = 0,
        carate2150 = 0,
        carate3150 = 0;

      results.forEach((el) => {
        totalSale += Number(el.amount || 0);
        saleDiscount += Number(el.discount || 0);
        sale_cash += Number(el.cash || 0);
        sale_online += Number(el.online_amt || 0);
        sale_incarat += Number(el.inCarat || 0);

        carate100 += Number(el.in_carate_100 || 0);
        carate150 += Number(el.in_carate_150 || 0);
        carate250 += Number(el.in_carate_250 || 0);
        carate350 += Number(el.in_carate_350 || 0);
        carate1100 += Number(el.out_carate_100 || 0);
        carate1150 += Number(el.out_carate_150 || 0);
        carate2150 += Number(el.out_carate_250 || 0);
        carate3150 += Number(el.out_carate_350 || 0);
      });

      // --- 2) RECEIPTS AGGREGATE ---
      const sql1 = `
        SELECT
          SUM(deposite)             AS receiptDeposite,
          SUM(online_deposite)      AS receiptOnline,
          SUM(discount)             AS receiptDiscount,
          SUM(deposite_carate_price)AS receiptIncarat,
          carate_100,
          carate_150,
          carate_250,
          carate_350
        FROM receipt r
      `;
      let where1 = " WHERE date = ? ";
      const values1 = [date];

      if (added_by !== "*") {
        where1 += " AND added_by = ? ";
        values1.push(added_by);
      }

      const groupby1 =
        " GROUP BY carate_100, carate_150, carate_250, carate_350 ";

      return query(sql1 + where1 + groupby1, values1).then((results1) => {
        console.log("Receipt results:", results1);

        // defaults if no receipt rows
        let receiptCash = 0;
        let receiptOnline = 0;
        let receiptDiscount = 0;
        let receiptIncarat = 0;
        let carate1200 = 0,
          carate1250 = 0,
          carate2250 = 0,
          carate3250 = 0;

        if (results1.length > 0) {
          receiptCash = Number(results1[0].receiptDeposite || 0);
          receiptOnline = Number(results1[0].receiptOnline || 0);
          receiptDiscount = Number(results1[0].receiptDiscount || 0);
          receiptIncarat = Number(results1[0].receiptIncarat || 0);

          results1.forEach((el) => {
            carate1200 += Number(el.carate_100 || 0);
            carate1250 += Number(el.carate_150 || 0);
            carate2250 += Number(el.carate_250 || 0);
            carate3250 += Number(el.carate_350 || 0);
          });
        }

        // --- 3) YOUR NEW QUERY (e.g. TAX/SERVICE) ---
        // replace this SQL with your actual third‐query
        const sql2 = `
             SELECT
            product,
            SUM(quantity)              AS quantity,
            SUM(price)                 AS price
          FROM sale_product sp join sale_table st on(st.bill_no=sp.bill_id) 
          `;
        let where2 = " WHERE date = ? ";
        const values2 = [date];

        if (added_by !== "*") {
          where2 += " AND added_by = ? ";
          values2.push(added_by);
        }
        const group_by2 = " GROUP BY product ";
        return query(sql2 + where2 + group_by2, values2).then((results2) => {
          console.log("Third-query results:", results2);

          // --- assemble final response ---
          const data = {
            reports: results2,

            Grand: {
              "Total Sale": totalSale,
            },

            SaleDetails: {
              Cash: sale_cash,
              online: sale_online,
              discount: saleDiscount,
              incarat: sale_incarat,
              carate100,
              carate150,
              carate250,
              carate350,
              carate1100,
              carate1150,
              carate2150,
              carate3150,
            },

            ReceiptDetails: {
              Cash: receiptCash,
              online: receiptOnline,
              discount: receiptDiscount,
              incarat: receiptIncarat,
              carate1200,
              carate1250,
              carate2250,
              carate3250,
            },

            TotalDetails: {
              Cash: sale_cash + receiptCash,
              online: sale_online + receiptOnline,
              discount: saleDiscount + receiptDiscount,
              incarat: sale_incarat + receiptIncarat,
            },
          };

          res.send(data);
        });
      });
    })
    .catch((error) => {
      console.error("Error in /sale:", error);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/remainder/:route?", function (req, res) {
  const route = req.params.route;
  const { date } = req.body;
  console.log(date);
  //let sql = 'SELECT sum(amounr)"TotalPayment" FROM payment where date = ? ';
  const sql =
    "SELECT name,address,mobile_no,last_update,current_balance FROM account_table ";
  var where =
    ' where account_group = "Customer" and current_balance > 0 and last_update BETWEEN DATE_SUB( ?, INTERVAL 2 DAY) AND ? ';

  if (!date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const values = [date, date];

  if (route) {
    where += " and route_detail = ? ";
    values.push(route);
  }

  query(sql + where, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
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

router.get("/user", function (req, res) {
  // const {date} = req.body;
  // console.log(date)
  let sql = "SELECT distinct added_by FROM sale_table ";

  // const values = [date];

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
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

router.get("/customer/:route", function (req, res) {
  const route = req.params.route;
  // console.log(date)
  let sql = "SELECT distinct cust_name FROM sale_table where route = ? ";

  const values = [route];

  query(sql, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
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

router.get("/customerSale/:route", function (req, res) {
  const route = req.params.route;
  if (route == "All root") {
    var sql =
      'SELECT distinct name,mobile_no,route_detail FROM account_table where account_group = "Customer" ';
    var values = [];
  } else {
    var sql =
      'SELECT distinct name,mobile_no,route_detail FROM account_table where account_group = "Customer" and route_detail = ? ';
    var values = [route];
  }
  // console.log(date)

  query(sql, values)
    .then((results) => {
      console.log(sql, values);
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
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

router.post("/customersaleKhatawani", function (req, res) {
  const { route } = req.body;

  let sql =
    'SELECT distinct name,mobile_no,route_detail FROM account_table where account_group = "Customer"';
  let values = [];

  if (
    route &&
    route !== "*" &&
    !(Array.isArray(route) && (route.length === 0 || route.includes("*")))
  ) {
    sql += " and route_detail in (?) ";
    values.push(route);
  }
  // console.log(date)

  query(sql, values)
    .then((results) => {
      console.log(sql, values);
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
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

router.get("/saleProduct/:bill_no", function (req, res) {
  const bill_no = req.params.bill_no;
  let sql = "SELECT distinct id from sale_product where bill_id = ? ";
  const values = [bill_no];

  query(sql, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
      } else {
        res.send(results);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

router.get("/purchaseProduct/:bill_no", function (req, res) {
  const bill_no = req.params.bill_no;
  let sql = "SELECT distinct id from purchase_product where purchase_id = ? ";
  const values = [bill_no];
  query(sql, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
      } else {
        res.send(results);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

router.get("/SupplierAccount", function (req, res) {
  // const {date} = req.body;
  // console.log(date)
  let sql = "SELECT distinct supplier_bank_account FROM payment ";

  // const values = [date];

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
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

// Get all payment summary (without date filter)
router.get("/payment-summary", function (req, res) {
  console.log("Fetching all payment summary data");
  
  let sql = `
    SELECT 
      SUM(CAST(amounr AS DECIMAL(10, 2))) as totalAmount,
      COUNT(*) as totalTransactions,
      SUM(CAST(cash AS DECIMAL(10, 2))) as totalCash,
      SUM(CAST(online AS DECIMAL(10, 2))) as totalOnline,
      SUM(CAST(discount AS DECIMAL(10, 2))) as totalDiscount
    FROM payment
  `;

  query(sql)
    .then((results) => {
      console.log("Payment Summary Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
      } else {
        res.send(results);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
