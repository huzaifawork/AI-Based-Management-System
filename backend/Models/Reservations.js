const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  tableNumber: { type: String, required: true },
  reservationDate: { type: String, required: true },
  guests: { type: Number, required: true },
  payment: { type: String, enum: ["card", "paypal"], required: true },
  totalPrice: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate reservation with user
});

module.exports = mongoose.model("Reservation", ReservationSchema);