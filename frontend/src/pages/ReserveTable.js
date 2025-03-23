import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { FiCalendar, FiUsers, FiClock, FiX } from "react-icons/fi";
import "./ReserveTable.css";

const ReserveTable = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: 1,
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tables");
      setTables(response.data);
    } catch (error) {
      setError("Failed to load tables. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReservationSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to make a reservation");
        return;
      }

      const reservationDetails = {
        tableId: selectedTable._id,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
      };

      await axios.post("http://localhost:8080/api/reservations", reservationDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Reservation successful!");
      setShowModal(false);
      setSelectedTable(null);
      setReservationData({
        date: "",
        time: "",
        guests: 1,
      });
    } catch (error) {
      alert("Failed to make reservation. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="reserve-table-container">
      <Container className="py-5">
        <div className="header">
          <h1 className="cosmic-title">Reserve a Table</h1>
          <p className="subtitle">Book your perfect dining experience</p>
        </div>

        <div className="filters">
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Date</Form.Label>
                <Form.Control
                  type="date"
                  className="cosmic-input"
                  value={reservationData.date}
                  onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Time</Form.Label>
                <Form.Control
                  type="time"
                  className="cosmic-input"
                  value={reservationData.time}
                  onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
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
                  value={reservationData.guests}
                  onChange={(e) => setReservationData({ ...reservationData, guests: e.target.value })}
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

        <Row className="table-list">
          {tables.map((table) => (
            <Col key={table._id} lg={4} md={6} className="mb-4">
              <Card className="table-card">
                <div className="table-image-container">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8080/${table.image}`}
                    alt={table.tableName}
                    className="table-image"
                  />
                  <div className="capacity-badge">
                    <FiUsers className="me-1" />
                    {table.capacity} seats
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="table-title">{table.tableName}</Card.Title>
                  <Card.Text className="table-description">{table.description}</Card.Text>
                  <div className="table-features">
                    <div className="feature">
                      <FiClock className="me-2" />
                      <span>Available</span>
                    </div>
                    <div className="feature">
                      <FiUsers className="me-2" />
                      <span>Max {table.capacity} guests</span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="reserve-button"
                    onClick={() => {
                      setSelectedTable(table);
                      setShowModal(true);
                    }}
                  >
                    Reserve Now
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
            <Modal.Title>Confirm Reservation</Modal.Title>
          </Modal.Header>
          <Modal.Body className="cosmic-modal-body">
            {selectedTable && (
              <div className="selected-table-info">
                <h4 className="text-light">{selectedTable.tableName}</h4>
                <p className="text-light">{selectedTable.description}</p>
                <div className="reservation-summary">
                  <div className="summary-item">
                    <span className="text-light">Date:</span>
                    <span className="text-light">{formatDate(reservationData.date)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-light">Time:</span>
                    <span className="text-light">{reservationData.time}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-light">Guests:</span>
                    <span className="text-light">{reservationData.guests}</span>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="cosmic-modal-footer">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleReservationSubmit}>
              Confirm Reservation
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ReserveTable;