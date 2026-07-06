
const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())


router.post("/sale", function (req, res) {
  const { date, route, added_by } = req.body;

  let sql = `
    SELECT 
      at.name, 
      COUNT(CASE 
        WHEN st.date = ? ${added_by !== "*" ? "AND st.added_by = ?" : ""} 
        THEN st.bill_no 
      END) AS BillCount, 
      at.route_detail
    FROM 
      account_table at 
    LEFT JOIN 
      sale_table st 
    ON 
      at.name = st.cust_name 
    WHERE 
      account_group = "Customer"
  `;
  
  let groupby = " GROUP BY at.name, at.route_detail ORDER BY BillCount DESC";
  let values = [date]; // Initialize with date

  if (added_by !== "*") {
    values.push(added_by); // Add `added_by` value if it's not "*"
  }
  
  if (route && route!='All root') {
    sql += " AND at.route_detail = ? ";
    values.push(route);
  }

  console.log(sql, values);

  query(sql + groupby, values)
    .then((results) => {
      console.log("Results:", results);

      if (results.length === 0) {
        res.status(404).send("Data not found");
      } else {
        const data = {
          reports: results,
        };
        res.send(data); // Send all results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});




  



module.exports = router;

 