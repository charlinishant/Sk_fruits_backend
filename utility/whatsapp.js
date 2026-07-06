const express = require('express');
const router = express.Router();
const { query, app } = require("../dbService/database")
const bodyParser = require('body-parser');
const request = require('request');
const mysql = require('mysql');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.use(bodyParser.json())


router.post('/saleMessage', (req, res) => {

const { campaignName ,mobile_no,userName,orderValue,paid,remaining } = req.body;

  const options = {
    method: 'POST',
    url: 'https://backend.aisensy.com/campaign/t1/api/v2',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2JjMjNiNWY1NGNlNWE2Y2ZlZjViZiIsIm5hbWUiOiJTSyBGcnVpdHMiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjY3YmMyM2E1ZjU0Y2U1YTZjZmVmNWFmIiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE3MTkzODY2ODN9.hYrf5t77LiE-iLONmpC-cjD3X-9uUe2jpJ3IS9OhS38",
      "campaignName": campaignName,
      "destination": "91"+ String(mobile_no),
      "userName": userName,
      "templateParams": [
        String(orderValue),
        String(paid),
        String(remaining)
      ],
      strictSSL: false // Allow self-signed certificates
    //   "source": "New Landing Page - Form",
    //   "tags": [
    //     "new-lead",
    //     "BBA"
    //   ],
    //   "attributes": {
    //     "Grade": "20th",
    //     "Email": "ajaytestemail@gmail.com"
    //   }
    })
  };

  request(options, (error, response) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw new Error(error);
    }
    res.status(200).json({ body: response.body });
  });

});




router.post('/receiptMessage', (req, res) => {

    const { campaignName ,mobile_no,userName,paid,remaining } = req.body;
    
      const options = {
        method: 'POST',
        url: 'https://backend.aisensy.com/campaign/t1/api/v2',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2JjMjNiNWY1NGNlNWE2Y2ZlZjViZiIsIm5hbWUiOiJTSyBGcnVpdHMiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjY3YmMyM2E1ZjU0Y2U1YTZjZmVmNWFmIiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE3MTkzODY2ODN9.hYrf5t77LiE-iLONmpC-cjD3X-9uUe2jpJ3IS9OhS38",
          "campaignName": campaignName,
          "destination": "91"+ String(mobile_no),
          "userName": userName,
          "templateParams": [
            String(userName),
            String(paid),
            String(remaining)
          ],
          strictSSL: false // Allow self-signed certificates
        //   "source": "New Landing Page - Form",
        //   "tags": [
        //     "new-lead",
        //     "BBA"
        //   ],
        //   "attributes": {
        //     "Grade": "20th",
        //     "Email": "ajaytestemail@gmail.com"
        //   }
        })
      };
    
      request(options, (error, response) => {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
          throw new Error(error);
        }
        res.status(200).json({ body: response.body });
      });
    
    });
    




router.post('/remainderMessage', (req, res) => {

    const { campaignName ,mobile_no,userName,remainderDate,remaining } = req.body;
    
      const options = {
        method: 'POST',
        url: 'https://backend.aisensy.com/campaign/t1/api/v2',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2JjMjNiNWY1NGNlNWE2Y2ZlZjViZiIsIm5hbWUiOiJTSyBGcnVpdHMiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjY3YmMyM2E1ZjU0Y2U1YTZjZmVmNWFmIiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE3MTkzODY2ODN9.hYrf5t77LiE-iLONmpC-cjD3X-9uUe2jpJ3IS9OhS38",
          "campaignName": campaignName,
          "destination": "91"+ String(mobile_no),
          "userName": userName,
          "templateParams": [
            String(userName),
            String(remainderDate),
            String(remaining)
          ],
          strictSSL: false // Allow self-signed certificates
        //   "source": "New Landing Page - Form",
        //   "tags": [
        //     "new-lead",
        //     "BBA"
        //   ],
        //   "attributes": {
        //     "Grade": "20th",
        //     "Email": "ajaytestemail@gmail.com"
        //   }
        })
      };
    
      request(options, (error, response) => {
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
          throw new Error(error);
        }
        res.status(200).json({ body: response.body });
      });
    
    });
    



module.exports = router;
