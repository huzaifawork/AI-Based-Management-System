import React from "react";
import { about } from "../data/Data";
import { FiArrowUpRight } from "react-icons/fi";
import "./About.css"; // Create this CSS file
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="about-section">
      <div className="container">
        <div className="content-grid">
          {/* Text Content */}
          <div className="text-content">
            <h6 className="section-subtitle">About Us</h6>
            <h1 className="section-title">
              Welcome to <span className="text-accent">HRMS</span>
            </h1>
            <p className="description">
              HRMS is a comprehensive platform designed to simplify hotel and
              restaurant management, enabling seamless operations and
              exceptional customer experiences.
            </p>

            {/* Stats Grid */}
            <div className="stats-grid">
              {about.map((item, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{item.icon}</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{item.count}</h3>
                    <p className="stat-text">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/about" className="cta-button">
              Explore More
              <FiArrowUpRight className="cta-icon" />
            </Link>
          </div>

          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="gallery-grid">
              <div className="gallery-item main-image">
                <img
                  src="/assets/img/about-1.jpg"
                  alt="HRMS interface"
                  loading="lazy"
                />
                <div className="image-overlay" />
              </div>
              <div className="gallery-item secondary-image">
                <img
                  src="/assets/img/about-2.jpg"
                  alt="Analytics dashboard"
                  loading="lazy"
                />
              </div>
              <div className="gallery-item tertiary-image">
                <img
                  src="/assets/img/about-3.jpg"
                  alt="Mobile app"
                  loading="lazy"
                />
              </div>
              <div className="gallery-item quaternary-image">
                <img
                  src="/assets/img/about-4.jpg"
                  alt="Team collaboration"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}