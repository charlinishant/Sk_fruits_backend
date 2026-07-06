const express = require('express');
const router = express.Router();
const cors = require('cors');
const { query, app } = require("../dbService/database")
const bodyParser = require('body-parser');
const mysql = require('mysql');

router.use(bodyParser.json())
//Fetch User Data
router.get("/:userId?", function(req, res) {
    const userId = req.params.userId;
    let sql = 'SELECT user.id,user.route"route",account.name,address,mobile_no,username,password,status,usertype FROM user_table user join account_table account on(user.name=account.name)';
    // let params = [];

    if (userId) {
        sql += ` WHERE user.id = ${mysql.escape(userId)}`;
      }


    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('User not found');
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



// Delete User data
router.delete("/deleteUser/:userId?", (req, res) => {
  const userId = req.params.userId;
  var sql = 'DELETE FROM user_table';
  
  if (!userId) {
    return res.status(400).send('Invalid user ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(userId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('User not found');
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



// Add User data
router.post("/insertUser", async (req, res) => {
  // Get THe data from request body
  const { usertype, name, route,username,password,status} = req.body;
  console.log(usertype);
  console.log(name);
  console.log(username);
  console.log(password);
  console.log(status);
  // Validate incoming data 
  if (!usertype || !name || !password || !status || !username || !route) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO user_table (usertype, name, route,password, status, username) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [usertype, name, route, password, status, username
  ];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('User not inserted');
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
  

// update User data
router.put("/updateUser/:userId",cors({ origin: '*' }) ,async (req, res) => {
  try {
    const userId = req.params.userId;
    const { usertype, name, route,username,password, status } = req.body;

    // Validate incoming data (optional but recommended)
    if (!usertype || !name || !password || !status || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE user_table SET usertype = ?, name = ?, route = ?,username = ?,password = ?, status = ? WHERE id = ?';
    const values = [usertype, name, route,username,password, status, userId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      console.log(result)
      return res.status(404).json({ message: "User not found" });
    }

    // Send response
    res.status(200).json({ message: "User updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;