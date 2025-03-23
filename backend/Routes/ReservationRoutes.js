const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../Middlewares/Auth");
const {
  createReservation,
  getAllReservations,
  getReservationsByUser,
  updateReservation,
  deleteReservation,
} = require("../Controllers/ReservationController");

// Create a new reservation (authenticated users only)
router.post("/", ensureAuthenticated, createReservation);

// Fetch all reservations for the logged-in user (authenticated users only)
router.get("/user", ensureAuthenticated, getReservationsByUser);

// Fetch all reservations (admin only)
router.get("/", ensureAuthenticated, getAllReservations);

// Update a reservation (authenticated users only)
router.put("/:id", ensureAuthenticated, updateReservation);

// Delete a reservation (authenticated users only)
router.delete("/:id", ensureAuthenticated, deleteReservation);

module.exports = router;