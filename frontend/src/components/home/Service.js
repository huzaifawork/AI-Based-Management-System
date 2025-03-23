import React from "react";
import CommonHeading from "../common/CommonHeading";
import { services } from "../data/Data";
import { FiArrowUpRight } from "react-icons/fi";
import "./Services.css"; // Create this CSS file

export default function Services() {
  return (
    <section className="services-section">
      <div className="container">
        <CommonHeading 
          heading="Our Expertise" 
          title="Services" 
          subtitle="Premium Offerings"
          alignment="center"
        />
        
        <div className="services-grid">
          {services.map((item, index) => (
            <article className="service-card" key={index}>
              <div className="card-inner">
                <div className="icon-wrapper">
                  <div className="icon-backdrop">
                    {item.icon}
                  </div>
                </div>
                <h3 className="service-title">{item.name}</h3>
                <p className="service-description">{item.discription}</p>
                <div className="hover-indicator">
                  <FiArrowUpRight className="arrow-icon" />
                </div>
              </div>
              <div className="card-overlay"></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}