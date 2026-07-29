function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <a href="/" className="footer-logo">
          <img
            src="/assets/Landing-assets/Landing-assets/All-Logos/logo.svg"
            alt="Manag'it logo"
          />
        </a>

        <ul className="footer-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li className="dot">&middot;</li>
          <li>
            <a href="/">About</a>
          </li>
          <li className="dot">&middot;</li>
          <li>
            <a href="/">Features</a>
          </li>
        </ul>

        <div className="footer-socails">
          <a href="/">
            <img
              src="/assets/Landing-assets/Landing-assets/All-Icons/Icon-Facebook.svg"
              alt="Facebook"
            />
          </a>
          <a href="/">
            <img
              src="/assets/Landing-assets/Landing-assets/All-Icons/Icon-Instagram.svg"
              alt="Instagram"
            />
          </a>
          <a href="/">
            <img
              src="/assets/Landing-assets/Landing-assets/All-Icons/Icon-Linkedin.svg"
              alt="Linkedin"
            />
          </a>
          <a href="/">
            <img
              src="/assets/Landing-assets/Landing-assets/All-Icons/Icon-Whatsapp.svg"
              alt="Whatsapp"
            />
          </a>
        </div>

        <div className="footer-bottom">
          <p>Minimal & Clean</p>
          <p>&copy; 2026 Manag'it. Designed with clarity</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
