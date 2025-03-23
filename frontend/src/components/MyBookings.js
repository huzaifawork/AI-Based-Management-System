import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiHome, FiCalendar, FiUsers, FiDollarSign, FiCreditCard, FiEdit2, FiTrash2 } from "react-icons/fi";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/bookings/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookings.filter(booking => booking._id !== bookingId));
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading-spinner">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">My Room Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3 className="room-name">{booking.roomType}</h3>
                <span className="booking-status">Confirmed</span>
              </div>
              
              <div className="booking-details">
                <div className="detail-item">
                  <FiHome className="detail-icon" />
                  <span>Room {booking.roomNumber}</span>
                </div>
                
                <div className="detail-item">
                  <FiCalendar className="detail-icon" />
                  <span>{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</span>
                </div>
                
                <div className="detail-item">
                  <FiUsers className="detail-icon" />
                  <span>{booking.guests} Guests</span>
                </div>
                
                <div className="detail-item">
                  <FiDollarSign className="detail-icon" />
                  <span>${booking.totalPrice}</span>
                </div>

                <div className="detail-item">
                  <FiCreditCard className="detail-icon" />
                  <span>{booking.payment === 'card' ? 'Credit Card' : 'PayPal'}</span>
                </div>
              </div>
              
              <div className="booking-footer">
                <button 
                  className="cancel-button"
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  <FiTrash2 className="me-2" /> Cancel
                </button>
                <button 
                  className="modify-button"
                  onClick={() => navigate(`/book-room?edit=${booking._id}`)}
                >
                  <FiEdit2 className="me-2" /> Modify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings; 