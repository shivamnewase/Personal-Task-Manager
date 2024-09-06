const express = require('express');
const router = express.Router();
const projectController = require('../controller/project');
const auth = require('../utils/auth');


router.post('/create', projectController.createProject);
router.get('/projectList', projectController.getAllProject);
// router.put('/updateTask/:id', taskController.updateTask);
router.delete('/deleteProject/:id', projectController.deleteProject);

module.exports = router;