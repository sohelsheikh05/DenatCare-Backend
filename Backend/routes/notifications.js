import express from "express"
import nodemailer from "nodemailer"
import auth from "../middleware/auth.js"

const router = express.Router()

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
})

// Send appointment reminder
router.post("/send-reminder", auth, async (req, res) => {
  try {
    const { patientName, phone, email, appointmentTime, appointmentType } = req.body

    const message = `Hi ${patientName}, this is a reminder for your ${appointmentType} appointment scheduled for ${appointmentTime}. Please arrive 15 minutes early. Thank you!`

    // Send Email if email is provided
    if (email) {
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Appointment Reminder - DentiTrack",
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
          `,
        })
      } catch (emailError) {
        console.error("Email Error:", emailError)
      }
    }

    res.json({ message: "Reminder sent successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to send reminder" })
  }
})

export default router
