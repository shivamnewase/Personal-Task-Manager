const mongoose = require("mongoose");
const Project = require("../db/Schema/Project");
const User = require("../db/Schema/User");
const Task = require('../db/Schema/Task');
const apiResponse = require("../helpers/apiResponse");

exports.createProject = async (req, res) => {
  try {
    const { type, projectName, createdBy, defaultAssign, tasks } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (type !== "project") {
      return res.status(400).json({ message: "Type must be 'project'" });
    }

    if (!projectName) {
      return res.status(400).json({ message: "Project Name is required" });
    }

    if (!createdBy) {
      return res
        .status(400)
        .json({ message: "Created By (Project Lead) is required" });
    }

    if (!defaultAssign) {
      return res.status(400).json({ message: "Default Assign is required" });
    }

    // Validate user existence
    const userExists = await User.findById(createdBy);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

   

    // Create new project
    const newProject = new Project({
      type,
      projectName,
      createdBy,
      projectKey: projectName.slice(0, 3),
      defaultAssign,
      tasks: tasks || [],
    });

    const savedProject = await newProject.save();

    const updatedPost = await Project.findById(savedProject._id)
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "defaultAssign", select: "-password" });

    res.status(201).json({
      message: "Project created successfully",
      project: updatedPost,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error in creating project" });
  }
};

exports.getAllProject = async (req, res) => {
  try {
    const allProject = await Project.find().populate({path:"tasks"})
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "defaultAssign", select: "-password" });

    apiResponse.successResponseWithData(
      res,
      "Project List successfully",
      allProject
    );
  } catch (error) {
    console.error("Error geting project:", error);
    res.status(500).json({ message: "Error in get project list" });
  }
};

exports.deleteProject = async (req, res) => {
  try {

    const deletePro = await Project.deleteOne({ _id: req.params.id });
    console.log("🚀 ~ exports.deleteProject ~ deletePro:", deletePro);
    const remProject = await Project.find();
    apiResponse.successResponseWithData(
      res,
      "Project delete successfully",
      remProject
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "error deleting project" });
  }
};
