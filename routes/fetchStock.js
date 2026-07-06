
const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())




router.get("/:Id", function(req, res) {
    const bata = req.params.Id;
    let sql = `
      SELECT s.closing, pp.unit 
      FROM stock s
      JOIN purchase_product pp ON s.bata = pp.bata
      WHERE s.Bata = ${mysql.escape(bata)}
      ORDER BY s.date DESC, s.id DESC
      LIMIT 1
    `;

    query(sql)
      .then(results => {
        console.log('Fetch Stock Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Bata not found');
        } else {
          res.send(results);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      });
  });



module.exports = router;

 