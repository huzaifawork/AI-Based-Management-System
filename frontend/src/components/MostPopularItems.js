import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MostPopularItems.css";

const MostPopularItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/menus");
      setMenuItems(response.data);
    } catch (error) {
      setError("Error fetching menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Slick Carousel Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Auto-slide every 3 sec
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const SkeletonLoader = () => (
    <div className="menu-item skeleton">
      <div className="image-placeholder"></div>
      <div className="content-placeholder">
        <div className="title-placeholder"></div>
        <div className="text-placeholder"></div>
        <div className="price-placeholder"></div>
      </div>
    </div>
  );

  return (
    <section className="popular-items-section">
      <div className="container">
        <h2 className="section-title">
          Most Popular <span className="text-accent">Items</span>
        </h2>

        {loading && (
          <div className="items-grid">
            {[...Array(3)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        )}

        {error && (
          <div className="error-alert">
            <p>{error}</p>
          </div>
        )}

        {menuItems.length > 3 ? (
          <div className="items-slider">
            <Slider {...settings}>
              {menuItems.map((item) => (
                <div key={item._id} className="menu-item">
                  <div className="item-image">
                    <img
                      src={item.image || "https://via.placeholder.com/200"}
                      alt={item.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="item-content">
                    <h3 className="item-title">{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="items-grid">
            {menuItems.map((item) => (
              <div key={item._id} className="menu-item">
                <div className="item-image">
                  <img
                    src={item.image || "https://via.placeholder.com/200"}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>
                <div className="item-content">
                  <h3 className="item-title">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MostPopularItems;
