"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const Navigate=useNavigate()
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="nav-brand">
          <div className="logo">
            <span>DT</span>
          </div>
          <span className="brand-name">DentiTrack</span>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <button onClick={() => scrollToSection("problem")} className="nav-link">
            Problem
          </button>
          <button onClick={() => scrollToSection("solution")} className="nav-link">
            Solution
          </button>
          <button onClick={() => scrollToSection("contact")} className="nav-link">
            Contact
          </button>
          <button className="btn btn-outline" onClick={() => Navigate("/login")}>
              Register/Login
            </button>
        </nav>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
      </div>
    </header>
  )
}

export default Header
