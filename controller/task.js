const Task = require("../db/Schema/Task");
const apiResponse = require("../helpers/apiResponse");

const moment = require("moment");

exports.createTask = async (req, res) => {
  try {
    const { name, description, startDate, status, dueDate, reminder } = req.body;
  
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name) {
      return res.status(400).json({ message: "Name is required to create a task" });
    }

    const task = new Task({
      user: req.user._id,
      name,
      description,
      startDate: moment(startDate),
      status: status || "Pending",
      dueDate: moment(dueDate),
      reminder: moment(reminder),
    });

    // Save the task
    await task.save();

    res.status(201).json({ message: "Task added successfully...", task });
  } catch (error) {
    console.error("Error creating task", error);
    res.status(500).json({ message: "Error in creating task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const taskList = await Task.find();
    apiResponse.successResponseWithData(res, "Successfully ....", taskList);
  } catch (error) {
    console.log("error finding task list");
    res.status(500).json({ message: "Error Finding for task list" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { name, description, dueDate, reminder, status, startDate } =
      req.body;
    console.table({ name, description, dueDate, reminder, status, startDate });
    const update = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    apiResponse.successResponseWithData(res, "Successfully update", update);
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
