const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())


router.get("/:bill_id?", function(req, res) {
    const bill_id = req.params.bill_id;
    let sql = 'SELECT date,cust_name,st.mobile_no,st.address,carate_amount,amount,pre_balance,total_amount,cash,online_acc,online_amt,discount,inCarat,balance,in_carate_100,in_carate_150, in_carate_250, in_carate_350, out_carate_100, out_carate_150, out_carate_250, out_carate_350,carate_100, carate_150, carate_250, carate_350,cr_dr_type,baki_100,baki_150,baki_250,baki_350,st.created_at,comment FROM sale_table st join carate_user cu on(st.cust_name = cu.user_id) join account_table at on(cu.user_id = at.name)  ';
    // let params = [];

    if (bill_id) {
        sql += ` WHERE bill_no = ${mysql.escape(bill_id)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('Bill not found');
        } else {

            let sql1 = 'select bata,mark,product,quantity,rate,price FROM sale_product  where bill_id = ?';
            const values1 = [bill_id];

            query(sql1, values1)
            .then(results1 => {
              if (results1.affectedRows === 0) {
                res.status(404).send('Account Table not updated');
              } 

              res.send({results , 'products': results1});

           })
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response to the client
      });
  });



module.exports = router;

 