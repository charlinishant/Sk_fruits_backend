const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
// router.get('/', (req, res) => {
//     res.send('Welcome to the userData!');
// });

// router.get("/", function(req, res) {
//     query('SELECT * FROM user_table',params)
//     .then(results => {
//           console.log('Results in .then():', results);
//           res.send(results)
//           // Do something with the results
//       })
//       .catch(error => {
//           console.error('Error in .then():', error);
//       });
//     });

//Fetch paymentData
router.get("/:paymentId?", function (req, res) {
  const paymentId = req.params.paymentId;
  let sql = "SELECT * FROM payment";
  // let params = [];

  if (paymentId) {
    sql += ` WHERE p_id = ${mysql.escape(paymentId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("paymentId not found");
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

// Delete payment data
// router.delete("/deletepaymentId/:paymentId?", (req, res) => {
//   const paymentId = req.params.paymentId;
//   var sql = 'DELETE FROM payment';

//   if (!paymentId) {
//     return res.status(400).send('Invalid payment ID');
//   } else{
//     sql += ` WHERE p_id = ${mysql.escape(paymentId)}`;
//   }

//   query(sql)
//       .then(results => {
//         console.log('Results:', results);

//         if (results.affectedRows === 0) {
//           res.status(404).send('paymentId not found');
//         } else {
//           res.send(results); // Send all results
//           // Do something with the results
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error'); // Send an error response to the client
//       });
// });

router.delete("/deletePayment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    return res.status(400).json({ message: "Missing paymentId parameter" });
  }

  // Fetch the payment record to reverse any account balance updates
  const getSql = "SELECT * FROM payment WHERE p_id = ?";
  query(getSql, [paymentId])
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).json({ message: "Payment not found" });
      }

      const payment = result[0];

      // Revert balance update (optional depending on your logic)
      const updateSql =
        'UPDATE account_table SET current_balance = current_balance - ? + ?  WHERE account_group = "Supplier" AND name = ?';
      const updateValues = [
        payment.amounr,
        payment.prev_balance,
        payment.to_account,
      ];

      query(updateSql, updateValues)
        .then(() => {
          // Now delete the payment
          const deleteSql = "DELETE FROM payment WHERE p_id = ?";
          query(deleteSql, [paymentId])
            .then((deleteResult) => {
              if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ message: "Payment not deleted" });
              }

              res.status(200).json({ message: "Payment deleted successfully" });
            })
            .catch((err) => {
              console.error("Delete Error:", err);
              res.status(500).send("Failed to delete payment");
            });
        })
        .catch((err) => {
          console.error("Update Balance Error:", err);
          res.status(500).send("Failed to update balance before deletion");
        });
    })
    .catch((err) => {
      console.error("Fetch Error:", err);
      res.status(500).send("Failed to fetch payment before deletion");
    });
});

/// Add payments data
router.post("/insertPayment", async (req, res) => {
  // Get THe data from request body
  const {
    date,
    from_account,
    to_account,
    comment,
    prev_balance,
    amounr,
    added_by,
    mobile_no,
    cash,
    online,
    discount,
    SupplierAccount,
  } = req.body;

  // Validate incoming data
  if (!date || !to_account) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql =
    "INSERT INTO payment (date, from_account, to_account, comment, prev_balance, amounr,added_by,mobile_no,cash,online,discount,supplier_bank_account) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
  const values = [
    date,
    from_account,
    to_account,
    comment,
    prev_balance,
    amounr,
    added_by,
    mobile_no,
    cash,
    online,
    discount,
    SupplierAccount,
  ];

  query(sql, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.affectedRows === 0) {
        res.status(404).send("payment not inserted");
      } else {
        const sql1 =
          'update account_table set current_balance = ? where account_group = "Supplier" and name = ?';
        const values1 = [amounr, to_account];
        query(sql1, values1).then((results1) => {
          console.log("Results:", results);
          if (results1.affectedRows === 0) {
            res.status(404).send("Account Table not updated");
          }
        });
        res.send(results); // Send all results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

// update payment data
router.put("/updatePayment/:paymentId", async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const { date, from_account, to_account, comment, prev_balance, amounr } =
      req.body;

    // Validate incoming data (optional but recommended)
    if (
      !date ||
      !from_account ||
      !to_account ||
      !comment ||
      !prev_balance ||
      !amounr
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql =
      "UPDATE payment SET date = ?, from_account = ?, to_account = ?, comment = ?, prev_balance = ?, amounr = ? WHERE p_id = ?";
    const values = [
      date,
      from_account,
      to_account,
      comment,
      prev_balance,
      amounr,
      paymentId,
    ];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "payment not found" });
    }

    // Send response
    res
      .status(200)
      .json({ message: "payment updated successfully", data: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
