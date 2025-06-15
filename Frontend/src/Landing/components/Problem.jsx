const Problem = () => {
  const problems = [
    {
      title: "Fragmented Systems",
      description: "Many dental clinics lack a unified digital system tailored to their specific workflow needs.",
    },
    {
      title: "Complex Treatment Tracking",
      description: "Managing multi-session treatments like root canals, braces, and implants across weeks or months.",
    },
    {
      title: "Inefficient Scheduling",
      description: "Difficulty in managing consistent follow-ups and reducing no-shows due to missed appointments.",
    },
    {
      title: "Poor Communication",
      description: "Challenges in communicating treatment plans and maintaining structured patient data management.",
    },
  ]

  const challenges = [
    { icon: "📄", title: "Scattered Records", desc: "Patient histories spread across multiple systems" },
    { icon: "📅", title: "Manual Scheduling", desc: "Time-consuming appointment management" },
    { icon: "⏰", title: "Missed Follow-ups", desc: "Lost revenue from forgotten appointments" },
    { icon: "👥", title: "Poor Communication", desc: "Disconnected patient-practice relationship" },
  ]

  return (
    <section id="problem" className="problem-section">
      <div className="container">
        <div className="section-header">
          <h2>The Challenge Dental Practices Face</h2>
          <p>
            Dentistry operates differently from emergency-focused medical fields. Most dental patients require
            long-term, scheduled treatments that span multiple sessions over weeks or months.
          </p>
        </div>

        <div className="problem-content">
          <div className="problem-list">
            <h3>Current Problems</h3>
            {problems.map((problem, index) => (
              <div key={index} className="problem-item">
                <div className="problem-bullet"></div>
                <div>
                  <strong>{problem.title}:</strong> {problem.description}
                </div>
              </div>
            ))}
          </div>

          <div className="challenge-grid">
            {challenges.map((challenge, index) => (
              <div key={index} className="challenge-card">
                <div className="challenge-icon">{challenge.icon}</div>
                <h4>{challenge.title}</h4>
                <p>{challenge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Problem
