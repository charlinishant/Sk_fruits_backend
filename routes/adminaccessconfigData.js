const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())


//Fetch accessconfiData Data
router.get("/", function(req, res) {
    let sql = 'SELECT id,name,status FROM admin_access_config  order by id asc';
    // let params = [];

    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('accessconfiDataId not found');
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





// Delete accessconfig data
router.delete("/deleteaccessconfiDataId/:accessconfiDataId?", (req, res) => {
  const accessconfiDataId = req.params.accessconfiDataId;
  var sql = 'DELETE FROM admin_access_config';
  
  if (!accessconfiDataId) {
    return res.status(400).send('Invalid accessconfig ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(accessconfiDataId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('accessconfi not found');
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
router.post("/insertaccessconfig", async (req, res) => {
  // Get THe data from request body
  const {name , status} = req.body;
  
  // Validate incoming data 
  if (!name || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO admin_access_config (name , status) VALUES (?, ?)';
  const values = [name , status];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('access config not inserted');
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
  



// update accessconfi data
router.put("/updateAccessconfig", async (req, res) => {
  try {
    const { name } = req.body;
    console.log("API Call")
    // Validate incoming data (optional but recommended)
    if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = "UPDATE admin_access_config SET status = CASE WHEN name IN (?) THEN 'active' ELSE 'inactive' END ";
    const values = [name];
    console.log(name)
    const result = await query(sql, values);
    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "accessconfiData not found" });
    }

    // Send response
    res.status(200).json({ message: "accessconfiData updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;