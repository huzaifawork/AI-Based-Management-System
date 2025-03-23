import React from "react";
import { FiMapPin, FiPhone, FiMail, FiTwitter, FiInstagram, FiFacebook, FiLinkedin } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Main Content */}
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="brand-section">
            <h3 className="footer-logo">Night Elegance</h3>
            <p className="brand-statement">
              Experience luxury like never before. Stay, dine, and unwind in the heart of elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="links-section">
            <h4 className="section-title">Quick Navigation</h4>
            <ul className="footer-links">
              {["Rooms & Suites", "Dining", "Spa", "Events", "Special Offers"].map((link, index) => (
                <li key={index}>
                  <a href="#" className="footer-link">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="services-section">
            <h4 className="section-title">Our Services</h4>
            <ul className="footer-services">
              {["24/7 Room Service", "Airport Transfer", "Spa Treatments", "Concierge"].map((service, index) => (
                <li key={index}>
                  <a href="#" className="footer-link">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="contact-section">
            <h4 className="section-title">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiMapPin className="contact-icon" />
                <span>123 Luxury Avenue, Prestige District</span>
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FiMail className="contact-icon" />
                <span>info@nightelegance.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter & Socials */}
        <div className="newsletter-socials">
          <div className="newsletter-section">
            <h4 className="section-title">Stay Updated</h4>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input" 
              />
              <button className="newsletter-button">
                Subscribe
              </button>
            </div>
          </div>
          
          <div className="social-section">
            <div className="social-icons">
              <a href="#" aria-label="Twitter" className="social-link">
                <FiTwitter className="social-icon" />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <FiInstagram className="social-icon" />
              </a>
              <a href="#" aria-label="Facebook" className="social-link">
                <FiFacebook className="social-icon" />
              </a>
              <a href="#" aria-label="LinkedIn" className="social-link">
                <FiLinkedin className="social-icon" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} Night Elegance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;