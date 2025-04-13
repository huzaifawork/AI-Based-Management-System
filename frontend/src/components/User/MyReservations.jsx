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
        console.log("Raw response data:", response.data); // Debug log
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

  const formatTime = (timeString) => {
    console.log("Received time string:", timeString); // Debug log
    
    if (!timeString) {
      console.log("No time string provided");
      return "Not specified";
    }
    
    try {
      // If time is already in 12-hour format, return it
      if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
      }
      
      // Handle 24-hour format (HH:MM)
      const [hours, minutes] = timeString.split(':');
      if (!hours || !minutes) {
        console.log("Invalid time format:", timeString);
        return timeString;
      }
      
      // Create a date object with today's date and the specified time
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      
      // Format the time in 12-hour format
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      console.log("Formatted time:", formattedTime); // Debug log
      return formattedTime;
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
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
          {reservations.map((reservation) => {
            console.log("Rendering reservation:", reservation); // Debug log
            return (
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
                    <span>{formatTime(reservation.time)}</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
