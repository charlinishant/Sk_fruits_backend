const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

// //Fetch driver list Data
// router.get("/", function(req, res) {
//     const name = req.params.name;
//     let sql = 'SELECT max(bill_id) as num FROM sale_product';
//     // let params = [];

//     query(sql)
//       .then(results => {
//         console.log('Results:', results);

//         if (results.length === 0) {
//           res.status(404).send('account not found');
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
      FROM bill_tracking bt
      WHERE user_id = ? AND status = 'active'
        AND NOT EXISTS (
          SELECT 1 FROM sale_product sp WHERE sp.bill_id = bt.bill_id
        )
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const checkResult = await query(checkSql, [userId]);

    if (checkResult.length > 0) {
      return res.status(200).json({ bill_id: checkResult[0].bill_id });
    }

    // Step 2: Get max bill_id from bill_tracking
    const maxSql = `SELECT MAX(bill_id) AS max_id FROM bill_tracking`;
    const maxResult = await query(maxSql);
    const newBillId = (maxResult[0].max_id || 0) + 1;

    // Step 3: Insert new bill record
    const insertSql = `
      INSERT INTO bill_tracking (user_id, bill_id, status)
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



/*

router.post("/generate-bill-id", async (req, res) => {
  const userId = req.body.user_id;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Valid user_id is required" });
  }

  try {
    // STEP 1: Expire old unused bills (older than 30 minutes)
    const expireSql = `
      UPDATE bill_tracking 
      SET status = 'expired' 
      WHERE status = 'active' 
        AND created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
        AND NOT EXISTS (
          SELECT 1 FROM sale_table WHERE bill_no = bill_id
        )
    `;
    await query(expireSql);

    // STEP 2: Check for expired bills to reuse (lowest number first)
    const reuseSql = `
      SELECT bill_id 
      FROM bill_tracking 
      WHERE status = 'expired' 
      ORDER BY bill_id ASC 
      LIMIT 1
    `;
    const reuseResult = await query(reuseSql);

    // STEP 3: If expired bill found, reuse it
    if (reuseResult.length > 0) {
      const reusedBillId = reuseResult[0].bill_id;
      
      const updateSql = `
        UPDATE bill_tracking 
        SET user_id = ?, status = 'active', created_at = NOW() 
        WHERE bill_id = ?
      `;
      await query(updateSql, [userId, reusedBillId]);
      
      return res.status(200).json({ bill_id: reusedBillId });
    }

    // STEP 4: No expired bills, generate new sequential bill
    const maxSql = `SELECT MAX(bill_id) AS max_id FROM bill_tracking`;
    const maxResult = await query(maxSql);
    const newBillId = (maxResult[0].max_id || 0) + 1;

    const insertSql = `
      INSERT INTO bill_tracking (user_id, bill_id, status) 
      VALUES (?, ?, 'active')
    `;
    await query(insertSql, [userId, newBillId]);

    return res.status(201).json({ bill_id: newBillId });
    
  } catch (err) {
    console.error("Error generating bill ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


*/