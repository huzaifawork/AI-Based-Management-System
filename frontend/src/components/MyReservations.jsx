import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiUsers, FiDollarSign, FiClock } from "react-icons/fi";
import "./MyReservations.css";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/reservations/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Failed to load reservations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="reservations-container">
        <div className="loading-spinner">Loading reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservations-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="reservations-container">
      <h2 className="reservations-title">My Reservations</h2>
      
      {reservations.length === 0 ? (
        <div className="no-reservations">
          <p>No reservations found.</p>
        </div>
      ) : (
        <div className="reservations-grid">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="reservation-card">
              <div className="reservation-header">
                <h3 className="table-name">Table {reservation.tableNumber}</h3>
                <span className="reservation-status">Confirmed</span>
              </div>
              
              <div className="reservation-details">
                <div className="detail-item">
                  <FiCalendar className="detail-icon" />
                  <span>{formatDate(reservation.reservationDate)}</span>
                </div>
                
                <div className="detail-item">
                  <FiClock className="detail-icon" />
                  <span>{reservation.time || "Not specified"}</span>
                </div>
                
                <div className="detail-item">
                  <FiUsers className="detail-icon" />
                  <span>{reservation.guests} Guests</span>
                </div>
                
                <div className="detail-item">
                  <FiDollarSign className="detail-icon" />
                  <span>${reservation.totalPrice}</span>
                </div>
              </div>
              
              <div className="reservation-footer">
                <button className="cancel-button">Cancel Reservation</button>
                <button className="modify-button">Modify</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
