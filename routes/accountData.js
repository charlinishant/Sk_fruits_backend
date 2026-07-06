const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const mysql = require("mysql");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

//Fetch account Data
router.get("/:accountId?", function (req, res) {
  const accountId = req.params.accountId;
  let sql = "SELECT * FROM account_table";
  // let params = [];

  if (accountId) {
    sql += ` WHERE id = ${mysql.escape(accountId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("account not found");
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

// Delete account data
router.delete("/deleteaccountId/:accountId?", (req, res) => {
  const accountId = req.params.accountId;
  var sql = "DELETE FROM account_table";

  if (!accountId) {
    return res.status(400).send("Invalid account ID");
  } else {
    sql += ` WHERE id = ${mysql.escape(accountId)}`;
  }

  query(sql)
    .then((results) => {
      console.log("Results:", results);

      if (results.affectedRows === 0) {
        res.status(404).send("account not found");
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

// Add purchase data
router.post("/insertaccount", async (req, res) => {
  const {
    name,
    address,
    mobile_no,
    account_group,
    route_detail,
    prev_balance,
    cr_dr_type,
    company,
    optional_mobile,
  } = req.body;

  // Validate required fields
  if (!name || !address || !mobile_no || !account_group || !prev_balance) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 🔍 Step 1: Check if mobile number already exists
    const checkSql = "SELECT id FROM account_table WHERE mobile_no = ?";
    const existing = await query(checkSql, [mobile_no]);

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Mobile number already exists",
      });
    }

    // ➕ Step 2: Insert new record
    const insertSql = `
      INSERT INTO account_table
      (is_ative, name, address, mobile_no, account_group, route_detail,
       prev_balance, current_balance, cr_dr_type, optional_mobile, company)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      1,
      name,
      address,
      mobile_no,
      account_group,
      route_detail,
      prev_balance,
      prev_balance,
      cr_dr_type,
      optional_mobile,
      company,
    ];

    const results = await query(insertSql, values);

    return res.status(201).json({
      message: "Account created successfully",
      id: results.insertId,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// update account data
router.put("/updateAccount/:accountId", async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const {
      name,
      address,
      mobile_no,
      account_group,
      route_detail,
      prev_balance,
      current_balance,
      cr_dr_type,
      company,
      optional_mobile,
    } = req.body;

    // Validate required fields
    if (!name || !address || !mobile_no || !account_group || !prev_balance) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get old name before update
    const getOldNameSql = "SELECT name FROM account_table WHERE id = ?";
    const oldNameResult = await query(getOldNameSql, [accountId]);
    const oldName = oldNameResult[0]?.name;

    // 🔍 Step 1: Check if mobile number exists for another account
    const checkSql = `
      SELECT id 
      FROM account_table 
      WHERE mobile_no = ? AND id != ?
    `;
    const existing = await query(checkSql, [mobile_no, accountId]);

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Mobile number already exists for another account",
      });
    }

    // ✏️ Step 2: Update account
    const updateSql = `
      UPDATE account_table 
      SET is_ative = ?, 
          name = ?, 
          address = ?, 
          mobile_no = ?, 
          account_group = ?, 
          route_detail = ?, 
          prev_balance = ?, 
          current_balance = ?, 
          cr_dr_type = ?, 
          company = ?, 
          optional_mobile = ?
      WHERE id = ?
    `;

    const values = [
      1,
      name,
      address,
      mobile_no,
      account_group,
      route_detail,
      prev_balance,
      current_balance,
      cr_dr_type,
      company,
      optional_mobile,
      accountId,
    ];

    const result = await query(updateSql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    // After successful account update, sync user table name
    if (oldName && oldName !== name) {
      const syncUserSql = 'UPDATE user_table SET name = ? WHERE name = ?';
      await query(syncUserSql, [name, oldName]);
      
      // Update customer_name in ledger table for this account
      const syncLedgerSql = 'UPDATE ledger SET customer_name = ? WHERE account_id = ?';
      await query(syncLedgerSql, [name, accountId]);
      
      console.log('Updated ledger customer_name for account_id:', accountId);
    }

    return res.status(200).json({
      message: "Account updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
