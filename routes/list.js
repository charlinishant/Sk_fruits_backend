
const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())


//Fetch driver list Data
router.get("/:name?", function(req, res) {
    const name = req.params.name;
    let sql = 'SELECT name,route_detail FROM account_table';
    // let params = [];

    if (name) {
        sql += ` WHERE account_group = ${mysql.escape(name)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('account not found');
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



//Fetch driver list Data
router.get("/mobile", function(req, res) {

  let sql = 'SELECT distinct mobile_no FROM account_table';
  // let params = [];

  query(sql)
    .then(results => {
      console.log('Results:', results);
      
      if (results.length === 0) {
        res.status(404).send('account not found');
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


module.exports = router;

 