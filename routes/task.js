const express = require('express');
const router = express.Router();
const taskController = require('../controller/task');
const auth = require('../utils/auth');


router.post('/create', taskController.createTask);
router.get('/taskList', taskController.getTasks);
router.put('/updateTask/:id', taskController.updateTask);
router.delete('/deleteTask/:id', taskController.deleteTask);

module.exports = router;