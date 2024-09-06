const { CronJob } = require("cron");
const moment = require("moment");
const Task = require("../db/Schema/Task");
const express = require("express");
const app = express.Router();
const { senderMail } = require("../mail/sender");

async function checkTasks() {
  try {
    const tasks = await Task.find({
      reminder: { $exists: true, $ne: null },
      dueDate: { $exists: true, $ne: null },
      status: { $ne: "DONE" },
    });

    for (const task of tasks) {
      const dueDate = moment.utc(task.dueDate);

      const currentDateUtc = new Date();
      const date = moment(currentDateUtc);

      const dateInLocalTimezone = moment.parseZone(date.format());

      const formattedDate = dateInLocalTimezone.format(
        "YYYY-MM-DDTHH:mm:ss[Z]"
      );

      if (formattedDate == dueDate.format()) {
        console.log("tasks");
        await senderMail(task);
      }
    }
    return [];
  } catch (error) {
    console.error("Error checking tasks", error);
  }
}

// Create a new cron job to run every 1 sec in IST
const job = new CronJob("* * * * * *", checkTasks, null, true, "Asia/Kolkata");

module.exports = { job };
