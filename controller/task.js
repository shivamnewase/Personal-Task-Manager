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
      return res.status(400).json({ message: "Project Name is required" });
    }

    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required to create a task" });
    }

    const assigneeId = new mongoose.Types.ObjectId(assignee);
    const reporterId = new mongoose.Types.ObjectId(reporter);

    const task = new Task({
      project,
      user: req.user._id,
      name,
      description,
      summary,
      startDate: moment(startDate),
      status: status || "TO DO",
      dueDate: moment(dueDate),
      reminder: moment(reminder),
      priority: priority || "Low",
      assignee: assigneeId,
      reporter: reporterId,
    });

    const savedTask = await task.save();

    const populatedTask = await Task.findById(savedTask._id)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" })
      .exec();

    await Project.updateOne(
      {
        _id: project,
      },
      {
        $push: {
          tasks: savedTask._id,
        },
      }
    );

    apiResponse.successResponseWithData(
      res,
      "Task added successfully...",
      populatedTask
    );
  } catch (error) {
    console.error("Error creating task:::", error);
    res.status(500).json({ message: "Error in creating task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const taskList = await Task.find()
      .populate({ path: "user", select: "-password" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" })
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
    const update = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const updatedRes = await Task.findById(update._id)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" })
      .lean();

    apiResponse.successResponseWithData(res, "Successfully update", updatedRes);
  } catch (error) {
    res.status(500).json({ message: "Error in update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleteRec = await Task.deleteOne({ _id: req.params.id });

    if (deleteRec.deletedCount == 1) {
      const data = await Task.find();
      apiResponse.successResponseWithData(
        res,
        "Task Delete Successfully...",
        data
      );
    } else {
      return res.status(200).json({ message: "records Not found To delete" });
    }
  } catch (error) {
    return res.status(500).json({ message: "error For deleting task" });
  }
};
