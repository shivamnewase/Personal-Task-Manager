const mongoose = require("mongoose");
const Task = require("./Task");

const projectSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["project", "task"],
      required: true,
    },
    projectName: {
      type: String,
      required: function () {
        return this.type === "project";
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "project";
      },
    },
    projectKey: {
      type: String,
      unique: function () {
        return this.type === "project";
      },
    },
    defaultAssign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "project";
      },
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
