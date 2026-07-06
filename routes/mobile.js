
const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())



//Fetch driver list Data
router.get("/", function(req, res) {

  let sql = 'SELECT distinct mobile_no FROM account_table where account_group="Customer" ';
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

router.get("/supplier/", function(req, res) {

  let sql = 'SELECT distinct mobile_no FROM account_table where account_group="Supplier" ';
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



router.get("/mobile/:Id", function(req, res) {
    const mobile = req.params.Id;
    let sql = 'SELECT name FROM account_table';
    // let params = [];

    if (mobile) {
        sql += ` WHERE mobile_no = ${mysql.escape(mobile)}`;
      }

    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Mobile not found');
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

 