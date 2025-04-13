import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCalendar, FiUser, FiCreditCard, FiArrowRight, FiMail, FiPhone, FiInfo, FiHome } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageLayout from '../components/layout/PageLayout';
import './BookingConfirmation.css';
import { Link } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  React.useEffect(() => {
    if (!booking) {
      toast.error('No booking information found');
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <PageLayout>
      <div className="booking-confirmation">
        <div className="confirmation-container">
          <div className="confirmation-card">
            <div className="confirmation-header">
              <FiCheckCircle className="confirmation-icon" />
              <h1>Booking Confirmed!</h1>
              <p>Your booking has been successfully processed.</p>
            </div>

            <div className="booking-content">
              {/* Left Column - Booking Details */}
              <div className="booking-details">
                <div className="details-section">
                  <h2><FiCalendar /> Stay Information</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Check-in</span>
                      <span className="detail-value">{new Date(booking.checkInDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Check-out</span>
                      <span className="detail-value">{new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Number of Nights</span>
                      <span className="detail-value">{booking.numberOfNights}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Guests</span>
                      <span className="detail-value">{booking.guests} {booking.guests === 1 ? 'Person' : 'People'}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h2><FiInfo /> Room Information</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Room Type</span>
                      <span className="detail-value">{booking.roomType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Room Number</span>
                      <span className="detail-value">{booking.roomNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h2><FiUser /> Guest Information</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Full Name</span>
                      <span className="detail-value">{booking.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{booking.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{booking.phone}</span>
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="details-section">
                    <h2><FiInfo /> Special Requests</h2>
                    <div className="special-requests">
                      <p>{booking.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Summary and Actions */}
              <div className="booking-summary">
                <div className="summary-card">
                  <h3><FiCreditCard /> Payment Summary</h3>
                  <div className="summary-item">
                    <span className="summary-label">Base Price</span>
                    <span className="summary-value">${booking.basePrice}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Tax Amount</span>
                    <span className="summary-value">${booking.taxAmount}</span>
                  </div>
                  <div className="summary-item summary-total">
                    <span className="summary-label">Total Price</span>
                    <span className="summary-value">${booking.totalPrice}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Payment Method</span>
                    <span className="summary-value">{booking.payment === 'card' ? 'Credit Card' : 'PayPal'}</span>
                  </div>
                </div>

                <div className="confirmation-actions">
                  <Link to="/my-bookings" className="action-button primary-action">
                    View My Bookings <FiArrowRight />
                  </Link>
                  <button 
                    className="action-button secondary-action"
                    onClick={() => navigate('/')}
                  >
                    <FiHome /> Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BookingConfirmation; 