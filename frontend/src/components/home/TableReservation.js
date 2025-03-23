import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight, FiStar, FiUsers } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedTables.css";

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

  return (
    <section className="featured-tables">
      <div className="container">
        <h2 className="section-title">Featured Tables</h2>

        {error ? (
          <div className="error-message">{error}</div>
        ) : loading ? (
          <div className="tables-grid">
            {[...Array(3)].map((_, index) => <SkeletonLoader key={index} />)}
          </div>
        ) : tables.length > 0 ? (
          <Slider {...settings}>
            {tables.map((table) => (
              <div key={table._id} className="table-card-wrapper">
                <div className="table-card">
                  <div className="card-image">
                    <img
                      src={`http://localhost:8080${table.image}`}
                      alt={table.tableName}
                      loading="lazy"
                    />
                    <div className="price-badge">${table.price}/hour</div>
                  </div>
                  <div className="card-content">
                    <h3 className="table-name">{table.tableName}</h3>
                    <div className="table-meta">
                      <div className="meta-item">
                        <FiUsers className="meta-icon" />
                        <span>{table.capacity} Guests</span>
                      </div>
                      <div className="meta-item">
                        <FiStar className="meta-icon" />
                        <span>{table.rating || 4.5}</span>
                      </div>
                    </div>
                    <p className="table-description">{table.description}</p>
                    <button className="book-button">
                      Reserve Table
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="no-tables">No tables available</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedTables;