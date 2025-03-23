
const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  attended: { type: Boolean, default: false },
});

module.exports = mongoose.model('Shift', shiftSchema);
