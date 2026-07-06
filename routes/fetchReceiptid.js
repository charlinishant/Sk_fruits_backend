
const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())


//Fetch driver list Data
// router.get("/", function(req, res) {
//     const name = req.params.name;
//     let sql = 'SELECT max(receipt_id) as num FROM receipt';
//     // let params = [];
  
//     query(sql)
//       .then(results => {
//         console.log('Results:', results);
        
//         if (results.length === 0) {
//           res.status(404).send('Receipt not found');
//         } else {
//           res.send(results); // Send all results
//           // Do something with the results
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error'); // Send an error response to the client
//       });
//   });


router.post("/generate-bill-id", async (req, res) => {
  const userId = req.body.user_id;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Valid user_id is required" });
  }

  try {
    // Step 1: Check if there's an active unused bill_id
    const checkSql = `
      SELECT bill_id
      FROM bill_tracking_receipt bt
      WHERE user_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const checkResult = await query(checkSql, [userId]);

    if (checkResult.length > 0) {
      return res.status(200).json({ bill_id: checkResult[0].bill_id });
    }

    // Step 2: Get max bill_id from bill_tracking
    const maxSql = `SELECT MAX(bill_id) AS max_id FROM bill_tracking_receipt`;
    const maxResult = await query(maxSql);
    const newBillId = (maxResult[0].max_id || 0) + 1;

    // Step 3: Insert new bill record
    const insertSql = `
      INSERT INTO bill_tracking_receipt (user_id, bill_id, status)
      VALUES (?, ?, 'active')
    `;
    await query(insertSql, [userId, newBillId]);

    return res.status(201).json({ bill_id: newBillId });
  } catch (err) {
    console.error("Error generating bill ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
