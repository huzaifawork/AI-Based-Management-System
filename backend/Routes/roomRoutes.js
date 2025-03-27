const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/uploadpic');
const { ensureAuthenticated, ensureAdmin } = require('../Middlewares/auth');
const {
  addRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} = require('../Controllers/roomController');

// Public routes
router.get('/', getAllRooms);

// Admin routes
router.post('/', ensureAuthenticated, ensureAdmin, upload.single('image'), addRoom);
router.put('/:id', ensureAuthenticated, ensureAdmin, upload.single('image'), updateRoom);
router.delete('/:id', ensureAuthenticated, ensureAdmin, deleteRoom);

module.exports = router;