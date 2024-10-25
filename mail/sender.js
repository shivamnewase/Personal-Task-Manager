const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const moment = require('moment-timezone');

// Create a transporter object using your SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.TRANS_HOST,
  port: process.env.TRANS_PORT,
  auth: {
    user: process.env.TRANS_USER,
    pass: process.env.TRANS_PASS,
  },
  secure: false, // Set to true if using port 465
});

async function senderMail(task) {
  try {
    const templatePath = path.join(__dirname, "task-email-template.html");
    console.log("Task:", task);

    // Read and parse the email template
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    
    // Format the due date
    const formattedDate = moment(task.dueDate).tz('Asia/Kolkata').format('DD/MMM/YY h:mm A');

    // Replace placeholders in the template with actual task data
    htmlTemplate = htmlTemplate.replace("${taskName}", task.name || "N/A");
    htmlTemplate = htmlTemplate.replace("${taskDescription}", task.description || "No description");
    htmlTemplate = htmlTemplate.replace("${taskStatus}", task.status || "Unknown");
    htmlTemplate = htmlTemplate.replace("${taskDueDate}", formattedDate);

    // Send the email
    const info = await transporter.sendMail({
      from: '"shivam.newase@sparklesoft.co.in"',
      to: "shivam.newase@sparklesoft.co.in",
      subject: `Task Due: ${task.description || 'No description'}`,
      text: `Task is overdue: ${task.name || 'No name'}. You can change the date or status.`,
      html: htmlTemplate,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { senderMail };
