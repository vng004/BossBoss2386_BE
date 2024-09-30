import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

export const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Error sending email: " + error.message);
    }
};