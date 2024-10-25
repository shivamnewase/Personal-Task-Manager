const express = require("express");
const app = express();
const port = 5001;
const db = require("./db");
const bodyParser = require("body-parser");
const Router = require("./routes");
const apiResponse = require("./helpers/apiResponse");
const { jobIST } = require("./cronjob/cronjob");
const cors = require("cors");

app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-version, Client-Service");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use(express.json());

app.use("/api", Router);
app.use('/api/folders', folderRoutes);

app.get("/", (req, res) => {
  apiResponse.normalResponse(res, "API Working...");
});

if (jobIST) {
  jobIST.start();
} else {
  console.error("Cron job is not defined.");
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
