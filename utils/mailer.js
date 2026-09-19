import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.SMTP_PORT || '465', 10);
const secure = port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: port,
  secure: secure, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send email notification for portfolio contact form submission
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Jainil Portfolio" <${process.env.SMTP_USER}>`,
    to: [process.env.RECEIVER_EMAIL || 'jainilba7@gmail.com', process.env.SMTP_USER],
    replyTo: email,
    subject: `[Portfolio Contact] ${subject || 'New Portfolio Message'} from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0d1117; color: #e6edf3; padding: 20px; border-radius: 8px;">
        <h2 style="color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 10px;">
          🚀 New Portfolio Message
        </h2>
        <p><strong>Sender Name:</strong> ${name}</p>
        <p><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #2f81f7;">${email}</a></p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <div style="background-color: #161b22; padding: 15px; border-left: 4px solid #58a6ff; margin-top: 15px; border-radius: 4px;">
          <h4 style="margin-top:0; color: #8b949e;">Message:</h4>
          <p style="white-space: pre-wrap; margin-bottom: 0;">${message}</p>
        </div>
        <hr style="border-color: #30363d; margin-top: 20px;" />
        <p style="font-size: 12px; color: #8b949e;">
          Sent via Jainil Aliwala's Node.js Portfolio Server
        </p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};
