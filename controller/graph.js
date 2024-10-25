const Project = require("../db/Schema/Project");
const mongoose = require("mongoose");
const User = require("../db/Schema/User");
const Task = require("../db/Schema/Task");
const apiResponse = require("../helpers/apiResponse");

exports.chartDetails = async (req, res) => {
  try {
    const { projectId } = req.body;

    const detailsRes = await Task.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    // console.log(detailsRes)
    // Send response
    apiResponse.successResponseWithData(res, "Sucessfully ...", detailsRes);
  } catch (error) {
    console.error("Error fetching project details:", error);
    apiResponse.errorResponse(res, "Error to get details");
  }
};

exports.barChartDetails = async (req, res) => {
  try {
    const { projectId } = req.body;

    const responseDet = await Task.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    apiResponse.successResponseWithData(res, "Sucessfully ...", responseDet);
  } catch (error) {
    console.error("Error fetching project details:", error);
    apiResponse.errorResponse(res, "Error to get details");
  }
};

exports.workLoad = async (req, res) => {
  try {
    const { projectId } = req.body;
    const workLoadRes = await Task.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            assignee: "$assignee",//shivan
            status: "$status",// done              3
          },
          statusWiseNoOfTask: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            assignee: "$_id.assignee",
          },
          percentage: {
            $multiply: [
              { $divide: ["$statusWiseNoOfTask", { $ifNull: ["$totalCount", 1] }] }, // Divide first
              100 // Then multiply by 100
            ]
          }
        }
      },
    ]);
    console.log("🚀 ~ exports.workLoad= ~ workLoadRes:", )
    apiResponse.successResponseWithData(res, "Sucessfully ...", workLoadRes);
  } catch (error) {
    console.error("Error fetching project details:", error);
  }
};
