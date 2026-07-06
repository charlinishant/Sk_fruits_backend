const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const { query, app } = require("../dbService/database")
const bodyParser = require('body-parser');
const mysql = require('mysql');

router.use(bodyParser.json())


//Fetch driverroute  Data
router.get("/:driverrouteDataId?", function(req, res) {
    const driverrouteDataId = req.params.driverrouteDataId;
    let sql = 'SELECT * FROM driverRoute';
    // let params = [];

    if (driverrouteDataId) {
        sql += ` WHERE id = ${mysql.escape(driverrouteDataId)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('driverroute not found');
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



// Delete driverroute data
router.delete("/deletedriverrouteDataId/:driverrouteDataId?", (req, res) => {
  const driverrouteDataId = req.params.driverrouteDataId;
  var sql = 'DELETE FROM driverRoute';
  
  if (!driverrouteDataId) {
    return res.status(400).send('Invalid driverrouteData ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(driverrouteDataId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('driverroute not found');
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


// Add driverRoutr data
router.post("/insertdriverroute", async (req, res) => {
  // Get THe data from request body
  const { id, driver_name, route ,trip_date, vehicle_no} = req.body;
  
  // Validate incoming data 
  if (!driver_name || !route || !trip_date || !vehicle_no) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO driverRoute ( id, driver_name, route ,trip_date, vehicle_no) VALUES (?, ?, ?, ?, ?)';
  const values = [ id, driver_name, route ,trip_date, vehicle_no];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('driverRoute not inserted');
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
  

// update driverRoute data
router.put("/updatedriverRoute/:driverrouteDataId", async (req, res) => {
  try {
    const driverrouteDataId = req.params.driverrouteDataId;
    const {id, driver_name, route ,trip_date, vehicle_no} = req.body;

    // Validate incoming data (optional but recommended)
    if (!driver_name || !route || !trip_date || !vehicle_no) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE driverRoute SET id = ?, driver_name = ?, route = ?, trip_date = ?, vehicle_no = ? WHERE id = ?';
    const values = [id, driver_name, route ,trip_date, vehicle_no, driverrouteDataId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "driverrouteDataId not found" });
    }

    // Send response
    res.status(200).json({ message: "driverrouteDataId updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;