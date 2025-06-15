"use client"

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Dental Treatment &<span className="text-primary"> Appointment Manager</span>
          </h1>
          <p className="hero-description">
            Revolutionizing dental practice management with intelligent scheduling, comprehensive patient tracking, and
            streamlined treatment workflows.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => scrollToSection("solution")}>
              Learn More →
            </button>
            
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
