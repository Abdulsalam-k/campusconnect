function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Build your professional student profile with your education, department, skills, interests and experience.",
      icon: "✦",
    },
    {
      number: "02",
      title: "Discover",
      description:
        "Explore talented students, recruiters, projects and opportunities that match your goals.",
      icon: "⌕",
    },
    {
      number: "03",
      title: "Connect & Apply",
      description:
        "Connect with the right people and apply for opportunities that fit your skills and ambitions.",
      icon: "↗",
    },
    {
      number: "04",
      title: "Track Your Growth",
      description:
        "Manage your applications, follow progress and keep building your professional journey.",
      icon: "✓",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        <div className="how-it-works-heading">
          <div>
            <p>HOW IT WORKS</p>

            <h2>
              From campus connection to
              <span> career growth.</span>
            </h2>
          </div>

          <p className="how-it-works-intro">
            CampusConnect simplifies the journey from
            creating your profile to discovering opportunities,
            connecting with people and growing your career.
          </p>
        </div>

        <div className="how-it-works-steps">
          {steps.map((step, index) => (
            <article
              className="how-it-works-step"
              key={step.number}
            >
              <div className="how-it-works-step-top">
                <div className="how-it-works-icon">
                  {step.icon}
                </div>

                <span className="how-it-works-number">
                  {step.number}
                </span>
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

              {index < steps.length - 1 && (
                <div className="how-it-works-connector">
                  →
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;