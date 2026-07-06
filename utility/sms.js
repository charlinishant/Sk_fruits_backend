const express = require('express');
const router = express.Router();
const { query, app } = require("../dbService/database")
const bodyParser = require('body-parser');
const request = require('request');
const mysql = require('mysql');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.use(bodyParser.json())


router.post('/saleMessage', (req, res) => {

const { mobile_no,orderValue,paid,remaining } = req.body;

  const options = {
    method: 'POST',
    url: 'https://www.fast2sms.com/dev/bulkV2',
    headers: {
      'authorization': 'gCc0PStxnhsAz0tktvMM42I6iAN6KDsrLRcAk4OyYStJDDnsCOS3cot3F3cP',
      'Content-Type': 'application/json',
      'Cookie': 'XSRF-TOKEN=eyJpdiI6Ik9xbnhMb2N5K3B1VnpYU21cLzRLOUlRPT0iLCJ2YWx1ZSI6IkdIbWNuTUJGNVRneWNrWFZlR3FmQ3Jrckd2Mk0yOGtpS0ROMW51bHptWUlOTlVmZ3B1TnpyeUdXZmc5VzEraDBrYmN0Qk9XYkFuZ0hJZXJjRDNCZmFBPT0iLCJtYWMiOiI3YzI4MmMyZmY4Y2E4YzI4YjBkNzE1ZTExODRhM2RhOGQzMmM5ZWNlMjIxZjA2MjA1N2RhNTM0YmNlYmNkOTk1In0%3D; laravel_session=eyJpdiI6IkVuMVVEYjRhbUVEU2k3M2E4ZTRYVmc9PSIsInZhbHVlIjoiQm5YQXNhRllGOTB5VnhkVUsxWVNaY1BtTFFDeUUrRGVmR3k1MnRYVHYwYytIcDdzOVhFekcwaGdsTEVhQ2NMZ3pkeDdCVks5NmhyUjQxSXZ2eVpDVWc9PSIsIm1hYyI6ImVkMjdiMzgzNmY4NWYyOTk5MDA0Y2Y1MDU0YTBjMzI3ZWRkYWJiMDVmM2I5MTQ0MDM5MGI1M2JlYjU0ZWYyNGEifQ%3D%3D; prZynODZke93z0KsVAzz6xgynaAcUHK8DFuWqeTa=eyJpdiI6ImxmNWMrdVE5MkhFM3lsaUxUNndoXC9RPT0iLCJ2YWx1ZSI6Ino2MU5GQVR1aEZaTG5HMVExS0lnYlk5XC9cL3JPRWthWXZvTUlLVjB5M3FzeUlVTUcwS1E5eE5WdU9TT09RREZMYVVrc1NOZjk0SWkzWVZyTkRTejQyYzNYWVhqZjhKVjRRTUJ5NWVORmY3VllFVTEwSUpLT1lmUXRUemVjZ0pXcEdcL2QwY2UxVWtqc1JTRHp2enV3cEZtaWUyWmdyU3E0alwvWm94WWZtOCtqUDhVaHo2SDJSaFF3RFlPaWVLb050TmhBNzhWREttTzIyb0dRaTJ3ZEtPTDdzR0JwM2MxMzhQSkRMMXlVUlBYMUNSMUpuYmh6ZmhCYU1ZVGxHKzd4YVJBWnIybWlvWkFySnQ0UjdtaURQc2tyQVp2a3lhXC9CWHV6QXJ2c2g5SzVLSGphek1lUE5YVSs3bnhIWm5mbFJRWStTSEUwN1hXbFZOczNXb3FyVlNNTnowTFBtNWhnTTdaWTBPOXpCXC9LazhJdGZSdUhkV1B4N0piSVkwSElNRFFYSk5KaTFNRXFXMWZ1WlVIandFOEYyOVwvMEordXpzU3Zuc3MrclNtOGNCUUhnSlRUTGorRFBcL1JmMGl4eE5RQ0tuRyIsIm1hYyI6ImYxMzJkNDRiNzA5NjczMTUxMjE3YjE3NDJhZjA0OWEzMmYyOWQxNTk5ZTk4ZjA5YjdhYzllZTNiZjhkZWYyNTIifQ%3D%3D'
    },
    body: JSON.stringify({
      route: "dlt",
      sender_id: "SKFRUT",
      message: "170247",
      //"sender_id" : "SKFRUT",
      // "message" : "170247",
      variables_values: String(orderValue) + "|" +String(paid) + "|" + String(remaining),
      flash: 0,
      numbers: mobile_no,
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

  const { mobile_no,cash,online,remaining } = req.body;

  const options = {
    method: 'POST',
    url: 'https://www.fast2sms.com/dev/bulkV2',
    headers: {
      'authorization': 'gCc0PStxnhsAz0tktvMM42I6iAN6KDsrLRcAk4OyYStJDDnsCOS3cot3F3cP',
      'Content-Type': 'application/json',
      'Cookie': 'XSRF-TOKEN=eyJpdiI6Ik9xbnhMb2N5K3B1VnpYU21cLzRLOUlRPT0iLCJ2YWx1ZSI6IkdIbWNuTUJGNVRneWNrWFZlR3FmQ3Jrckd2Mk0yOGtpS0ROMW51bHptWUlOTlVmZ3B1TnpyeUdXZmc5VzEraDBrYmN0Qk9XYkFuZ0hJZXJjRDNCZmFBPT0iLCJtYWMiOiI3YzI4MmMyZmY4Y2E4YzI4YjBkNzE1ZTExODRhM2RhOGQzMmM5ZWNlMjIxZjA2MjA1N2RhNTM0YmNlYmNkOTk1In0%3D; laravel_session=eyJpdiI6IkVuMVVEYjRhbUVEU2k3M2E4ZTRYVmc9PSIsInZhbHVlIjoiQm5YQXNhRllGOTB5VnhkVUsxWVNaY1BtTFFDeUUrRGVmR3k1MnRYVHYwYytIcDdzOVhFekcwaGdsTEVhQ2NMZ3pkeDdCVks5NmhyUjQxSXZ2eVpDVWc9PSIsIm1hYyI6ImVkMjdiMzgzNmY4NWYyOTk5MDA0Y2Y1MDU0YTBjMzI3ZWRkYWJiMDVmM2I5MTQ0MDM5MGI1M2JlYjU0ZWYyNGEifQ%3D%3D; prZynODZke93z0KsVAzz6xgynaAcUHK8DFuWqeTa=eyJpdiI6ImxmNWMrdVE5MkhFM3lsaUxUNndoXC9RPT0iLCJ2YWx1ZSI6Ino2MU5GQVR1aEZaTG5HMVExS0lnYlk5XC9cL3JPRWthWXZvTUlLVjB5M3FzeUlVTUcwS1E5eE5WdU9TT09RREZMYVVrc1NOZjk0SWkzWVZyTkRTejQyYzNYWVhqZjhKVjRRTUJ5NWVORmY3VllFVTEwSUpLT1lmUXRUemVjZ0pXcEdcL2QwY2UxVWtqc1JTRHp2enV3cEZtaWUyWmdyU3E0alwvWm94WWZtOCtqUDhVaHo2SDJSaFF3RFlPaWVLb050TmhBNzhWREttTzIyb0dRaTJ3ZEtPTDdzR0JwM2MxMzhQSkRMMXlVUlBYMUNSMUpuYmh6ZmhCYU1ZVGxHKzd4YVJBWnIybWlvWkFySnQ0UjdtaURQc2tyQVp2a3lhXC9CWHV6QXJ2c2g5SzVLSGphek1lUE5YVSs3bnhIWm5mbFJRWStTSEUwN1hXbFZOczNXb3FyVlNNTnowTFBtNWhnTTdaWTBPOXpCXC9LazhJdGZSdUhkV1B4N0piSVkwSElNRFFYSk5KaTFNRXFXMWZ1WlVIandFOEYyOVwvMEordXpzU3Zuc3MrclNtOGNCUUhnSlRUTGorRFBcL1JmMGl4eE5RQ0tuRyIsIm1hYyI6ImYxMzJkNDRiNzA5NjczMTUxMjE3YjE3NDJhZjA0OWEzMmYyOWQxNTk5ZTk4ZjA5YjdhYzllZTNiZjhkZWYyNTIifQ%3D%3D'
    },
    body: JSON.stringify({
      route: "dlt",
      sender_id: "SK7512",
      message: "170246",
      //"sender_id" : "SKFRUT",
      // "message" : "170247",
      variables_values: String(cash) + "|" +String(online) + "|" + String(remaining),
      flash: 0,
      numbers: mobile_no,
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

  const { mobile_no,name,date,remaining } = req.body;

  const options = {
    method: 'POST',
    url: 'https://www.fast2sms.com/dev/bulkV2',
    headers: {
      'authorization': 'gCc0PStxnhsAz0tktvMM42I6iAN6KDsrLRcAk4OyYStJDDnsCOS3cot3F3cP',
      'Content-Type': 'application/json',
      'Cookie': 'XSRF-TOKEN=eyJpdiI6Ik9xbnhMb2N5K3B1VnpYU21cLzRLOUlRPT0iLCJ2YWx1ZSI6IkdIbWNuTUJGNVRneWNrWFZlR3FmQ3Jrckd2Mk0yOGtpS0ROMW51bHptWUlOTlVmZ3B1TnpyeUdXZmc5VzEraDBrYmN0Qk9XYkFuZ0hJZXJjRDNCZmFBPT0iLCJtYWMiOiI3YzI4MmMyZmY4Y2E4YzI4YjBkNzE1ZTExODRhM2RhOGQzMmM5ZWNlMjIxZjA2MjA1N2RhNTM0YmNlYmNkOTk1In0%3D; laravel_session=eyJpdiI6IkVuMVVEYjRhbUVEU2k3M2E4ZTRYVmc9PSIsInZhbHVlIjoiQm5YQXNhRllGOTB5VnhkVUsxWVNaY1BtTFFDeUUrRGVmR3k1MnRYVHYwYytIcDdzOVhFekcwaGdsTEVhQ2NMZ3pkeDdCVks5NmhyUjQxSXZ2eVpDVWc9PSIsIm1hYyI6ImVkMjdiMzgzNmY4NWYyOTk5MDA0Y2Y1MDU0YTBjMzI3ZWRkYWJiMDVmM2I5MTQ0MDM5MGI1M2JlYjU0ZWYyNGEifQ%3D%3D; prZynODZke93z0KsVAzz6xgynaAcUHK8DFuWqeTa=eyJpdiI6ImxmNWMrdVE5MkhFM3lsaUxUNndoXC9RPT0iLCJ2YWx1ZSI6Ino2MU5GQVR1aEZaTG5HMVExS0lnYlk5XC9cL3JPRWthWXZvTUlLVjB5M3FzeUlVTUcwS1E5eE5WdU9TT09RREZMYVVrc1NOZjk0SWkzWVZyTkRTejQyYzNYWVhqZjhKVjRRTUJ5NWVORmY3VllFVTEwSUpLT1lmUXRUemVjZ0pXcEdcL2QwY2UxVWtqc1JTRHp2enV3cEZtaWUyWmdyU3E0alwvWm94WWZtOCtqUDhVaHo2SDJSaFF3RFlPaWVLb050TmhBNzhWREttTzIyb0dRaTJ3ZEtPTDdzR0JwM2MxMzhQSkRMMXlVUlBYMUNSMUpuYmh6ZmhCYU1ZVGxHKzd4YVJBWnIybWlvWkFySnQ0UjdtaURQc2tyQVp2a3lhXC9CWHV6QXJ2c2g5SzVLSGphek1lUE5YVSs3bnhIWm5mbFJRWStTSEUwN1hXbFZOczNXb3FyVlNNTnowTFBtNWhnTTdaWTBPOXpCXC9LazhJdGZSdUhkV1B4N0piSVkwSElNRFFYSk5KaTFNRXFXMWZ1WlVIandFOEYyOVwvMEordXpzU3Zuc3MrclNtOGNCUUhnSlRUTGorRFBcL1JmMGl4eE5RQ0tuRyIsIm1hYyI6ImYxMzJkNDRiNzA5NjczMTUxMjE3YjE3NDJhZjA0OWEzMmYyOWQxNTk5ZTk4ZjA5YjdhYzllZTNiZjhkZWYyNTIifQ%3D%3D'
    },
    body: JSON.stringify({
      route: "dlt",
      sender_id: "SKFRUT",
      message: "170249",
      //"sender_id" : "SKFRUT",
      // "message" : "170247",
      variables_values: String(name) + "|" +String(date) + "|" + String(remaining),
      flash: 0,
      numbers: mobile_no,
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
