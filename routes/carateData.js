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


//Fetch carate Data
router.get("/:carateId?", function(req, res) {
    const carateId = req.params.carateId;
    let sql = 'SELECT * FROM carates';
    // let params = [];

    if (carateId) {
        sql += ` WHERE id = ${mysql.escape(carateId)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('category not found');
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

// Delete Carate data
router.delete("/deletecarateId/:carateId?", (req, res) => {
  const carateId = req.params.carateId;
  var sql = 'DELETE FROM carates';
  
  if (!carateId) {
    return res.status(400).send('Invalid Carate ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(carateId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('carate not found');
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
  
// Add carate data
router.post("/insertcarate", async (req, res) => {
  // Get THe data from request body
  const {carates} = req.body;
  
  // Validate incoming data 
  if (!carates) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO carates (carates) VALUES (?)';
  const values = [carates];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('carates not inserted');
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
  
// update carate data
router.put("/updateCarate/:carateId", async (req, res) => {
  try {
    const carateId = req.params.carateId;
    const {carates} = req.body;

    // Validate incoming data (optional but recommended)
    if (!carates) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE carates SET carates = ? WHERE id = ?';
    const values = [carates, carateId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "carates not found" });
    }

    // Send response
    res.status(200).json({ message: "carates updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;