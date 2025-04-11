import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight, FiStar, FiUsers, FiClock, FiMapPin, FiCalendar, FiInfo } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedTables.css";
import "./TableReservation.css";

const FeaturedTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tables");
      setTables(response.data);
    } catch (error) {
      setError("Failed to load tables. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const NextArrow = ({ onClick }) => (
    <button className="slick-arrow next" onClick={onClick}>
      <FiChevronRight />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button className="slick-arrow prev" onClick={onClick}>
      <FiChevronLeft />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: Math.min(3, tables.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, tables.length),
          arrows: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false
        }
      }
    ]
  };

  const SkeletonLoader = () => (
    <div className="table-card skeleton">
      <div className="image-placeholder"></div>
      <div className="content-placeholder">
        <div className="title-placeholder"></div>
        <div className="detail-placeholder"></div>
        <div className="detail-placeholder"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="error-alert">
        <FiInfo className="error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="section">
        <h2 className="section-title">Featured Tables</h2>
        <div className="tables-grid">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="card skeleton">
              <div className="image-placeholder" />
              <div className="content-placeholder">
                <div className="title-placeholder" />
                <div className="text-placeholder" />
                <div className="text-placeholder" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="section">
        <h2 className="section-title">Featured Tables</h2>
        <div className="no-tables">No tables available at the moment.</div>
      </div>
    );
  }

  return (
    <section className="section">
      <h2 className="section-title">Featured Tables</h2>
      <div className="tables-grid">
        {tables.map((table) => (
          <div key={table._id} className="card">
            <div className="card-image">
              <img
                src={`http://localhost:8080${table.image}`}
                alt={table.tableName}
                className="table-image"
              />
              <div className="price-badge">${table.price}/hour</div>
            </div>
            <div className="card-content">
              <div className="table-header">
                <h3 className="table-title">{table.tableName}</h3>
                <div className="capacity">
                  <FiUsers />
                  <span>{table.capacity} seats</span>
                </div>
              </div>
              <p className="table-description">{table.description}</p>
              <div className="table-details">
                <div className="detail-item">
                  <FiMapPin />
                  <span>{table.location}</span>
                </div>
                <div className="detail-item">
                  <FiClock />
                  <span>{table.availability}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn btn-primary">Reserve Now</button>
                <button className="btn btn-outline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedTables;