// /models/tableModel.js
const mongoose = require('mongoose');

// Define schema for tables
const tableSchema = new mongoose.Schema({
  tableName: { 
    type: String, 
    required: true,
    trim: true
  },
  tableType: { 
    type: String, 
    required: true,
    enum: ['indoor', 'outdoor', 'private']
  },
  capacity: { 
    type: Number, 
    required: true,
    min: 1
  },
  status: { 
    type: String, 
    required: true,
    enum: ['Available', 'Booked', 'Reserved'],
    default: 'Available'
  },
  image: { 
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

// Add index for faster queries
tableSchema.index({ tableName: 1 });
tableSchema.index({ status: 1 });

// Create model from schema
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
