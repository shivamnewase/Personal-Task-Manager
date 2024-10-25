const express = require('express');
const router = express.Router();
const taskController = require('../controller/task');
const auth = require('../utils/auth');


router.post('/creatTask', taskController.createTask);
router.get('/taskList', taskController.getTasks);
router.get('/findTasks', taskController.findTasks);
router.post('/updateTask', taskController.updateTask);
router.post('/deleteTask', taskController.deleteTask);

module.exports = router;