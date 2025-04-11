import React from 'react';
import { FiAward, FiUsers, FiCoffee, FiMapPin } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';
import '../styles/theme.css';

const AboutUs = () => {
  const features = [
    {
      icon: <FiAward />,
      title: 'Award Winning',
      description: 'Recognized for excellence in hospitality and service'
    },
    {
      icon: <FiUsers />,
      title: 'Expert Team',
      description: 'Professional staff dedicated to your comfort'
    },
    {
      icon: <FiCoffee />,
      title: 'Premium Amenities',
      description: 'World-class facilities and services'
    },
    {
      icon: <FiMapPin />,
      title: 'Prime Location',
      description: 'Centrally located with easy access to attractions'
    }
  ];

  return (
    <PageLayout>
      <div className="page-header animate-fade-in">
        <h1 className="page-title">About Our Hotel</h1>
        <p className="page-subtitle">
          Experience luxury and comfort in the heart of the city
        </p>
      </div>

      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">Our Story</h2>
            <p className="section-description">
              Founded in 2005, our hotel has been providing exceptional hospitality services
              to guests from around the world. We pride ourselves on creating memorable
              experiences through our attention to detail and commitment to excellence.
            </p>
            <p className="section-description">
              Our mission is to provide a home away from home, where every guest feels
              valued and cared for. We continuously strive to exceed expectations and
              set new standards in the hospitality industry.
            </p>
          </div>

          <div className="about-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutUs;
