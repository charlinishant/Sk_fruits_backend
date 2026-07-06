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


//Fetch category Data
router.get("/:categoryId?", function(req, res) {
    const categoryId = req.params.categoryId;
    let sql = 'SELECT * FROM category';
    // let params = [];

    if (categoryId) {
        sql += ` WHERE id = ${mysql.escape(categoryId)}`;
      }

  
    query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.length === 0) {
          res.status(404).send('category not found');
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

// Delete catagory data
router.delete("/deletecategoryId/:categoryId?", (req, res) => {
  const categoryId = req.params.categoryId;
  var sql = 'DELETE FROM category';
  
  if (!categoryId) {
    return res.status(400).send('Invalid category ID');
  } else{
    sql += ` WHERE id = ${mysql.escape(categoryId)}`; 
  }
  
  query(sql)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('categoryId not found');
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
  
/// Add payments data
router.post("/insertcategory", async (req, res) => {
  // Get THe data from request body
  const {name} = req.body;
  
  // Validate incoming data 
  if (!name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert data into the database
  const sql = 'INSERT INTO category (name) VALUES (?)';
  const values = [name];

  query(sql, values)
      .then(results => {
        console.log('Results:', results);
        
        if (results.affectedRows === 0) {
          res.status(404).send('category not inserted');
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
  
// update category data
router.put("/updateCategory/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const {name} = req.body;

    // Validate incoming data (optional but recommended)
    if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update data in the database
    const sql = 'UPDATE category SET name = ? WHERE id = ?';
    const values = [name, categoryId];
    const result = await query(sql, values);

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "category not found" });
    }

    // Send response
    res.status(200).json({ message: "category updated successfully", data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;