const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },
});

module.exports = mongoose.model('Staff', staffSchema);
