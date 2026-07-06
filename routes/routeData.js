const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())

// router.get('/', (req, res) => {
//     res.send('Welcome to the userData!');
// });


//Fetch route Data
router.get("/:routeId?", function(req, res) {
    const routeId = req.params.routeId;
    let sql = 'SELECT * FROM route';
    // let params = [];
  
    if (routeId) {
        sql += ` WHERE id = ${mysql.escape(routeId)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('route not found');
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

// Get routes based on user's access level
router.get("/user-routes/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Get user's route access from user_table
    const userSql = "SELECT route FROM user_table WHERE id = ?";
    const userResult = await query(userSql, [userId]);
    
    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Every logged-in user can choose All Route and view all route information.
    const allRoutesSql = "SELECT * FROM route WHERE is_active = 1";
    const routes = await query(allRoutesSql);
    res.json(routes);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete route data
router.delete("/deleterouteId/:routeId?", (req, res) => {
  const routeId = req.params.routeId;
  var sql = 'DELETE FROM route';
  
  if (!routeId) {
    return res.status(400).send('Invalid route ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(routeId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('route not found');
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
  

// Add route data
router.post("/insertroute", async (req, res) => {
  // Get THe data from request body
  const {route_name, details, mobile_no } = req.body;
  
  // Validate incoming data 
  if (!route_name || !details || !mobile_no ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO route (route_name, details, mobile_no, is_active) VALUES (?, ?, ?, ?)';
  const values = [route_name ,details,mobile_no ,1];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('route not inserted');
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


// update route data
router.put("/updateRoute/:routeId", async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const { route_name ,details,mobile_no } = req.body;

    // Validate incoming data (optional but recommended)
    if (!route_name || !details || !mobile_no ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE route SET route_name = ?, details = ?, mobile_no = ?, is_active = ? WHERE id = ?';
    const values = [route_name ,details,mobile_no ,1 , routeId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "route not found" });
    }

    // Send response
    res.status(200).json({ message: "Route updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
