import React from "react";
import { FiSend } from "react-icons/fi";
import "./Newsletter.css"; // Create this CSS file

export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-card">
          <div className="newsletter-content">
            <h4 className="newsletter-heading">
              Stay Updated with Our{" "}
              <span className="gradient-text">Newsletter</span>
            </h4>
            
            <form className="newsletter-form">
              <div className="input-wrapper">
                <input
                  type="email"
                  className="modern-input"
                  placeholder="Enter your email"
                  required
                />
                <button type="submit" className="submit-button">
                  <FiSend className="button-icon" />
                  Subscribe
                </button>
              </div>
            </form>

            <div className="animated-border"></div>
          </div>
        </div>
      </div>
    </section>
  );
}