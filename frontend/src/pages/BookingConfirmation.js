import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCalendar, FiUser, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageLayout from '../components/layout/PageLayout';
import Heading from '../components/common/Heading';
import './BookingConfirmation.css';
import { Link } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    toast.error('No booking information found');
    navigate('/');
    return null;
  }

  return (
    <PageLayout>
      <div className="booking-confirmation theme-bg-gradient text-light py-5">
     
        
        <div className="container ">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="confirmation-card theme-card p-4">
                <div className="text-center mb-4">
                  <FiCheckCircle className="success-icon" />
                  <h2 className="text-accent mt-3">Booking Confirmed!</h2>
                  <p className="text-light">Your booking has been successfully processed.</p>
                </div>

                <div className="booking-details">
                  <h3 className="text-accent mb-3">Booking Details</h3>
                  <div className="detail-item">
                    <FiCalendar className="me-2" />
                    <span>Check-in Date:</span>
                    <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <FiCalendar className="me-2" />
                    <span>Check-out Date:</span>
                    <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <FiUser className="me-2" />
                    <span>Room Type:</span>
                    <span>{booking.roomType}</span>
                  </div>
                  <div className="detail-item">
                    <FiUser className="me-2" />
                    <span>Room Number:</span>
                    <span>{booking.roomNumber}</span>
                  </div>
                  <div className="detail-item">
                    <FiCreditCard className="me-2" />
                    <span>Total Price:</span>
                    <span>${booking.totalPrice}</span>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <p className="text-light mb-3">
                    Thank you for choosing our hotel. We look forward to your stay!
                  </p>
                  <Link to="/rooms" className="carousel-btn primary">
                    View Room <FiArrowRight className="ms-2" />
                  </Link>
                  <button 
                    className="btn theme-button-outline"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
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