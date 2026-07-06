const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())


//Fetch accountgroup Data
router.get("/:accountgroupId?", function(req, res) {
    const accountgroupId = req.params.accountgroupId;
    let sql = 'SELECT * FROM account_group_table';
    // let params = [];

    if (accountgroupId) {
        sql += ` WHERE id = ${mysql.escape(accountgroupId)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('accountgroupId not found');
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

// Delete account group data
router.delete("/deleteaccountgroupId/:accountgroupId?", (req, res) => {
  const accountgroupId = req.params.accountgroupId;
  var sql = 'DELETE FROM account_group_table';
  
  if (!accountgroupId) {
    return res.status(400).send('Invalid account group ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(accountgroupId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('accountgroupId not found');
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
  
// Add purchase data
router.post("/insertaccountgroup", async (req, res) => {
  // Get THe data from request body
  const {name,is_active} = req.body;
  
  // Validate incoming data 
  if (!name || !is_active) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO account_group_table (name ,is_active) VALUES (?, ?)';
  const values = [name ,is_active];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('account grp  not inserted');
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
  
// update account grp data
router.put("/updateAccountgrp/:accountgroupId", async (req, res) => {
  try {
    const accountgroupId = req.params.accountgroupId;
    const { name ,is_active} = req.body;

    // Validate incoming data (optional but recommended)
    if (!name || !is_active) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE account_group_table SET name = ?, is_active = ? WHERE id = ?';
    const values = [name ,is_active, accountgroupId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "accountgroupdata not found" });
    }

    // Send response
    res.status(200).json({ message: "accountgroupdata updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;