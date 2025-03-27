const Room = require('../Models/Room');

// Add a new room
exports.addRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, price, status, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newRoom = new Room({
      roomNumber,
      roomType,
      price,
      status: status || 'Available',
      description,
      image,
    });

    await newRoom.save();
    res.status(201).json({
      message: 'Room added successfully!',
      room: newRoom,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a room
exports.updateRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, price, status, description } = req.body;
    const updateData = {
      roomNumber,
      roomType,
      price,
      status,
      description,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 