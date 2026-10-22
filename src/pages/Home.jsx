import { Link } from "@tanstack/react-router";
import heroBackground from "../assets/Landing-assets/All-Graphic-Elements/Hero-BG-Element.png";
import statsImage from "../assets/Landing-assets/All-Graphic-Elements/Stats.png";
import clipboardIcon from "../assets/Landing-assets/All-Icons/Icon-clipboard.svg";
import usersIcon from "../assets/Landing-assets/All-Icons/Icon-users.svg";
import chartIcon from "../assets/Landing-assets/All-Icons/Icon-Circle-chart.svg";
import googleLogo from "../assets/Landing-assets/All-Logos/Logo-Google.svg";
import slackLogo from "../assets/Landing-assets/All-Logos/Logo-Slack.svg";
import microsoftLogo from "../assets/Landing-assets/All-Logos/Logo-Microsoft.svg";
import spotifyLogo from "../assets/Landing-assets/All-Logos/Logo-Spotify.svg";
import adobeLogo from "../assets/Landing-assets/All-Logos/Logo-Adobe.svg";

function Home() {
  return (
    <>
      {/* Hero section */}
      <section className="hero">
        <img src={heroBackground} alt="hero" />
        <div className="hero-overlay">
          <div className="hero-text">
            <p className="hero-sub">Welcome to Manag'it</p>
            <h1 className="hero-title">
              Manage Your Work <br /> Efficiently
            </h1>
            <Link to="/signup" className="cta-btn">
              Let's Start Manage
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted By section */}
      <section className="trusted-by">
        <div className="arrow-down">
          <svg
            width="24"
            height="40"
            viewBox="0 0 24 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="0" x2="12" y2="38" />
            <polyline points="18 32 12 38 6 32" />
          </svg>
        </div>

        <div className="orange-divider" />

        <h2 className="trusted-title">Trusted By</h2>

        <div className="logos-container">
          <img src={googleLogo} alt="Google" />
          <img src={slackLogo} alt="Slack" />
          <img src={microsoftLogo} alt="Microsoft" />
          <img src={spotifyLogo} alt="Spotify" />
          <img src={adobeLogo} alt="Adobe" />
        </div>
      </section>

      {/* About us section */}
      <section id="about" className="about-us">
        <div className="about-container">
          <h2 className="about-title">Who are we ?</h2>

          <div className="about-content-wrapper">
            <div className="about-graph">
              <img src={statsImage} alt="Statistics Graph" />
            </div>

            <div className="about-info">
              <div className="stats-container">
                <div className="stat">
                  <span className="stat-num">120+</span>
                  <span className="stat-text">
                    Projects
                    <br />
                    Completed
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-num">50K+</span>
                  <span className="stat-text">
                    Active
                    <br />
                    Users
                  </span>
                </div>
              </div>

              <p className="about-desc">
                We provide an all-in-one project management platform that simplifies planning,
                improves collaboration, and keeps every project on track. Work smarter, stay
                organized, and deliver results with confidence.
              </p>

              <Link to="/signup" className="btn-start">
                Ready to Start ?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="features">
        <div className="features-container">
          <h2 className="features-title">Our Features</h2>

          <div className="features-grid">
            <div className="feature-card">
              <img src={clipboardIcon} alt="Task Management" className="feature-icon" />
              <p className="feature-desc">
                Organize tasks, set priorities, assign team members, and track progress
                effortlessly.
              </p>
              <div className="feature-divider" />
              <h3 className="feature-name">Smart Task Management</h3>
            </div>

            <div className="feature-card">
              <img src={usersIcon} alt="Real-Time Collaboration" className="feature-icon" />
              <p className="feature-desc">
                Work together seamlessly with shared workspaces, comments, file sharing, and instant
                updates.
              </p>
              <div className="feature-divider" />
              <h3 className="feature-name">Real-Time Collaboration</h3>
            </div>

            <div className="feature-card">
              <img src={chartIcon} alt="Analytics & Reporting" className="feature-icon" />
              <p className="feature-desc">
                Monitor project performance with real-time insights, custom reports, and progress
                dashboards.
              </p>
              <div className="feature-divider" />
              <h3 className="feature-name">Analytics & Reporting</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Let's Build Better Projects Together</h2>
            <p className="cta-desc">
              Bring your team, organize every task, and turn ideas into successful projects
              <br />
              with one powerful platform.
            </p>
            <Link to="/signup" className="btn-join">
              Join us
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
