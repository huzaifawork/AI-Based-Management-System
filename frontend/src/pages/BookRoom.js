import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { FiCalendar, FiUsers, FiDollarSign, FiX } from "react-icons/fi";
import "./BookRoom.css";

const BookRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/rooms");
      setRooms(response.data);
    } catch (error) {
      setError("Failed to load rooms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    // Implement filter logic here
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return selectedRoom.price * nights;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleBookingSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to make a booking");
        return;
      }

      const bookingDetails = {
        roomId: selectedRoom._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: calculateTotalPrice(),
      };

      await axios.post("http://localhost:8080/api/bookings", bookingDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Booking successful!");
      setShowModal(false);
      setSelectedRoom(null);
      setBookingData({
        checkIn: "",
        checkOut: "",
        guests: 1,
      });
    } catch (error) {
      alert("Failed to make booking. Please try again.");
    }
  };

  return (
    <div className="book-room-container">
      <Container>
        <div className="header">
          <h1 className="cosmic-title">Book Your Stay</h1>
          <p className="subtitle">Find the perfect room for your next adventure</p>
        </div>

        <div className="filters">
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Check-in Date</Form.Label>
                <Form.Control
                  type="date"
                  className="cosmic-input"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Check-out Date</Form.Label>
                <Form.Control
                  type="date"
                  className="cosmic-input"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Number of Guests</Form.Label>
                <Form.Control
                  type="number"
                  className="cosmic-input"
                  min="1"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {error && (
          <div className="error-alert">
            <FiX className="me-2" />
            {error}
          </div>
        )}

        <Row className="room-list">
          {rooms.map((room) => (
            <Col key={room._id} lg={4} md={6} className="mb-4">
              <Card className="room-card">
                <div className="room-image-container">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8080/${room.image}`}
                    alt={room.roomName}
                    className="room-image"
                  />
                  <div className="price-badge">
                    <FiDollarSign className="me-1" />
                    {room.price}/night
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="room-title">{room.roomName}</Card.Title>
                  <Card.Text className="room-description">{room.description}</Card.Text>
                  <div className="room-features">
                    <div className="feature">
                      <FiUsers className="me-2" />
                      <span>Max {room.capacity} guests</span>
                    </div>
                    <div className="feature">
                      <FiCalendar className="me-2" />
                      <span>Available</span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="book-button"
                    onClick={() => {
                      setSelectedRoom(room);
                      setShowModal(true);
                    }}
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          className="cosmic-modal"
        >
          <Modal.Header closeButton className="cosmic-modal-header">
            <Modal.Title>Confirm Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body className="cosmic-modal-body">
            {selectedRoom && (
              <div className="selected-room-info">
                <h4 className="text-light">{selectedRoom.roomName}</h4>
                <p className="text-light">{selectedRoom.description}</p>
                <div className="booking-summary">
                  <div className="summary-item">
                    <span className="text-light">Check-in:</span>
                    <span className="text-light">{formatDate(bookingData.checkIn)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-light">Check-out:</span>
                    <span className="text-light">{formatDate(bookingData.checkOut)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-light">Guests:</span>
                    <span className="text-light">{bookingData.guests}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-light">Total Price:</span>
                    <span className="total-price">${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="cosmic-modal-footer">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleBookingSubmit}>
              Confirm Booking
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default BookRoom;