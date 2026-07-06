const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())
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


//Fetch caratebill Data
router.get("/:caratebillId?", function(req, res) {
    const caratebillId = req.params.caratebillId;
    let sql = 'SELECT * FROM carate_bill';
    // let params = [];

    if (caratebillId) {
        sql += ` WHERE id = ${mysql.escape(caratebillId)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('caratebillId not found');
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

// Delete caratebill data
router.delete("/deletecaratebillId/:caratebillId?", (req, res) => {
  const caratebillId = req.params.caratebillId;
  var sql = 'DELETE FROM carate_bill';
  
  if (!caratebillId) {
    return res.status(400).send('Invalid caratebill ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(caratebillId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('caratebill not found');
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
  
// Add caratebill data
router.post("/insertcaratebill", async (req, res) => {
  // Get THe data from request body
  const {bill_id, user_id, carate_100, carate_150, carate_250, carate_350 } = req.body;
  
  // Validate incoming data 
  if (!bill_id || !user_id || !carate_100 || !carate_150 || !carate_250 || !carate_350 ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO carate_bill (bill_id, user_id, carate_100, carate_150, carate_250, carate_350 ) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [bill_id, user_id, carate_100, carate_150, carate_250, carate_350 ];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('purchase not inserted');
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
  
// update caratebill data
router.put("/updateCaratebill/:caratebillId", async (req, res) => {
  try {
    const caratebillId = req.params.caratebillId;
    const {bill_id, user_id, carate_100, carate_150, carate_250, carate_350 } = req.body;

    // Validate incoming data (optional but recommended)
    if (!bill_id || !user_id || !carate_100 || !carate_150 || !carate_250 || !carate_350 ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE carate_bill SET bill_id = ?, user_id = ?, carate_100 = ?, carate_150 = ?, carate_250 = ?, carate_350 = ? WHERE id = ?';
    const values = [bill_id, user_id, carate_100, carate_150, carate_250, carate_350 , caratebillId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "caratebill not found" });
    }

    // Send response
    res.status(200).json({ message: "caratebill updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
 




module.exports = router;