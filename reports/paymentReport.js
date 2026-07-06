const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

// sample Input
// {
//     "from_date" : "2000-01-01",
//     "to_date" : "2000-12-31"
//   }

//Fetch purchase Data
router.post("/", async (req, res) => {
  // Get THe data from request body
  const { from_date, to_date } = req.body;

  // Validate incoming data
  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "SELECT p_id,date,from_account,to_account,comment,amounr FROM payment  ";
  var where = " where date between ?  and ? ";
  var values = [from_date, to_date];

  query(sql + where, values)
    .then((results) => {
      if (results.affectedRows === 0) {
        res.status(404).send("No Report Found");
      } else {
        const data = { reports: results };
        res.send(data); // Send all results
        // Do something with the results
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response to the client
    });
});

module.exports = router;
