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
  const [bookingSummary, setBookingSummary] = useState({
    nights: 0,
    basePrice: 0,
    taxAmount: 0,
    totalPrice: 0
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-room.jpg';
    try {
      if (imagePath.startsWith('http')) return imagePath;
      const cleanPath = imagePath.replace(/^\/+/, '');
      return cleanPath.includes('uploads') 
        ? `http://localhost:8080/${cleanPath}`
        : `http://localhost:8080/uploads/${cleanPath}`;
    } catch (error) {
      console.error('Error formatting image URL:', error);
      return '/images/placeholder-room.jpg';
    }
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to make a booking');
          navigate('/login');
          return;
        }

        // Fetch all rooms first
        const response = await axios.get('http://localhost:8080/api/rooms', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Find the specific room by ID
        const roomData = response.data.find(room => room._id === id);
        
        if (roomData) {
          setRoom(roomData);
          // Initialize booking summary with room price
          updateBookingSummary(roomData.price, formData.checkInDate, formData.checkOutDate);
        } else {
          throw new Error('Room not found');
        }
      } catch (error) {
        console.error('Error fetching room:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load room details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id, navigate]);

  const updateBookingSummary = (roomPrice, checkIn, checkOut) => {
    if (!roomPrice || !checkIn || !checkOut) {
      setBookingSummary({
        nights: 0,
        basePrice: 0,
        taxAmount: 0,
        totalPrice: 0
      });
      return;
    }

    const nights = calculateNights(checkIn, checkOut);
    const basePrice = roomPrice * nights;
    const taxRate = 0.1; // 10% tax
    const taxAmount = basePrice * taxRate;
    const totalPrice = basePrice + taxAmount;

    setBookingSummary({
      nights,
      basePrice,
      taxAmount,
      totalPrice
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update booking summary when dates change
    if (name === 'checkInDate' || name === 'checkOutDate') {
      updateBookingSummary(
        room?.price,
        name === 'checkInDate' ? value : formData.checkInDate,
        name === 'checkOutDate' ? value : formData.checkOutDate
      );
    }
  };

  const validateBooking = () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return false;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast.error('Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateBooking()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const bookingData = {
        roomId: id,
        roomType: room.roomType,
        roomNumber: room.roomNumber,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: parseInt(formData.guests),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests,
        payment: formData.payment,
        totalPrice: bookingSummary.totalPrice,
        basePrice: bookingSummary.basePrice,
        taxAmount: bookingSummary.taxAmount,
        numberOfNights: bookingSummary.nights
      };

      const response = await axios.post('http://localhost:8080/api/bookings', bookingData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data) {
        toast.success('Booking created successfully!');
        // Pass complete booking data to confirmation page
        navigate('/booking-confirmation', { 
          state: { 
            booking: {
              ...response.data,
              roomType: room.roomType,
              roomNumber: room.roomNumber,
              checkInDate: formData.checkInDate,
              checkOutDate: formData.checkOutDate,
              totalPrice: bookingSummary.totalPrice.toFixed(2),
              basePrice: bookingSummary.basePrice.toFixed(2),
              taxAmount: bookingSummary.taxAmount.toFixed(2),
              numberOfNights: bookingSummary.nights,
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              guests: formData.guests,
              payment: formData.payment,
              specialRequests: formData.specialRequests
            }
          }
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create booking. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="booking-page">
          <div className="container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading room details...</p>
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
            <div className="error-message">{error}</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="booking-page">
        <div className="container">
          <div className="booking-container">
            {/* Room Details Card */}
            <div className="room-details-card">
              <div className="room-image-container">
                <img
                  src={getImageUrl(room?.image)}
                  alt={room?.roomType}
                  className="room-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-room.jpg';
                    e.target.onerror = null;
                  }}
                />
                <div className="price-badge">
                  ${room?.price}<small>/night</small>
                </div>
              </div>
              
              <div className="room-info">
                <h1 className="room-title">{room?.roomType}</h1>
                <div className="room-rating">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="star-icon" />
                  ))}
                </div>
                <div className="room-description">
                  <h3>Description</h3>
                  <p>{room?.description}</p>
                </div>
                <div className="room-details-info">
                  <h3>Room Details</h3>
                  <ul>
                    <li>Room Number: {room?.roomNumber}</li>
                    <li>Max Guests: {room?.maxGuests || 2}</li>
                    <li>Status: {room?.status}</li>
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
                    <label><FiCalendar /> Check-in Date *</label>
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
                    <label><FiCalendar /> Check-out Date *</label>
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
                    <label><FiUser /> Number of Guests *</label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      min="1"
                      max={room?.maxGuests || 4}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FiUser /> Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FiMail /> Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FiPhone /> Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Payment Method *</label>
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
                    placeholder="Any special requests or requirements?"
                    rows="3"
                  />
                </div>

                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <div className="summary-item">
                    <span>Room Type:</span>
                    <span>{room?.roomType}</span>
                  </div>
                  <div className="summary-item">
                    <span>Room Number:</span>
                    <span>{room?.roomNumber}</span>
                  </div>
                  <div className="summary-item">
                    <span>Price per Night:</span>
                    <span>${room?.price}</span>
                  </div>
                  <div className="summary-item">
                    <span>Number of Nights:</span>
                    <span>{bookingSummary.nights}</span>
                  </div>
                  <div className="summary-item">
                    <span>Base Price:</span>
                    <span>${bookingSummary.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Tax (10%):</span>
                    <span>${bookingSummary.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total Price:</span>
                    <span>${bookingSummary.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="book-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-small"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard /> Book Now
                    </>
                  )}
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
