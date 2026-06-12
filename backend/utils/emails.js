import dotenv from "dotenv";
dotenv.config({});
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_SENDER_EMAIL:", process.env.SMTP_SENDER_EMAIL);
console.log("SMTP_PASSWORD length:", process.env.SMTP_PASSWORD?.length);
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

        const response = await transporter.sendMail(mailOptions);
        console.log("Verification code sent successfully");
        console.log(verificationToken);
        
    } catch (error) {
        console.error("Error sending verification email:", error.message);
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        // console.log("email",email)
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        }

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully", response);

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

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset success email sent successfully", response);

    } catch (error) {
        console.error("Error sending password reset email:", error.message);
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
    console.error("Error sending email:", error);
  }
};


export { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendEmail};
