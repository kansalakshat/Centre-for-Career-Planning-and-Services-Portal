import dotenv from "dotenv";
dotenv.config({});

import nodemailer from 'nodemailer'
console.log("=== NODEMAILER LOADED ===");
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_SENDER_EMAIL:", process.env.SMTP_SENDER_EMAIL);
console.log("SMTP_PASSWORD length:", process.env.SMTP_PASSWORD?.length);
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",//"smtp-relay.brevo.com"
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP connection failed:", error);
    } else {
        console.log("SMTP server is ready to take our messages");
    }
});


export default transporter;
