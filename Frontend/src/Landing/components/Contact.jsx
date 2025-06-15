"use client"

import { useState } from "react"
import axios from "axios"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practiceName: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      // const response = await axios.post("http://localhost:5000/api/contact", formData)

      if (1) {
        setSubmitMessage("Thank you for your interest! We will contact you soon.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          practiceName: "",
          message: "",
        })
      }
    } catch (error) {
      setSubmitMessage("Something went wrong. Please try again later.")
      console.error("Contact form error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header">
          <h2>Ready to Transform Your Practice?</h2>
          <p>
            Get in touch to learn more about DentiTrack and how we can revolutionize your dental practice management.
          </p>
        </div>

        <div className="contact-content">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="practiceName">Practice Name</label>
                <input
                  type="text"
                  id="practiceName"
                  name="practiceName"
                  value={formData.practiceName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes("Thank you") ? "success" : "error"}`}>
                {submitMessage}
              </div>
            )}
          </form>

          <div className="contact-info">
            <h3>Get in Touch</h3>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>dentitrack_info@gmail.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+91 8459544661</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Medical Square,Nagpur,Maharashtra</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
