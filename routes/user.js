const express = require('express');
const router = express.Router();
const userController = require('../controller/user'); 
const header = require('../utils/header');
const authHeader = require("../utils/auth")

router.post("/createUser", userController.createUser);
router.get('/getUsers', userController.getUserList);
router.post('/login', userController.loginUser);
router.post('/updateUser', header, userController.updateUser);

module.exports = router