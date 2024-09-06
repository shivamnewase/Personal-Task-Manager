const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
// Create a transporter object using your SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.TRANS_HOST,
  port: process.env.TRANS_PORT,
  auth: {
    user: process.env.TRANS_USER,
    pass: process.env.TRANS_PASS,
  },
  secure: false, 
});

async function senderMail(task) {
  try {
    const templatePath = path.join(__dirname, "task-email-template.html");

    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    let formatedDate = task.dueDate.format('MMMM Do YYYY, h:mm:ss a');

    htmlTemplate = htmlTemplate.replace("${taskName}", task.name);
    htmlTemplate = htmlTemplate.replace("${taskDescription}", task.description);
    htmlTemplate = htmlTemplate.replace("${taskStatus}", task.status);
    htmlTemplate = htmlTemplate.replace("${taskDueDate}", formatedDate);

    const info = await transporter.sendMail({
      from: '"shivam.newase@sparklesoft.co.in"',
      to: "shivam.newase@sparklesoft.co.in",
      subject: `Task Due: ${task.description}`,
      text: `Task is overdue: ${task.name}. You can change the date or status.`,
      html: htmlTemplate,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { senderMail };
