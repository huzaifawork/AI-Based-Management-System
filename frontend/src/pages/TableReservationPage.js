import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiMail, FiPhone, FiClock, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageLayout from '../components/layout/PageLayout';
import Heading from '../components/common/Heading';
import './TableReservationPage.css';

const TableReservationPage = () => {
  const navigate = useNavigate();
  const [tableDetails, setTableDetails] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  useEffect(() => {
    const storedDetails = localStorage.getItem('reservationDetails');
    if (!storedDetails) {
      toast.error('No table selected. Please select a table first.');
      navigate('/reserve-table');
      return;
    }

    const details = JSON.parse(storedDetails);
    setTableDetails(details);
    setFormData(prev => ({
      ...prev,
      date: details.date,
      time: details.time,
      guests: details.guests
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to make a reservation');
        navigate('/login');
        return;
      }

      // Calculate total price (you can adjust this based on your pricing logic)
      const totalPrice = tableDetails.tableCapacity * 10; // Example: $10 per seat

      const reservationData = {
        tableId: tableDetails.tableId,
        tableNumber: tableDetails.tableName,
        reservationDate: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        payment: "card", // Default payment method
        totalPrice: totalPrice,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests
      };

      console.log("Sending reservation data:", reservationData); // Debug log

      const response = await axios.post('http://localhost:8080/api/reservations', reservationData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        toast.success('Table reservation created successfully!');
        localStorage.removeItem('reservationDetails');
        navigate('/table-confirmation', { state: { reservation: response.data.reservation } });
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create reservation. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (!tableDetails) {
    return null;
  }

  return (
    <PageLayout>
      <div className="reservation-page theme-bg-gradient text-light py-5">
        <Heading heading="Reserve Your Table" title="Home" subtitle="Reservation" />
        
        <div className="container mt-4">
          <div className="row">
            {/* Left side - Table Details */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="reservation-form theme-card p-4 h-100">
                <div className="table-image-container mb-4">
                  <img 
                    src={`http://localhost:8080/${tableDetails.tableImage}`}
                    alt={tableDetails.tableName}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="table-details">
                  <h3 className="text-accent mb-3">{tableDetails.tableName}</h3>
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="text-warning" size={16} />
                      ))}
                    </div>
                    <span className="text-light">5.0 (120 reviews)</span>
                  </div>
                  <div className="table-features mb-4">
                    <div className="feature-item d-flex align-items-center mb-2">
                      <span className="text-accent me-2">•</span>
                      <span>Capacity: {tableDetails.tableCapacity} guests</span>
                    </div>
                    <div className="feature-item d-flex align-items-center mb-2">
                      <span className="text-accent me-2">•</span>
                      <span>Private dining experience</span>
                    </div>
                    <div className="feature-item d-flex align-items-center mb-2">
                      <span className="text-accent me-2">•</span>
                      <span>Premium table service</span>
                    </div>
                  </div>
                  <p className="text-light">{tableDetails.tableDescription}</p>
                </div>
              </div>
            </div>

            {/* Right side - Reservation Form */}
            <div className="col-lg-6">
              <div className="reservation-form theme-card p-4">
                <h2 className="text-accent text-center mb-4">Make a Reservation</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FiCalendar className="me-2" />
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="form-control theme-input"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FiClock className="me-2" />
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="form-control theme-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FiUser className="me-2" />
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="form-control theme-input"
                        min="1"
                        max={tableDetails.tableCapacity}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FiUser className="me-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-control theme-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FiMail className="me-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control theme-input"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FiPhone className="me-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control theme-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      className="form-control theme-input"
                      rows="3"
                    />
                  </div>

                  <div className="reservation-summary theme-card p-3 mb-4">
                    <h3 className="text-accent h5 mb-3">Reservation Summary</h3>
                    <div className="summary-item">
                      <span className="text-light">Table:</span>
                      <span className="text-light">{tableDetails.tableName}</span>
                    </div>
                    <div className="summary-item">
                      <span className="text-light">Date:</span>
                      <span className="text-light">{formData.date || 'Not selected'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="text-light">Time:</span>
                      <span className="text-light">{formData.time || 'Not selected'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="text-light">Number of Guests:</span>
                      <span className="text-light">{formData.guests}</span>
                    </div>
                  </div>

                  <button type="submit" className="btn theme-button w-100">
                    Reserve Table
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TableReservationPage; 