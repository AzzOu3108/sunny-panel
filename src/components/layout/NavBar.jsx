import { useState } from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); 
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-pill">
          <Link to="/" className="logo">
            <img
              src="/assets/Landing-assets/Landing-assets/All-Logos/logo.svg"
              alt="Manag'it"
            />
          </Link>

          <div className={`nav-content${menuOpen ? ' active' : ''}`}>
            <ul className="nav-links">
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" onClick={() => setMenuOpen(false)}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" onClick={() => setMenuOpen(false)}>
                  Contact Us
                </a>
              </li>
            </ul>

            <div className="auth-section">
              <Link
                to="/login"
                className="login-link"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-signup"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>

          <div
            className={`menu-toggle${menuOpen ? ' active' : ''}`}
            id="mobile-menu"
            onClick={toggleMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar
