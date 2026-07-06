const express = require("express");
const app = express(); //binds the express module to 'app'
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const fs = require("fs");
const { testConnection } = require("./dbService/database");


const userData = require("./routes/userData");
const productData = require("./routes/productData");

const saleData = require("./routes/saleData");
const accessconfigData = require("./routes/accessconfigData");
const accountData = require("./routes/accountData");
const accountgroupData = require("./routes/accountgroupData");
const caratebillData = require("./routes/caratebillData");
const carateuserData = require("./routes/carateuserData");
const categoryData = require("./routes/categoryData");
const paymentData = require("./routes/paymentData");
const purchaseproductData = require("./routes/purchaseproductData");
const receiptData = require("./routes/receiptData");
const saleproductData = require("./routes/saleproductData");
const vehicleData = require("./routes/vehicleData");
const routeData = require("./routes/routeData");
const purchaseReport = require("./reports/purchaseReport");
const routewiseSaleReport = require("./reports/routewiseSaleReport");
const stockReport = require("./reports/stockReport");
const khatawani = require("./reports/khatawani");
const batawiseSaleReport = require("./reports/batawiseSaleReport");
const dailyReport = require("./reports/dailyReport");
const receiptReport = require("./reports/receiptReport");
const paymentReport = require("./reports/paymentReport");
const customerOutstandingReport = require("./reports/customerOutstandingReport");
const carateReport = require("./reports/carateReport");
const supplierOutstanding = require("./reports/supplierOutstanding");
const ledgerReport = require("./reports/ledgerReport");
const remainderReport = require("./reports/remainderReport");
const purchaseData = require("./routes/purchaseData");
const carateData = require("./routes/carateData");
const driverrouteData = require("./routes/driverrouteData");
const routeSale = require("./routes/routeSale");
const outstandingcustomerData = require("./routes/outstandingcustomerData");
const fetchpv = require("./routes/fetchpv");
const list = require("./routes/list");
const user = require("./routes/user");
const fetchSaleid = require("./routes/fetchSaleid");
const fetchReceiptid = require("./routes/fetchReceiptid");
const fetchPurchaseid = require("./routes/fetchPurchaseid");
const fetchPaymentid = require("./routes/fetchPaymentid");
const bill = require("./reports/bill");
const mobile = require("./routes/mobile");
const fetchName = require("./routes/fetchName");
const fetchStock = require("./routes/fetchStock");
const fetchTotal = require("./routes/fetchTotal");
const fetchData = require("./routes/fetchData");
const supplierLedger = require("./reports/supplierLedger");
const whatsapp = require("./utility/whatsapp");
const sms = require("./utility/sms");
const profitLossReport = require("./reports/profitLossReport");
const footerconfigData = require("./routes/footerconfigData");
const fetchRouteid = require("./routes/fetchRouteid");
const fetchAccountid = require("./routes/fetchAccountid");
const accountLedger = require("./reports/accountLedger");
const adminaccessconfigData = require("./routes/adminaccessconfigData");
const editHistory = require("./routes/editHistory");
const editedReceipt = require("./routes/editedReceipt");

app.use(cors());
app.use(bodyParser.json());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, PATCH, POST, PUT, DELETE, OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });


app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500","http://94.136.190.129:3000"],
//   origin: [*],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/userData", userData);
app.use("/productData", productData);
app.use("/saleData", saleData);
app.use("/accessconfigData", accessconfigData);
app.use("/adminaccessconfigData", adminaccessconfigData);
app.use("/accountData", accountData);
app.use("/accountgroupData", accountgroupData);
app.use("/caratebillData", caratebillData);
app.use("/carateuserData", carateuserData);
app.use("/categoryData", categoryData);
app.use("/paymentData", paymentData);
app.use("/purchaseproductData", purchaseproductData);
app.use("/receiptData", receiptData);
app.use("/saleproductData", saleproductData);
app.use("/vehicleData", vehicleData);
app.use("/routeData", routeData);
app.use("/purchaseData", purchaseData);
app.use("/carateData", carateData);
app.use("/driverrouteData", driverrouteData);
app.use("/purchaseReport", purchaseReport);
app.use("/routewiseSaleReport", routewiseSaleReport);
app.use("/stockReport", stockReport);
app.use("/khatawani", khatawani);
app.use("/batawiseSaleReport", batawiseSaleReport);
app.use("/dailyReport", dailyReport);
app.use("/receiptReport", receiptReport);
app.use("/paymentReport", paymentReport);
app.use("/customerOutstandingReport", customerOutstandingReport);
app.use("/carateReport", carateReport);
app.use("/supplierOutstanding", supplierOutstanding);
app.use("/ledgerReport", ledgerReport);
app.use("/remainderReport", remainderReport);
app.use("/outstandingcustomerData", outstandingcustomerData);
app.use("/fetchpv", fetchpv);
app.use("/list", list);
app.use("/user", user);
app.use("/fetchSaleid", fetchSaleid);
app.use("/fetchRouteid", fetchRouteid);
app.use("/fetchReceiptid", fetchReceiptid);
app.use("/fetchPurchaseid", fetchPurchaseid);
app.use("/fetchPaymentid", fetchPaymentid);
app.use("/bill", bill);
app.use("/mobile", mobile);
app.use("/fetchName", fetchName);
app.use("/fetchStock", fetchStock);
app.use("/fetchTotal", fetchTotal);
app.use("/fetchData", fetchData);
app.use("/supplierLedger", supplierLedger);
app.use("/whatsapp", whatsapp);
app.use("/sms", sms);
app.use("/routeSale", routeSale);
app.use("/profitLossReport", profitLossReport);
app.use("/footerconfigData", footerconfigData);
app.use("/fetchAccountid", fetchAccountid);
app.use("/accountLedger", accountLedger);
app.use("/editHistory", editHistory);
app.use("/editedReceipt", editedReceipt);

