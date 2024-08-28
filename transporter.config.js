const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.TRANS_HOST,
    port: process.env.TRANS_PORT,
    auth: {
        user: process.env.TRANS_USER,
        pass: process.env.TRANS_PASS,
    },
    secure: false,
});
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to send mail");
    }
});
module.exports = transporter;
