const express = require('express');
const router = express.Router();
const { query, app } = require("../dbService/database")
const bodyParser = require('body-parser');
const mysql = require('mysql');

router.use(bodyParser.json())

//User Login
router.post("/login", function(req, res) {
    const { name, password } = req.body;
    const sql = 'SELECT * FROM user_table where username = ? and password = ? and status in (1,"Super") ';
    var values = [name,password];
    // let params = [];
  
    query(sql,values)
      .then(results => {
        
        if (results.length === 0) {
          res.status(400).send('Invalid userName / Password');
        } else {
            res.status(200).send(results); // Send all results
          // Do something with the results
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });


// Add User data
router.post("/logout", async (req, res) => {
  // The logic for Logout
  
});
  


module.exports = router;