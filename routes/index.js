const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const countryRoutes = require('./country');
const tasksRoutes = require('./task');
const projectRoutes = require('./project');
const graphRoutes = require('./graph');
const header = require("../utils/header");
const auth = require("../utils/auth")

router.use("/test", userRoutes);
router.use('/test', auth, header, countryRoutes);
router.use('/test', auth, header, tasksRoutes);
router.use('/project', auth, header, projectRoutes);
router.use('/graph',auth, header, graphRoutes);

module.exports = router;
