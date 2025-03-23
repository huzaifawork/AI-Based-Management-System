import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const BookForm = ({ room, onClose, refreshBookings }) => {
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
    payment: "card",
  });

  const handleBookingSubmit = async () => {
    if (!room) return;

    // Validate dates
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const today = new Date();
    
    // Reset time part for comparison
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      toast.warning("Check-in date cannot be in the past.");
      return;
    }
    
    if (checkOut <= checkIn) {
      toast.warning("Check-out date must be after check-in date.");
      return;
    }

    // Calculate total price
    const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
    const totalPrice = nights * room.price;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to book a room");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/bookings",
        {
          roomId: room._id,
          roomType: room.roomType,
          roomNumber: room.roomNumber || "N/A",
          checkInDate: bookingDetails.checkInDate,
          checkOutDate: bookingDetails.checkOutDate,
          guests: bookingDetails.guests,
          payment: bookingDetails.payment,
          totalPrice: totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Room booked successfully!");
      onClose();
      if (refreshBookings) refreshBookings();
    } catch (error) {
      console.error("Error booking room:", error);
      toast.error(error.response?.data?.message || "Failed to book room. Please try again.");
    }
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Check-in Date</Form.Label>
        <Form.Control
          type="date"
          value={bookingDetails.checkInDate}
          onChange={(e) => setBookingDetails({ ...bookingDetails, checkInDate: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Check-out Date</Form.Label>
        <Form.Control
          type="date"
          value={bookingDetails.checkOutDate}
          onChange={(e) => setBookingDetails({ ...bookingDetails, checkOutDate: e.target.value })}
          min={bookingDetails.checkInDate || new Date().toISOString().split('T')[0]}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Number of Guests</Form.Label>
        <Form.Control
          type="number"
          min="1"
          max={room.capacity || 4}
          value={bookingDetails.guests}
          onChange={(e) => setBookingDetails({ ...bookingDetails, guests: parseInt(e.target.value) })}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Payment Method</Form.Label>
        <Form.Select
          value={bookingDetails.payment}
          onChange={(e) => setBookingDetails({ ...bookingDetails, payment: e.target.value })}
        >
          <option value="card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </Form.Select>
      </Form.Group>

      <div className="d-flex justify-content-between align-items-center">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleBookingSubmit}>
          Confirm Booking
        </Button>
      </div>
    </Form>
  );
};

export default BookForm;
