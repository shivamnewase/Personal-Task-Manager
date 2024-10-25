const mongoose = require("mongoose");
const Project = require("../db/Schema/Project");
const User = require("../db/Schema/User");
const Task = require("../db/Schema/Task");
const apiResponse = require("../helpers/apiResponse");

exports.createProject = async (req, res) => {
  try {
    const {
      type,
      projectName,
      createdBy,
      defaultAssign,
      tasks,
      users, // This should be an array of user IDs
      emailOnTaskDueDate,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

   

    if (!projectName) {
      return res.status(400).json({ message: "Project Name is required" });
    }

    if (!createdBy) {
      return res.status(400).json({ message: "Created By (Project Lead) is required" });
    }

    if (!defaultAssign) {
      return res.status(400).json({ message: "Default Assign is required" });
    }

    const userExists = await User.findById(createdBy);
    if (!userExists) {
      return res.status(404).json({ message: "CreatedBy User not found" });
    }

    const defaultAssignUser = await User.findById(defaultAssign);
    if (!defaultAssignUser) {
      return res.status(404).json({ message: "DefaultAssign User not found" });
    }

   
    if (users && users.length > 0) {
      const usersExist = await User.find({ _id: { $in: users } });
      if (usersExist.length !== users.length) {
        return res.status(404).json({ message: "One or more users not found" });
      }
    }

    // Create new project
    const newProject = new Project({
      type,
      projectName,
      createdBy,
      projectKey: projectName.slice(0, 3).toUpperCase(), // Ensure the project key is uppercase
      emailOnTaskDueDate,
      defaultAssign,
      tasks: tasks || [],
      users: users || [], // Add the users array to the project
    });

    // Save the project to the database
    const savedProject = await newProject.save();

    // Populate references
    const updatedPost = await Project.findById(savedProject._id)
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "defaultAssign", select: "-password" })
      .populate({ path: "users", select: "-password" }); // Populate users

    res.status(201).json({
      message: "Project created successfully",
      project: updatedPost,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error in creating project" });
  }
};


exports.getProject = async (req, res) =>{

  try {
     const { projectId } = req.body;
     console.log("🚀 ~ exports.getProject= ~ projectId:", projectId)

       const getResponse = await Project.findOne({_id:projectId}).populate({path:'tasks'});
       console.log("🚀 ~ exports.getProject= ~ getResponse:👉👉👉👉", getResponse)
       if (!getResponse) {
        return res.status(404).json({ message: "Project not found" });
       }
      apiResponse.successResponseWithData(res, "Project Found Successfully ....", getResponse)

  } catch (error) {
    console.log(error)
  }

}

exports.getAllProject = async (req, res) => {
  try {
    const allProject = await Project.find()
      // .populate({ path: "tasks" })
      // .populate({ path: "createdBy", select: "-password" })
      // .populate({ path: "defaultAssign", select: "-password" });

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

exports.showAllProjectList = async (req, res) => {
  try {
    const allProject = await Project.find().select(['-tasks','-createdBy','-defaultAssign'])

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
