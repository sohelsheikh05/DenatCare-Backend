import express from "express"
import nodemailer from "nodemailer"
import auth from "../middleware/auth.js"

import dotenv from "dotenv";
const router = express.Router()

// Initialize email transporter




// Send appointment reminder
router.post("/send-reminder", auth, async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });
    const { patientName, phone, email, appointmentTime, appointmentType, date } = req.body;
  
    
const mailOptions = {
    from: process.env.EMAIL,
    to: email, // 👈 dynamically received
    subject: `Message from ${process.env.EMAIL}`,
    
    html: `
            <h2>Appointment Reminder</h2>
            <p>Dear ${patientName},</p>
            <p>This is a reminder for your upcoming appointment:</p>
            <ul>
              <li><strong>Type:</strong> ${appointmentType}</li>
              <li><strong>Date & Time:</strong> ${appointmentTime}</li>
            </ul>
            <p>Please arrive 15 minutes early for check-in.</p>
            <p>Thank you!</p>
            <p>DentiTrack Team</p>
          `
  };
    // Send Email if email is provided
    if (email) {
      try {
        transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).send(error.toString());
    res.status(200).send('Message sent successfully!');
  });

      } catch (emailError) {
        console.error("Email Error:", emailError);
      }
    }

    // Send SMS Reminder (independently of email)
   

    res.json({ message: "Reminder sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send reminder" });
  }
});

export default router
