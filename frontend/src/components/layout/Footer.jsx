import logo from "../../assets/Landing-assets/All-Logos/logo.svg";
import facebookIcon from "../../assets/Landing-assets/All-Icons/Icon-Facebook.svg";
import instagramIcon from "../../assets/Landing-assets/All-Icons/Icon-Instagram.svg";
import linkedinIcon from "../../assets/Landing-assets/All-Icons/Icon-Linkedin.svg";
import whatsappIcon from "../../assets/Landing-assets/All-Icons/Icon-Whatsapp.svg";

function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <a href="/" className="footer-logo">
          <img src={logo} alt="Manag'it logo" />
        </a>

        <ul className="footer-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li className="dot">&middot;</li>
          <li>
            <a href="#about">About</a>
          </li>
          <li className="dot">&middot;</li>
          <li>
            <a href="#features">Features</a>
          </li>
        </ul>

        <div className="footer-socials">
          <a href="/">
            <img src={facebookIcon} alt="Facebook" />
          </a>
          <a href="/">
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a href="/">
            <img src={linkedinIcon} alt="Linkedin" />
          </a>
          <a href="/">
            <img src={whatsappIcon} alt="Whatsapp" />
          </a>
        </div>

        <div className="footer-bottom">
          <p>Minimal & Clean</p>
          <p>&copy; 2026 Manag'it. Designed with clarity</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
