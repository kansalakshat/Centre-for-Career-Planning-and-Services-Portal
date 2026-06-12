import dotenv from "dotenv";
dotenv.config();
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "../assets/emailTemplates.js";
import transporter from "../config/nodemailer.js";

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Verify Your Email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        }
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification email:", error.message);
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        }
        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending password reset email:", error.message);
    }
}

const sendPasswordResetSuccessEmail = async (email) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Password Reset Successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        }
        await transporter.sendMail(mailOptions);
        console.log("Password reset success email sent successfully");
    } catch (error) {
        console.error("Error sending password reset success email:", error.message);
    }
}

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"CCPS Portal" <${process.env.SMTP_SENDER_EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
}

export { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendEmail };
