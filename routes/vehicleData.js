const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())

//Fetch vehicle Data
router.get("/:vehicleId?", function(req, res) {
    // const vehicleId = req.params.vehicleId;
    // let sql = 'SELECT * FROM vehicle';
    // let params = [];

    // if (vehicleId) {
    //     sql += ` WHERE id = ${mysql.escape(vehicleId)}`;
    //   }

    // let sql = 'SELECT distinct gadi_number as vehicle_no FROM purchase';
    let sql = 
    `SELECT DISTINCT gadi_number AS vehicle_no 
      FROM purchase 
      UNION 
      SELECT 'DUMMY-1429' AS vehicle_no 
      WHERE NOT EXISTS (SELECT 1 FROM purchase);`
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('vehicleId not found');
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


// Delete Vehicle data
router.delete("/deleteVehicle/:vehicleId?", (req, res) => {
  const vehicleId = req.params.vehicleId;
  var sql = 'DELETE FROM vehicle';
  
  if (!vehicleId) {
    return res.status(400).send('Invalid Vehicle ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(vehicleId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('vehicle not inserted');
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
  
// Add Vehicle data
router.post("/insertVehicle", async (req, res) => {
  // Get THe data from request body
  const { name, vehicle_no, is_active} = req.body;
  
  // Validate incoming data 
  if (!name || !vehicle_no || !is_active) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO vehicle ( name, vehicle_no, is_active) VALUES (?, ?, ?)';
  const values = [name, vehicle_no, is_active];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('vehicle not inserted');
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
  
// update vehicle data
router.put("/updateVehicle/:vehicleId", async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const { name, vehicle_no, is_active } = req.body;

    // Validate incoming data (optional but recommended)
    if (!name || !vehicle_no || !is_active) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE vehicle SET  name = ?, vehicle_no = ?, is_active = ? WHERE id = ?';
    const values = [ name, vehicle_no, is_active, vehicleId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "vehicle not found" });
    }

    // Send response
    res.status(200).json({ message: "vehicle updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;