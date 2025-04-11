import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';
import './TableConfirmationPage.css';

const TableConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation } = location.state || {};

  if (!reservation) {
    return (
      <PageLayout>
        <div className="confirmation-container">
          <div className="error-message">
            <h2>No reservation details found</h2>
            <p>Please make a reservation first</p>
            <button onClick={() => navigate('/reserve-table')} className="btn btn-primary">
              Make a Reservation
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <FiCheckCircle className="success-icon" />
            <h2>Reservation Confirmed!</h2>
            <p>Your table has been successfully reserved</p>
          </div>

          <div className="confirmation-details">
            <div className="detail-item">
              <FiCalendar className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Date</span>
                <span className="detail-value">{new Date(reservation.reservationDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="detail-item">
              <FiClock className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Time</span>
                <span className="detail-value">{reservation.time}</span>
              </div>
            </div>

            <div className="detail-item">
              <FiUsers className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Number of Guests</span>
                <span className="detail-value">{reservation.guests}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-content">
                <span className="detail-label">Table</span>
                <span className="detail-value">{reservation.tableNumber}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button onClick={() => navigate('/my-reservations')} className="btn btn-primary">
              View My Reservations
            </button>
            <button onClick={() => navigate('/')} className="btn btn-outline">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TableConfirmationPage; 