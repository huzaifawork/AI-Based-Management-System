import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiCalendar, FiUser, FiMail, FiPhone, FiCreditCard, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageLayout from '../components/layout/PageLayout';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
    payment: 'card'
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-room.jpg';
    
    try {
      if (imagePath.startsWith('http')) return imagePath;
      const cleanPath = imagePath.replace(/^\/+/, '');
      
      if (cleanPath.includes('uploads')) {
        return `http://localhost:8080/${cleanPath}`;
      }
      return `http://localhost:8080/uploads/${cleanPath}`;
    } catch (error) {
      console.error('Error formatting image URL:', error);
      return '/images/placeholder-room.jpg';
    }
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/rooms');
        const roomData = response.data.find(room => room._id === id);
        
        if (roomData) {
          console.log('Room data:', roomData);
          setRoom(roomData);
        } else {
          setError('Room not found');
          toast.error('Room not found. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching room:', error);
        setError('Failed to load room details. Please try again.');
        toast.error('Failed to load room details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const start = new Date(formData.checkInDate);
      const end = new Date(formData.checkOutDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to make a booking');
        return;
      }

      const bookingData = {
        roomId: id,
        roomType: room.roomType,
        roomNumber: room.roomNumber,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.guests,
        payment: formData.payment,
        totalPrice: room.price * calculateNights()
      };

      const response = await axios.post('http://localhost:8080/api/bookings', bookingData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data) {
        toast.success('Booking created successfully!');
        navigate('/booking-confirmation', { state: { booking: response.data.booking } });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create booking. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="booking-page">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="booking-page">
          <div className="container">
            <div className="alert alert-danger">{error}</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="booking-page">
        <div className="container py-4">
          <div className="booking-container">
            {/* Room Details Card */}
            <div className="room-details-card">
              <div className="room-image-container">
                <img
                  src={getImageUrl(room.image)}
                  alt={room.roomType}
                  className="room-image"
                  onError={(e) => {
                    console.error('Error loading image:', room.image);
                    e.target.src = '/images/placeholder-room.jpg';
                    e.target.onerror = null;
                  }}
                />
                <div className="price-badge">
                  ${room.price}<small>/night</small>
                </div>
              </div>
              
              <div className="room-info">
                <h1 className="room-title">{room.roomType}</h1>
                <div className="room-rating">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="star-icon" />
                  ))}
                </div>
                <div className="room-description">
                  <h3>Description</h3>
                  <p>{room.description}</p>
                </div>
                <div className="room-details-info">
                  <h3>Room Details</h3>
                  <ul>
                    <li>Room Number: {room.roomNumber}</li>
                    <li>Status: {room.status}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Booking Form Card */}
            <div className="booking-form-card">
              <h2>Book Your Stay</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label><FiCalendar /> Check-in Date</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FiCalendar /> Check-out Date</label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FiUser /> Number of Guests</label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      min="1"
                      max="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FiUser /> Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FiMail /> Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FiPhone /> Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                    required
                  >
                    <option value="card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <div className="summary-item">
                    <span>Room Type:</span>
                    <span>{room.roomType}</span>
                  </div>
                  <div className="summary-item">
                    <span>Room Number:</span>
                    <span>{room.roomNumber}</span>
                  </div>
                  <div className="summary-item">
                    <span>Price per Night:</span>
                    <span>${room.price}</span>
                  </div>
                  <div className="summary-item">
                    <span>Number of Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total Price:</span>
                    <span>${room.price * calculateNights()}</span>
                  </div>
                </div>

                <button type="submit" className="book-button">
                  <FiCreditCard /> Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BookingPage;
