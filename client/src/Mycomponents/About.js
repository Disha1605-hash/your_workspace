import React, { useEffect, useState } from 'react';
import './About.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleReturn = () => {
    // Navigate back to workspace
    window.history.back();
  };

  const features = [
    {
      icon: "🎵",
      title: "Ambient Soundscapes",
      description:
        "Choose from café, library, rain, cosy, office sounds to create your perfect work environment",
    },
    {
      icon: "💡",
      title: "Daily Motivation",
      description:
        "Get inspired with rotating motivational quotes to keep you focused and energized",
    },
    {
      icon: "⏰",
      title: "Pomodoro Timer",
      description:
        "Stay productive with our built-in timer featuring customizable work and break intervals",
    },
    {
      icon: "✅",
      title: "Task Management",
      description:
        "Organize your day with an intuitive todo list that helps you track progress",
    },
  ];

  const stats = [
    { number: "4", label: "Core Features" },
    { number: "∞", label: "Productivity" },
    { number: "24/7", label: "Available" },
    { number: "100%", label: "Focus" },
  ];

  return (
    <div className="about-container">
      {/* Navigation */}
      <nav className="about-nav">
        <button className="return-btnn" onClick={handleReturn}>
          ← Back to Workspace
        </button>
      </nav>

      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'visible' : ''}`}>
        <div className="hero-content">
          <h1 className="hero-title">
            Your Personal
            <span className="gradient-text"> Productivity Hub</span>
          </h1>
          <p className="hero-subtitle">
            A beautifully crafted workspace designed to enhance focus, boost motivation,
            and streamline your daily workflow with ambient sounds, timers, and task management.
          </p>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="workspace-preview">
            <div className="preview-grid">
              <div className="preview-section video">
                <div className="play-icon">▶</div>
                <span>Video Stream</span>
              </div>
              <div className="preview-section todo">
                <div className="todo-items">
                  <div className="todo-item">✓ Complete project</div>
                  <div className="todo-item">○ Review code</div>
                </div>
              </div>
              <div className="preview-section quote">
                <div className="quote-bubble">"Stay focused!"</div>
              </div>
              <div className="preview-section timer">
                <div className="timer-circle">
                  <span>25:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Everything You Need to Stay Productive</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="philosophy-content">
          <div className="philosophy-text">
            <h2>Built for Focus</h2>
            <p>
              We believe that productivity isn't just about getting things done—it's about
              creating an environment where deep work flourishes. This workspace combines
              proven productivity techniques with a calming, distraction-free interface.
            </p>
            <p>
              From the warm green aesthetics that reduce eye strain to the carefully curated
              ambient sounds that enhance concentration, every detail has been thoughtfully
              designed to support your best work.
            </p>
            <div className="philosophy-features">
              <div className="philosophy-point">
                <span className="point-icon">🎯</span>
                <span>Distraction-free design</span>
              </div>
              <div className="philosophy-point">
                <span className="point-icon">🌱</span>
                <span>Calming color palette</span>
              </div>
              <div className="philosophy-point">
                <span className="point-icon">⚡</span>
                <span>Instant accessibility</span>
              </div>
            </div>
          </div>
          <div className="philosophy-visual">
            <div className="floating-elements">
              <div className="floating-card card-1">
                <div className="card-icon">🧘</div>
                <span>Mindful</span>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">🚀</div>
                <span>Efficient</span>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">💚</div>
                <span>Calming</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-text">
            <h3>Ready to boost your productivity?</h3>
            <p>Start your focused work session today</p>
          </div>
          <button className="cta-button" onClick={handleReturn}>
            Launch Workspace
          </button>
        </div>
        <div className="footer-bottom">
          <p>Built with focus and love</p>
          <p>Contact: yourworkspace0@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
