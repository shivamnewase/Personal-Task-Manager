const express = require("express");
const app = express();
const port = 5001;
const db = require("./db");
const bodyParser = require("body-parser");
const Router = require("./routes");
const apiResponse = require("./helpers/apiResponse");
const { job } = require("./cronjob/cronjob");

const axios = require("axios");
const geoip = require('geoip-lite');
const getIpAddresses = require('./ip');

const ipAddresses = getIpAddresses();
console.log('IP Addresses:', ipAddresses);

// const { getName } = require('country-list');
// const requestIp = require('request-ip');
// const {internalIpV4, internalIpV6 } =require('internal-ip');
// const { exec } = require('child_process');


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-api-version,content-type,Auth-Key,Authorization,Client-Service"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});


// app.use((req, res, next) => {
//   // Extract the IP address from 'x-forwarded-for' header if available
//   let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   console.log("🚀 ~ app.use ~ ip:", ip)

//   // Handle the case where 'x-forwarded-for' is a list
//   if (Array.isArray(ip)) {
//     ip = ip[0];
//   }

//   // Convert IPv6-mapped IPv4 address to IPv4 address if needed
//   const ipAddress = ip.split(':').pop(); // Extract last part for IPv4

//   // Log the IP address for debugging
//   console.log('Captured IP Address:', ipAddress);

//   // Save the IP address to res.locals
//   res.locals.ipAddress = ipAddress;

//   next();
// });

app.use((req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("🚀 ~ app.use ~ raw IP:", ip);

  if (typeof ip === 'string') {
    ip = ip.split(',')[0].trim();
  }

  if (ip.includes(':')) {
    ip = ip.split(':').pop();
  }

  console.log('Captured IP Address:??????????', ip);
  res.locals.ipAddress = ip;

  next();
});

// Example endpoint to return the IP address
app.get('/api/clientIP', (req, res) => {
  res.json({ clientIP: res.locals.ipAddress });
});

// app.get('/api/systemIP', (req, res) => {
//   res.json({ ipAddress: res.locals.ipAddress });
// });



app.get('/location/:ip', (req, res) => {
  const ip = req.params.ip;
  

  const geo = geoip.lookup(ip);

  if (geo) {
    const countryName = getName(geo.country) || geo.country;

    const updatedGeo = {
      ...geo,
      country: countryName
    };

    res.json(updatedGeo);
  } else {
    res.status(404).json({ error: 'Location not found' });
  }
});



app.use(express.json()); // Middleware to parse JSON bodies



app.get('/api/get-ip', (req, res) => {
  exec('ipconfig', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ error: 'Failed to retrieve IP address' });
      return;
    }

    // Log the full output for debugging purposes
    console.log('ipconfig output:', stdout);

    // Updated regex pattern to match IPv4 Address line and extract the IP address
    const ipRegex = /IPv4 Address[ \.:]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/;
    const match = stdout.match(ipRegex);
    
    if (match && match[1]) {
      res.json({ ip: match[1] });
    } else {
      console.warn('IPv4 Address not found in ipconfig output. Full output:', stdout);
      res.status(500).json({ error: 'IPv4 Address not found' });
    }
  });
});








app.get("/", (req, res) => {
  apiResponse.normalResponse(res, "API Working...");
});

app.use(bodyParser.json());
app.use("/api", Router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
