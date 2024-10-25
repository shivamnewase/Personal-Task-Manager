const { CronJob } = require("cron");
const moment = require("moment");
const Task = require("../db/Schema/Task");
const { senderMail } = require("../mail/sender");
const express = require("express");
const app = express.Router();

// Function to check tasks and send emails
async function checkTasks() {
  try {
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date();;
    console.log("Current Date:", currentDate.toISOString().split("T")[0]);

    // Fetch tasks and populate the project field
    const taskData = await Task.find({
      project: { $ne: null },
      status: { $ne: "DONE" },
      dueDate: { $ne: null },
    })
    .populate({
      path: 'project',
      match: { emailOnTaskDueDate: true },
      select: '-tasks',
    })
    .exec();

    // Iterate over tasks to check due dates
    for (const task of taskData) {
      const dueDate = new Date(task.dueDate);
   
      // console.log("🚀 ~ checkTasks ~ date:", date)
      // Check if the current date is greater than or equal to the due date
      if (currentDate < dueDate) {
        // console.log("Sending email for task due on:", dueDate.toISOString().split("T")[0]);
        // await senderMail(task); // Send email
      } else {
        // console.log("Task due on", dueDate.toISOString().split("T")[0], "is not yet due.");
      }
    }
  } catch (error) {
    console.error("Error checking tasks:", error);
  }
}

// Create a new cron job to run daily at 6 PM in different time zones

// India Standard Time (IST)
const jobIST = new CronJob(
  "0 * * * * *", // Cron expression for 6 AM
  checkTasks,
  null,
  true,
  "Asia/Kolkata" // Time zone for IST
);

// Eastern Time (ET)
const jobET = new CronJob(
  "0 18 * * *", // Cron expression for 6 PM
  checkTasks,
  null,
  true,
  "America/New_York" // Time zone for ET
);

// Greenwich Mean Time (GMT) / British Summer Time (BST)
const jobGMT = new CronJob(
  "0 18 * * *", // Cron expression for 6 PM
  checkTasks,
  null,
  true,
  "Europe/London" // Time zone for GMT/BST
);

// Japan Standard Time (JST)
const jobJST = new CronJob(
  "0 18 * * *", // Cron expression for 6 PM
  checkTasks,
  null,
  true,
  "Asia/Tokyo" // Time zone for JST
);

// Australian Eastern Time (AET)
const jobAET = new CronJob(
  "0 18 * * *", // Cron expression for 6 PM
  checkTasks,
  null,
  true,
  "Australia/Sydney" // Time zone for AET
);

module.exports = { jobIST, jobET, jobGMT, jobJST, jobAET };
