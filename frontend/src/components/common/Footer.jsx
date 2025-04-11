import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="brand-link">Hotel Name</a>
            <p className="brand-description">
              Experience luxury and comfort at our premier hotel. Book your stay today and enjoy world-class amenities and services.
            </p>
          </div>

          <div className="footer-contact">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="contact-list">
              <li className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>info@hotelname.com</span>
              </li>
              <li className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Hotel Street, City, Country</span>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="links-list">
              <li><a href="/" className="link-item">Home</a></li>
              <li><a href="/rooms" className="link-item">Rooms</a></li>
              <li><a href="/restaurant" className="link-item">Restaurant</a></li>
              <li><a href="/amenities" className="link-item">Amenities</a></li>
              <li><a href="/contact" className="link-item">Contact</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h3 className="footer-title">Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Hotel Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;