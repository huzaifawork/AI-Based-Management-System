import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiStar, FiInfo, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import "./MostPopularItems.css";

const MostPopularItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/menus");
      // Get top 3 items with highest ratings/popularity
      const topItems = response.data
        .sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
        .slice(0, 3);
      setMenuItems(topItems);
    } catch (error) {
      setError("Error fetching menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderRating = (rating = 4.5) => {
    return (
      <div className="rating-badge">
        <FiStar /> {rating.toFixed(1)}
      </div>
    );
  };

  const SkeletonLoader = () => (
    <div className="menu-item">
      <div className="skeleton-loader">
        <div className="skeleton-image" />
        <div className="skeleton-content">
          <div className="skeleton-title" />
          <div className="skeleton-text" />
          <div className="skeleton-text" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="popular-items-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Most Popular <span className="text-accent">Items</span>
          </h2>
        </div>

        {error && (
          <div className="error-alert">
            <FiInfo />
            {error}
          </div>
        )}

        <div className="items-grid">
          {loading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : (
            menuItems.map((item) => (
              <div key={item._id} className="menu-item">
                <div className="image-wrapper">
                  <img
                    src={item.image || "/images/placeholder-food.jpg"}
                    alt={item.name}
                    className="item-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-food.jpg";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="image-overlay" />
                  {renderRating(item.rating || 4.5)}
                  <div className="price-badge">
                    ${item.price?.toFixed(2)}
                  </div>
                </div>
                <div className="item-content">
                  <div className="content-wrapper">
                    <h3 className="item-title">{item.name}</h3>
                    <p className="item-description">
                      {item.description || "Delicious menu item"}
                    </p>
                  </div>
                  <div className="item-actions">
                    <Link to="/order-food" className="btn btn-primary">
                      <FiShoppingCart className="btn-icon" />
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && menuItems.length > 0 && (
          <div className="text-center mt-4">
            <Link to="/order-food" className="view-all-btn">
              View All Menu Items <FiArrowRight />
            </Link>
          </div>
        )}

        {!loading && menuItems.length === 0 && (
          <div className="empty-state">
            <FiInfo size={48} className="empty-icon" />
            <h3>No items available</h3>
            <p>Please check back later</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MostPopularItems;
