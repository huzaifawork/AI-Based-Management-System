import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FiCalendar, FiUsers, FiClock, FiX } from "react-icons/fi";
import "./ReserveTable.css";

const ReserveTable = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleReserveClick = (table) => {
    // Store the selected table and reservation data in localStorage
    const reservationDetails = {
      tableId: table._id,
      tableName: table.tableName,
      tableImage: table.image,
      tableCapacity: table.capacity,
      tableDescription: table.description,
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests,
    };
    
    localStorage.setItem('reservationDetails', JSON.stringify(reservationDetails));
    navigate('/table-reservation');
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
                    onClick={() => handleReserveClick(table)}
                  >
                    Reserve Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ReserveTable;