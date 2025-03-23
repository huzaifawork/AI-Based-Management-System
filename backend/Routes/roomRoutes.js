


const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/uploadpic');
const Room = require('../Models/Room');

// POST endpoint to create a room
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { roomName, roomType, description, price } = req.body;
    const newRoom = new Room({
      roomName,
      roomType,
      description,
      price,
      image: req.file ? req.file.path : null,
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ message: 'Error adding room', error: error.message });
  }
});

// GET endpoint to fetch all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
});

// PUT endpoint to update a room
// PUT endpoint to update a room
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { roomName, roomType, description, price } = req.body;

    // Find the existing room
    const existingRoom = await Room.findById(req.params.id);

    // Prepare the update data
    const updateData = {
      roomName,
      roomType,
      description,
      price,
      // Use the existing image if no new image is uploaded
      image: req.file ? req.file.path : existingRoom.image,
    };

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
});

// DELETE endpoint to delete a room
router.delete('/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
});

module.exports = router;