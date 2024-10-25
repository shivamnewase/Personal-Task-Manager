const Task = require("../db/Schema/Task");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");
const moment = require("moment");
const Project = require("../db/Schema/Project");

exports.createTask = async (req, res) => {
  try {
    const {
      name,
      description,
      summary,
      startDate,
      status,
      dueDate,
      reminder,
      project,
      priority,
      assignee,
      reporter,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!project) {
      return res.status(400).json({ message: "Project is required" });
    }

    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required to create a task" });
    }

    const assigneeId = new mongoose.Types.ObjectId(assignee);
    const reporterId = new mongoose.Types.ObjectId(reporter);

    const formattedStartDate = startDate
      ? moment(startDate).toISOString()
      : null;
    const formattedDueDate = dueDate ? moment(dueDate).toISOString() : null;
    const formattedReminder = reminder ? moment(reminder).toISOString() : null;

    // Retrieve project information
    const projectDoc = await Project.findById(project);
    console.log("🚀 ~ exports.createTask= ~ projectDoc:", projectDoc);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (projectDoc.emailOnTaskDueDate && !dueDate) {
      return res
        .status(400)
        .json({ message: "Due date is required for create Task" });
    }

    // Find the latest task number for the project (if needed)
    const lastTask = await Task.findOne({ project })
      .sort({ taskNumber: -1 })
      .exec();
    let taskNumber;
    if (!lastTask) {
      taskNumber = `${projectDoc.projectName.slice(0, 3).toUpperCase()}-01`;
    } else {
      const lastTaskNumber = parseInt(lastTask.taskNumber.split("-")[1], 10);
      const newTaskNumber = lastTaskNumber + 1;
      taskNumber = `${projectDoc.projectName
        .slice(0, 3)
        .toUpperCase()}-${String(newTaskNumber).padStart(2, "0")}`;
    }

    // Create the new task
    const task = new Task({
      project,
      user: req.user._id,
      name,
      description,
      summary,
      startDate: formattedStartDate,
      status: status || "TO DO",
      dueDate: formattedDueDate,
      reminder: formattedReminder,
      priority: priority || "Low",
      assignee: assigneeId,
      reporter: reporterId,
      taskNumber, // Save the task number if implemented
    });

    const savedTask = await task.save();

    const populatedTask = await Task.findById(savedTask._id)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" })
      .exec();

    await Project.updateOne(
      { _id: project },
      { $push: { tasks: savedTask._id } }
    );

    res.status(201).json({
      message: "Task added successfully...",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Error creating task:::", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const taskList = await Task.find()
      // .populate({ path: "user", select: "-password" })
      .populate({ path: "project", select: "-tasks" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" })
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse.successResponseWithData(
      res,
      "Successfully ....",
      taskList
    );
  } catch (error) {
    console.log("error finding task list", error);
    res.status(500).json({ message: "Error Finding for task list" });
  }
};

exports.findTasks = async (req, res) => {
  const projectId = req.body;
  try {
    const taskList = await Task.findOne({ project: projectId })
      // .populate({ path: "user", select: "-password" })
      .populate({ path: "project", select: "-tasks" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" })
      .sort({ createdAt: -1 })
      .lean();

    return apiResponse.successResponseWithData(
      res,
      "Successfully ....",
      taskList
    );
  } catch (error) {
    console.log("error finding task list", error);
    res.status(500).json({ message: "Error Finding for task list" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Destructure taskId and other properties from req.body
    const { taskId, ...updateData } = req.body;
    
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });

    // Check if the task was found and updated
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Populate the necessary fields
    const updatedRes = await Task.findById(updatedTask._id)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" })
      .lean();

    // Send a success response with the updated data
    apiResponse.successResponseWithData(
      res,
      "Successfully updated",
      updatedRes
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error in updating task" });
  }
};

exports.deleteTask = async (req, res) => {
  console.log("🚀 ~ exports.deleteTask ~ req:", req);
  try {
    const { projectId, taskIds } = req.body; 

    // Ensure taskIds is an array
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ message: "No task IDs provided" });
    }

    // Delete tasks that belong to the specified project
    const deleteRec = await Task.deleteMany({
      _id: { $in: taskIds },
      projectId: projectId // Assuming each task has a projectId field
    });

    if (deleteRec.deletedCount > 0) {
      const data = await Task.find({ projectId }); // Fetch remaining tasks for the project
      apiResponse.successResponseWithData(
        res,
        "Tasks deleted successfully...",
        data
      );
    } else {
      return res.status(200).json({ message: "No records found to delete" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Error deleting task" });
  }
};
