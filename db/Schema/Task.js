const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  project:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  summary: {
    type: String,
  },
  status: {
    type: String,
    enum: ["PROCESS", "REVIEW", "DONE"],
    default: "TO DO",
  },
  startDate: {
    type: Date,
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  reminder: {
    type: Date,
    default: null,
  },
  priority: {
    type: String,
    enum: ["Lowest", "Low", "Medium", "High", "Highest"],
    default: "Medium",
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
