import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiUsers, FiMapPin, FiClock, FiInfo, FiArrowRight } from "react-icons/fi";
import "./TableReservation.css";

const TableReservation = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tables");
      setTables(response.data.slice(0, 3)); // Only show first 3 tables
    } catch (error) {
      setError("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="tables-section">
        <div className="container">
          <div className="section-header">
            <h6 className="section-subtitle">Our Tables</h6>
            <h2 className="section-title">Featured Dining Spaces</h2>
          </div>
          <div className="tables-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="table-card">
                <div className="skeleton-loader">
                  <div className="skeleton-image" />
                  <div className="skeleton-content">
                    <div className="skeleton-title" />
                    <div className="skeleton-text" />
                    <div className="skeleton-text" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tables-section">
        <div className="container">
          <div className="alert alert-warning d-flex align-items-center">
            <FiInfo className="me-2" />
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tables-section">
      <div className="container">
        <div className="section-header">
          <h6 className="section-subtitle">Our Tables</h6>
          <h2 className="section-title">Featured Dining Spaces</h2>
        </div>

        <div className="tables-grid">
          {tables.map((table) => (
            <div key={table._id} className="table-card">
              <div className="image-wrapper">
                <img
                  src={`http://localhost:8080${table.image}`}
                  alt={table.tableName}
                  className="table-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/placeholder-table.jpg";
                    e.target.onerror = null;
                  }}
                />
                <div className="image-overlay" />
                <div className="price-badge">
                  ${table.price}<small>/hour</small>
                </div>
              </div>
              
              <div className="card-body">
                <h3 className="table-title">{table.tableName}</h3>
                
                <div className="table-features">
                  <div className="feature">
                    <FiUsers className="feature-icon" />
                    <span>{table.capacity} seats</span>
                  </div>
                  <div className="feature">
                    <FiMapPin className="feature-icon" />
                    <span>{table.location}</span>
                  </div>
                  <div className="feature">
                    <FiClock className="feature-icon" />
                    <span>{table.availability}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <Link to="/reserve-table" className="btn btn-primary">
                    Reserve Table
                    <FiArrowRight className="ms-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="text-center py-5">
            <FiInfo size={48} className="text-muted mb-3" />
            <h3 className="h5">No tables available</h3>
            <p className="text-muted">Please check back later</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TableReservation;