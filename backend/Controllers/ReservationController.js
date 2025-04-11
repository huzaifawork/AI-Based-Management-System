const Reservation = require("../Models/Reservations");

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { tableId, tableNumber, reservationDate, time, guests, payment, totalPrice } = req.body;
    const userId = req.user._id; // Get the user ID from the authenticated request

    // Validate required fields
    if (!tableId || !reservationDate || !time || !guests || !payment || !totalPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure guests and totalPrice are numbers
    if (typeof guests !== "number" || typeof totalPrice !== "number") {
      return res.status(400).json({ error: "Invalid data types for guests or totalPrice" });
    }

    const reservation = new Reservation({
      tableId,
      tableNumber,
      reservationDate,
      time,
      guests,
      payment,
      totalPrice,
      userId, // Associate the reservation with the logged-in user
    });

    await reservation.save();
    res.status(201).json({ message: "Reservation confirmed", reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Error creating reservation" });
  }
};

// Fetch all reservations for the logged-in user
exports.getReservationsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated request
    const reservations = await Reservation.find({ userId }).populate("tableId");
    console.log("Reservations from database:", JSON.stringify(reservations, null, 2)); // Debug log
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Error fetching reservations" });
  }
};

// Fetch all reservations (admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("tableId");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reservations" });
  }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user._id; // Get the user ID from the authenticated request

    // Ensure the reservation belongs to the logged-in user
    const reservation = await Reservation.findOne({ _id: reservationId, userId });
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found or unauthorized" });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        reservationDate: req.body.reservationDate,
        guests: req.body.guests,
        payment: req.body.payment,
      },
      { new: true } // Return the updated reservation
    );

    res.status(200).json({ message: "Reservation updated", updatedReservation });
  } catch (error) {
    res.status(500).json({ error: "Error updating reservation" });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user._id; // Get the user ID from the authenticated request

    // Ensure the reservation belongs to the logged-in user
    const reservation = await Reservation.findOne({ _id: reservationId, userId });
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found or unauthorized" });
    }

    await Reservation.findByIdAndDelete(reservationId);
    res.status(200).json({ message: "Reservation deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting reservation" });
  }
};