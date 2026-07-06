
const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())

function numberValue(value) {
  return Number(value || 0);
}

function userFilter(column, user, isAdmin) {
  if (isAdmin || !user) return { sql: "", values: [] };
  return { sql: ` AND ${column} = ?`, values: [user] };
}

const PURCHASE_AMOUNT_SQL = `
  COALESCE(
    NULLIF(p.total_quantity, 0),
    COALESCE(pp.productTotal, 0) + COALESCE(p.expenses, 0),
    0
  )
`;
const SALE_AMOUNT_SQL = "COALESCE(NULLIF(total_amount, 0), amount, 0)";
const SALE_COLLECTION_SQL = "COALESCE(cash, 0) + COALESCE(online_amt, 0)";
const RECEIPT_AMOUNT_SQL =
  "COALESCE(deposite, 0) + COALESCE(NULLIF(online_deposite, ''), 0)";
const PAYMENT_AMOUNT_SQL = `
  COALESCE(
    NULLIF(COALESCE(cash, 0) + COALESCE(online, 0) + COALESCE(discount, 0), 0),
    NULLIF(COALESCE(prev_balance, 0) - COALESCE(amounr, 0), 0),
    amounr,
    0
  )
`;

router.post("/dashboard", async function (req, res) {
  try {
    const { date, user, isAdmin } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const purchaseUser = userFilter("added_by", user, isAdmin);
    const saleUser = userFilter("added_by", user, isAdmin);
    const receiptUser = userFilter("added_by", user, isAdmin);
    const paymentUser = userFilter("added_by", user, isAdmin);

    const [
      [purchaseRow],
      [saleRow],
      [receiptRow],
      [paymentRow],
      [openingRow],
      workerRows,
    ] = await Promise.all([
      query(
        `SELECT COALESCE(SUM(${PURCHASE_AMOUNT_SQL}), 0) AS purchaseTotal
           FROM purchase p
           LEFT JOIN (
             SELECT purchase_id, SUM(price) AS productTotal
               FROM purchase_product
              GROUP BY purchase_id
           ) pp ON pp.purchase_id = p.id
          WHERE p.date = ?${purchaseUser.sql}`,
        [date, ...purchaseUser.values]
      ),
      query(
        `SELECT COALESCE(SUM(${SALE_AMOUNT_SQL}), 0) AS saleTotal,
                COALESCE(SUM(${SALE_COLLECTION_SQL}), 0) AS saleCollection
           FROM sale_table
          WHERE date = ?${saleUser.sql}`,
        [date, ...saleUser.values]
      ),
      query(
        `SELECT COALESCE(SUM(${RECEIPT_AMOUNT_SQL}), 0) AS receiptTotal
           FROM receipt
          WHERE date = ?${receiptUser.sql}`,
        [date, ...receiptUser.values]
      ),
      query(
        `SELECT COALESCE(SUM(${PAYMENT_AMOUNT_SQL}), 0) AS paymentTotal
           FROM payment
          WHERE date = ?${paymentUser.sql}`,
        [date, ...paymentUser.values]
      ),
      query(
        `SELECT
            (
              SELECT COALESCE(SUM(${SALE_COLLECTION_SQL}), 0)
                FROM sale_table
               WHERE date < ?${saleUser.sql}
            ) +
            (
              SELECT COALESCE(SUM(${RECEIPT_AMOUNT_SQL}), 0)
                FROM receipt
               WHERE date < ?${receiptUser.sql}
            ) -
            (
              SELECT COALESCE(SUM(${PAYMENT_AMOUNT_SQL}), 0)
                FROM payment
               WHERE date < ?${paymentUser.sql}
            ) AS openingBalance`,
        [
          date,
          ...saleUser.values,
          date,
          ...receiptUser.values,
          date,
          ...paymentUser.values,
        ]
      ),
      isAdmin
        ? query(
            `SELECT added_by AS name,
                    COALESCE(SUM(cash), 0) AS closingCash,
                    COALESCE(SUM(${SALE_AMOUNT_SQL}), 0) AS saleAmount
               FROM sale_table
              WHERE date = ?
              GROUP BY added_by
              HAVING closingCash > 0 OR saleAmount > 0
              ORDER BY added_by`,
            [date]
          )
        : Promise.resolve([]),
    ]);

    const openingBalance = numberValue(openingRow && openingRow.openingBalance);
    const saleCollection = numberValue(saleRow && saleRow.saleCollection);
    const receiptTotal = numberValue(receiptRow && receiptRow.receiptTotal);
    const paymentTotal = numberValue(paymentRow && paymentRow.paymentTotal);
    const closingBalance = openingBalance + saleCollection + receiptTotal - paymentTotal;

    res.json({
      purchaseTotal: numberValue(purchaseRow && purchaseRow.purchaseTotal),
      saleTotal: numberValue(saleRow && saleRow.saleTotal),
      receiptTotal,
      paymentTotal,
      supplierPaymentTotal: paymentTotal,
      openingBalance,
      closingBalance,
      dailySummary: saleCollection + receiptTotal - paymentTotal,
      workers: workerRows,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/purchase", function(req, res) {
    const {date} = req.body;
    console.log(date)
    let sql = `SELECT COALESCE(SUM(${PURCHASE_AMOUNT_SQL}), 0)"TotalPurhcase"
                 FROM purchase p
                 LEFT JOIN (
                   SELECT purchase_id, SUM(price) AS productTotal
                     FROM purchase_product
                    GROUP BY purchase_id
                 ) pp ON pp.purchase_id = p.id
                WHERE p.date = ? `;
    if (!date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

    const values = [date];

    query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Data not found');
        } else {
          res.send(results); // Send all results
          // Do something with the results
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });



  router.post("/sale", function(req, res) {
    const {date} = req.body;
    console.log(date)
    let sql = `SELECT COALESCE(SUM(${SALE_AMOUNT_SQL}), 0)"TotalSale" FROM sale_table where date = ? `;
    if (!date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

    const values = [date];

    query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Data not found');
        } else {
          res.send(results); // Send all results
          // Do something with the results
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });


  router.post("/receipt", function(req, res) {
    const {date} = req.body;
    console.log(date)
    let sql = `SELECT COALESCE(SUM(${RECEIPT_AMOUNT_SQL}), 0)"TotalReceipt" FROM receipt where date = ? `;
    if (!date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

    const values = [date];

    query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Data not found');
        } else {
          res.send(results); // Send all results
          // Do something with the results
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });


  router.post("/payment", function(req, res) {
    const {date} = req.body;
    console.log(date)
    let sql = `SELECT COALESCE(SUM(${PAYMENT_AMOUNT_SQL}), 0) "TotalPayment" FROM payment where date = ? `;
    if (!date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

    const values = [date];

    query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Data not found');
        } else {
          res.send(results); // Send all results
          // Do something with the results
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });

  

  router.post("/worker", function(req, res) {
    const {name, date} = req.body;

    console.log(name)
    // let sql = 'SELECT sum(cash)"closingCash", sum(amount)"saleAmount" FROM sale_table st join account_table a on(a.route_detail = st.route) where account_group="Worker" and date = ? and name = ? ';
    //let sql = 'SELECT sum(cash)"closingCash", sum(amount)"saleAmount" FROM sale_table st join user_table u using(route) join account_table a using(name) where account_group="Worker" and date = ? and name = ? ';
    let sql = `SELECT sum(cash)"closingCash", COALESCE(SUM(${SALE_AMOUNT_SQL}), 0)"saleAmount" FROM sale_table st where date = ? and added_by = ? `;
    values = [date, name]
    
    query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Data not found');
        } else {
          res.send(results); // Send all results
          // Do something with the results
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });



  router.post("/saleuser/:user", function(req, res) {
    const user = req.params.user;
    const {date} = req.body;
    console.log(date)
    let sql = `SELECT COALESCE(SUM(${SALE_AMOUNT_SQL}), 0)"TotalSale" FROM sale_table where date = ? and added_by = ? `;
    if (!date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

    const values = [date,user ];

    query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Data not found');
        } else {
          res.send(results); // Send all results
          // Do something with the results
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });


  router.post("/receiptuser/:user", function(req, res) {
    const user = req.params.user;
    const {date} = req.body;
    console.log(date)
    let sql = `SELECT COALESCE(SUM(${RECEIPT_AMOUNT_SQL}), 0)"TotalReceipt" FROM receipt where date = ? and added_by = ? `;
    if (!date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

    const values = [date, user];

    query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Data not found');
        } else {
          res.send(results); // Send all results
          // Do something with the results
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });
  



module.exports = router;

 
