import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonHeading from "../common/CommonHeading";
import { facility } from "../data/Data";
import { FiStar, FiInfo, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Rooms.css"; // Create this CSS file

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rooms");
        setRooms(response.data);
      } catch (error) {
        setError("Failed to load rooms. Please try again.");
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="col-lg-4 col-md-6">
      <div className="room-item skeleton">
        <div className="image-placeholder"></div>
        <div className="content-placeholder">
          <div className="title-placeholder"></div>
          <div className="text-placeholder"></div>
          <div className="button-placeholder"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="rooms-section">
      <div className="container">
        <CommonHeading 
          heading="Our Accommodations" 
          title="Rooms & Suites" 
          subtitle="Luxurious Stays"
        />
        
        {error && (
          <div className="error-alert">
            <FiInfo className="alert-icon" />
            {error}
          </div>
        )}

        <div className="rooms-grid">
          {loading ? (
            Array(3)
              .fill()
              .map((_, index) => <SkeletonLoader key={index} />)
          ) : (
            rooms.map((room) => (
              <article key={room._id} className="room-card">
                <div className="card-image">
                  <img
                    src={`http://localhost:8080/${room.image}`}
                    alt={room.roomName}
                    loading="lazy"
                    className="room-image"
                  />
                  <div className="price-badge">
                    <span>${room.price}</span>
                    <small>/night</small>
                  </div>
                </div>

                <div className="card-content">
                  <div className="room-header">
                    <h3 className="room-title">{room.roomName}</h3>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="star-icon" />
                      ))}
                    </div>
                  </div>

                  <p className="room-description">{room.description}</p>

                  <div className="facilities-grid">
                    {facility.map((fac, index) => (
                      <div key={index} className="facility-item">
                        {fac.icon}
                        <span className="facility-text">
                          {fac.quantity} {fac.facility}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="card-actions">
                    <Link to={`/book-room/${room._id}`} className="primary-action">
                      <FiShoppingCart className="action-icon" />
                      Book Now
                    </Link>
                    <Link to={`/room-details/${room._id}`} className="secondary-action">
                      Explore Suite
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
