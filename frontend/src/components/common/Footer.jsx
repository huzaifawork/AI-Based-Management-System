import { Link } from "react-router-dom";
import { footerContact, footerItem, socialIcons } from "../data/Data";
import Newsletter from "../home/Newsletter";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <Newsletter />
      
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="brand-link">
              <span className="text-accent">HR</span>
              <span className="text-light">MS</span>
            </Link>
            <p className="brand-description">
              Transform your hotel's online presence with our cutting-edge 
              management solutions and captivating web experiences.
            </p>
          </div>

          {/* Contact Column */}
          <div className="footer-contact">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="contact-list">
              {footerContact.map((item, index) => (
                <li key={index} className="contact-item">
                  {item.icon === "map" && <FiMapPin className="contact-icon" />}
                  {item.icon === "phone" && <FiPhone className="contact-icon" />}
                  {item.icon === "email" && <FiMail className="contact-icon" />}
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="links-list">
              {footerItem.map((item, index) => (
                <li key={index}>
                  <Link to={item.path} className="link-item">
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            <h3 className="footer-title">Follow Us</h3>
            <div className="social-icons">
              {socialIcons.map((icon, index) => {
                const IconComponent = {
                  facebook: FiFacebook,
                  twitter: FiTwitter,
                  instagram: FiInstagram,
                  linkedin: FiLinkedin,
                }[icon.name];

                return (
                  <a
                    key={index}
                    href={icon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} HRMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}