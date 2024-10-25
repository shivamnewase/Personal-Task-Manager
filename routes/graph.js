const express = require("express");
const router = express.Router();
const graphController = require('../controller/graph');



router.post('/graphDetails',graphController.chartDetails);
router.post('/barGraph',graphController.barChartDetails);
router.post('/workload',graphController.workLoad);

module.exports = router;