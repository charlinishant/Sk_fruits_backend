const express = require('express');
const router = express.Router();
const { query } = require("../dbService/database")
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.json())
// router.get('/', (req, res) => {
//     res.send('Welcome to the userData!');
// });

// router.get("/", function(req, res) {  
//     query('SELECT * FROM user_table',params)
//     .then(results => {
//           console.log('Results in .then():', results);
//           res.send(results)
//           // Do something with the results
//       })
//       .catch(error => {
//           console.error('Error in .then():', error);
//       });
//     });


//Fetch carateuser Data
router.get("/:carateuserId?", function(req, res) {
    const carateuserId = req.params.carateuserId;
    let sql = 'SELECT sum(carate_100) "carate_100",sum(carate_150) "carate_150",sum(carate_250) "carate_250",sum(carate_350) "carate_350"  FROM carate_user';
    // let params = [];

    if (carateuserId) {
        sql += ` WHERE user_id = ${mysql.escape(carateuserId)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('carateuserId not found');
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

router.get("/route/:carateuserId?", function(req, res) {
    const carateuserId = req.params.carateuserId;
    let sql = 'SELECT sum(carate_100) "carate_100",sum(carate_150) "carate_150",sum(carate_250) "carate_250",sum(carate_350) "carate_350"  FROM carate_user';
    // let params = [];

    if (carateuserId) {
        sql += ` WHERE user_id in (select distinct name from account_table where route_detail= ${mysql.escape(carateuserId)})`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('carateuserId not found');
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




// Delete carateuser data
router.delete("/deletecarateuserId/:carateuserId?", (req, res) => {
  const carateuserId = req.params.carateuserId;
  var sql = 'DELETE FROM carate_user';
  
  if (!carateuserId) {
    return res.status(400).send('Invalid carateuser ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(carateuserId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('carateuserId not found');
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
  
// Add carateuser data
router.post("/insertcarateuser", async (req, res) => {
  // Get THe data from request body
  const {userName,carate_100 ,carate_150 ,carate_250 ,carate_350 } = req.body;
  
  // Validate incoming data 
  // if (!carate_100 || !carate_150 || !carate_250 || !carate_350 ) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // }

  // Insert data into the database
  const sql = 'INSERT INTO carate_user (user_id, carate_100 ,carate_150 ,carate_250 ,carate_350 ) VALUES (?, ?, ?, ?, ?)';
  const values = [userName,carate_100 ,carate_150 ,carate_250 ,carate_350];
  console.log(values)
  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('carateuser not inserted');
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
  
// update carateuser data
router.put("/updateCarateuser/:carateuserId", async (req, res) => {
  try {
    const carateuserId = req.params.carateuserId;
    const {carate_100 ,carate_150 ,carate_250 ,carate_350  } = req.body;

    // Validate incoming data (optional but recommended)
    // if (!carate_100 || !carate_150 || !carate_250 || !carate_350 ) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }

    // Update data in the database
    const sql = 'UPDATE carate_user SET carate_100 = ?, carate_150 = ?, carate_250 = ?, carate_350= ? WHERE user_id = ?';
    const values = [carate_100 ,carate_150 ,carate_250 ,carate_350 , carateuserId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "carateuser not found" });
    }

    // Send response
    res.status(200).json({ message: "carateUser updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;