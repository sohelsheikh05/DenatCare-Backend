const Solution = () => {
  const solutions = [
    {
      icon: "✅",
      title: "Unified System",
      description: "All-in-one platform designed specifically for dental practice management and workflows.",
    },
    {
      icon: "✅",
      title: "Smart Scheduling",
      description: "Intelligent appointment management with automated follow-ups and no-show reduction.",
    },
    {
      icon: "✅",
      title: "Treatment Tracking",
      description: "Comprehensive multi-session treatment management with progress tracking and reminders.",
    },
  ]

  return (
    <section id="solution" className="solution-section">
      <div className="container">
        <div className="section-header">
          <div className="solution-badge">Our Solution</div>
          <h2>We Have The Answer</h2>
          <p>
            DentiTrack provides a comprehensive, tailored solution specifically designed for dental practice workflows,
            addressing every challenge mentioned above with intelligent automation and user-friendly design.
          </p>
        </div>

        <div className="solution-grid">
          {solutions.map((solution, index) => (
            <div key={index} className="solution-card">
              <div className="solution-icon">{solution.icon}</div>
              <h4>{solution.title}</h4>
              <p>{solution.description}</p>
            </div>
          ))}
        </div>

        <div className="coming-soon">
          <div className="coming-soon-badge">🚀 Coming Soon - Revolutionary dental practice management made simple</div>
        </div>
      </div>
    </section>
  )
}

export default Solution
