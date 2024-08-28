const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const countryRoutes = require('./country');
const tasksRoutes = require('./task')
const header = require("../utils/header");
const auth = require("../utils/auth")

router.use("/test", header, userRoutes);
router.use('/test', auth, header, countryRoutes);
router.use('/test', auth, header, tasksRoutes)

module.exports = router;