// For running server locally
const PORT = process.env.PORT || 3000;
app.listen(PORT,  function(){
 console.log("SERVER STARTED ON 'server':" + PORT);
 testConnection()
  .then(({ host, database }) => {
    console.log(`DATABASE CONNECTED: ${host}/${database}`);
  })
  .catch((err) => {
    console.error("DATABASE CONNECTION FAILED:", err.message);
  });
})

// For running server publically
// app.listen(80, function () {
//   console.log("SERVER STARTED ON 80 PORT");
// });


// Helper to dynamically load routes
// const loadModules = (dir, prefix = "") => {
//     fs.readdirSync(dir).forEach((file) => {
//       const filePath = path.join(dir, file);
//       if (fs.lstatSync(filePath).isFile()) {
//         const moduleName = path.parse(file).name;
//         app.use(`/${prefix}${moduleName}`, require(filePath));
//       }
//     });
//   };
  
//   // Load routes and reports dynamically
//   loadModules(path.join(__dirname, "routes"));
//   loadModules(path.join(__dirname, "reports"));



app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SK fruit</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"> 
    <!-- above link is cdn link for Tailwind -->
    <style>
        html, body {
            height: 100%;
        }
        body {
            display: flex;
            flex-direction: column;
        }
        main {
            flex: 1;
        }
    </style>
</head>
<body class="font-sans antialiased bg-gray-100">

    <!-- Navbar -->
    <nav class="bg-white shadow">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <a href="#">
                    <img src="/images/skfruit.png" alt="Brand Logo" class="h-10 w-32"> <!-- Increased logo size -->
                </a>
            </div>
            <div class="hidden md:flex space-x-4">
                <a href="#" class="text-gray-900 hover:text-blue-500">Home</a>
                <a href="#" class="text-gray-900 hover:text-blue-500">About</a>
                <a href="#" class="text-gray-900 hover:text-blue-500">Services</a>
                <a href="#" class="text-gray-900 hover:text-blue-500">Contact</a>
            </div>
            <div class="md:hidden">
                <button id="menuButton" class="text-gray-900 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </div>
        <div id="mobileMenu" class="hidden md:hidden bg-white">
            <a href="#" class="block px-4 py-2 text-gray-900 hover:bg-gray-200 hover:text-blue-500">Home</a>
            <a href="#" class="block px-4 py-2 text-gray-900 hover:bg-gray-200 hover:text-blue-500">About</a>
            <a href="#" class="block px-4 py-2 text-gray-900 hover:bg-gray-200 hover:text-blue-500">Services</a>
            <a href="#" class="block px-4 py-2 text-gray-900 hover:bg-gray-200 hover:text-blue-500">Contact</a>
        </div>
    </nav>

    <!-- Full Background Image Section -->
    <section class="bg-cover bg-center bg-no-repeat h-screen" style="background-image: url('/images/skfruitbackground.jpeg');">
        <div class="flex items-center justify-center h-full  bg-opacity-50">
            <div class="text-center text-white">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome to SK Fruit</h1>
                <p class="text-lg md:text-xl mb-8">We provide the best services for our customers.</p>
                <!-- <a href="#" class="bg-white text-blue-500 py-2 px-4 rounded-full font-semibold hover:bg-gray-200">Learn More</a> -->
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-6 mt-auto">
        <div class="container mx-auto px-4 text-center">
            <p>&copy; 2024 SK Fruit. All rights reserved.</p>
        </div>
    </footer>

    <!-- Script for Mobile Menu -->
    <script>
        document.getElementById('menuButton').addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.toggle('hidden');
        });
    </script>
</body>
</html>
    `);
});

//For deployment
// module.exports = app;
