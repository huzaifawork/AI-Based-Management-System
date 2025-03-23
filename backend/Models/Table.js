// /models/tableModel.js
const mongoose = require('mongoose');

// Define schema for tables
const tableSchema = new mongoose.Schema({
  tableName: { type: String, required: true },
  tableType: { type: String, required: true },
  capacity: { type: Number, required: true },
  image: { type: String, required: false }, // Path to uploaded image
  status: { type: String, default: 'Available' },
});

// Create model from schema
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
