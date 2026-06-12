import dotenv from "dotenv";
dotenv.config();
import SibApiV3Sdk from '@getbrevo/brevo';
import apiInstance from "../config/nodemailer.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "../assets/emailTemplates.js";

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { email: "kansal.akshat757@gmail.com", name: "CCPS Portal" };
        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.subject = "Verify Your Email";
        sendSmtpEmail.htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification email:", error.message);
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { email: "kansal.akshat757@gmail.com", name: "CCPS Portal" };
        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.subject = "Reset your password";
        sendSmtpEmail.htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending password reset email:", error.message);
    }
}

const sendPasswordResetSuccessEmail = async (email) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { email: "kansal.akshat757@gmail.com", name: "CCPS Portal" };
        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.subject = "Password Reset Successful";
        sendSmtpEmail.htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Password reset success email sent successfully");
    } catch (error) {
        console.error("Error sending password reset success email:", error.message);
    }
}

const sendEmail = async ({ to, subject, html }) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { email: "kansal.akshat757@gmail.com", name: "CCPS Portal" };
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
}

export { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendEmail };
