
const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())




router.get("/mobile/:Id", function(req, res) {
    const mobile = req.params.Id;
    let sql = 'SELECT name,route_detail,address FROM account_table where account_group in ("Customer","Supplier") ';
    // let params = [];

    if (mobile) {
        sql += ` and mobile_no = ${mysql.escape(mobile)}`;
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



router.get("/name/:Id", function(req, res) {
    const name = req.params.Id;
    let sql = 'SELECT mobile_no,route_detail,address FROM account_table where account_group in ("Customer","Supplier") ';
    // let sql = 'SELECT mobile_no,route_detail,address FROM account_table where account_group = "Customer"';
    // let params = [];

    if (name) {
        sql += ` and name = ${mysql.escape(name)}`;
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

 