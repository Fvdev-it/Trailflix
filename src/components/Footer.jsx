import "../css/Footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-socials">
        <FaFacebookF />
        <FaInstagram />
        <FaTwitter />
        <FaYoutube />
      </div>

      <div className="footer-links">
        <ul>
          <li>
            <Link to="#">Audiodeskription</Link>
          </li>
          <li>
            <Link to="#">Anlegerbeziehungen</Link>
          </li>
          <li>
            <Link to="#">Datenschutz</Link>
          </li>
          <li>
            <Link to="#">Kontakt</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="#">Hilfe-Center</Link>
          </li>
          <li>
            <Link to="#">Karriere</Link>
          </li>
          <li>
            <Link to="#">Rechtliche Hinweise</Link>
          </li>
          <li>
            <Link to="#">Werbeoptionen</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="#">Geschenkkarten</Link>
          </li>
          <li>
            <Link to="#">Shop</Link>
          </li>
          <li>
            <Link to="#">Cookie-Einstellungen</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="#">Medien-Center</Link>
          </li>
          <li>
            <Link to="#">Nutzungsbedingungen</Link>
          </li>
          <li>
            <Link to="#">Impressum</Link>
          </li>
        </ul>
      </div>

      <button className="footer-button">Service-Code</button>

      <p className="footer-copy">© 2025 fvdev.it. Alle Rechte vorbehalten.</p>
    </footer>
  );
};

export default Footer;
