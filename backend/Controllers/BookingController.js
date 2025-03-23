const Booking = require("../Models/Booking");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { roomId, roomType, roomNumber, checkInDate, checkOutDate, guests, payment, totalPrice } = req.body;
    const userId = req.user._id; // Get the user ID from the authenticated request

    if (!roomId || !checkInDate || !checkOutDate || !guests || !payment || !totalPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = new Booking({
      roomId,
      roomType,
      roomNumber,
      checkInDate,
      checkOutDate,
      guests,
      payment,
      totalPrice,
      userId, // Associate the booking with the logged-in user
    });

    await booking.save();
    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Error creating booking" });
  }
};

// Fetch all bookings for the logged-in user
exports.getBookingsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated request
    const bookings = await Booking.find({ userId }).populate("roomId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

// Fetch all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("roomId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id; // Get the user ID from the authenticated request

    // Ensure the booking belongs to the logged-in user
    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found or unauthorized" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        guests: req.body.guests,
        payment: req.body.payment,
      },
      { new: true } // Return the updated booking
    );

    res.status(200).json({ message: "Booking updated", updatedBooking });
  } catch (error) {
    res.status(500).json({ error: "Error updating booking" });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id; // Get the user ID from the authenticated request
    const isAdmin = req.user.isAdmin; // Check if user is admin
    
    console.log("Attempting to delete booking with ID:", bookingId);

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // First check if booking exists
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      console.log("Booking not found with ID:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking or is an admin
    if (!isAdmin && existingBooking.userId.toString() !== userId.toString()) {
      console.log("User not authorized to delete this booking");
      return res.status(403).json({ message: "You are not authorized to delete this booking" });
    }

    // Attempt to delete the booking
    const result = await Booking.deleteOne({ _id: bookingId });
    console.log("Delete operation result:", result);

    if (result.deletedCount === 0) {
      console.log("No booking was deleted");
      return res.status(404).json({ message: "Failed to delete booking" });
    }

    console.log("Successfully deleted booking with ID:", bookingId);
    res.status(200).json({ 
      success: true,
      message: "Booking deleted successfully",
      deletedBooking: existingBooking
    });

  } catch (error) {
    console.error("Error in deleteBooking:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid booking ID format" 
      });
    }
    res.status(500).json({ 
      success: false,
      message: "Error deleting booking",
      error: error.message 
    });
  }
};