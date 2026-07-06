const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const { query, app } = require("../dbService/database")
const bodyParser = require('body-parser');
const mysql = require('mysql');

router.use(bodyParser.json())


//Fetch outstandingcustomerData Data
router.get("/:outstandingcustomerDataId?", function(req, res) {
    const outstandingcustomerDataId = req.params.outstandingcustomerDataId;
    let sql = 'SELECT * FROM supplier_outstanding';
    // let params = [];

    if (outstandingcustomerDataId) {
        sql += ` WHERE id = ${mysql.escape(outstandingcustomerDataId)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('outstanding customer not found');
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



// Delete outstandingcustomerData data
router.delete("/deleteoutstandingcustomer/:outstandingcustomerDataId?", (req, res) => {
  const outstandingcustomerDataId = req.params.outstandingcustomerDataId;
  var sql = 'DELETE FROM supplier_outstanding';
  
  if (!outstandingcustomerDataId) {
    return res.status(400).send('Invalid user ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(outstandingcustomerDataId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('outstandingcustomerDataId not found');
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



// Add outstandingcustomer data
router.post("/insertoutstandingcustomer", async (req, res) => {
  // Get THe data from request body
  const {supplier_name , remaining_paid} = req.body;
  
  // Validate incoming data 
  if (!supplier_name || !remaining_paid) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO supplier_outstanding (supplier_name , remaining_paid) VALUES (?, ?)';
  const values = [supplier_name , remaining_paid];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('outstandingcoustomer not inserted');
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
  

// update outstanding customer data  
router.put("/updateoutstandingcustomerData/:outstandingcustomerDataId", async (req, res) => {
  try {
    const outstandingcustomerDataId = req.params.outstandingcustomerDataId;
    const {supplier_name , remaining_paid} = req.body;

    // Validate incoming data (optional but recommended)
    if (!supplier_name || !remaining_paid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE supplier_outstanding SET supplier_name = ?, remaining_paid = ? WHERE id = ?';
    const values = [supplier_name , remaining_paid, outstandingcustomerDataId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "outstanding customer not found" });
    }

    // Send response
    res.status(200).json({ message: "outstanding customer updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;