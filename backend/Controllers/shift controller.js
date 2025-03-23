const Shift = require('../Models/shift');

exports.addShift = async (req, res) => {
  try {
    const { staffId, date, time, duration } = req.body;

    // Check for existing shifts
    const existingShift = await Shift.findOne({ staffId, date });
    if (existingShift) {
      return res.status(400).json({ message: 'A shift for this staff member on this date already exists.' });
    }

    const shift = new Shift({ staffId, date, time, duration });
    await shift.save();
    const populatedShift = await Shift.findById(shift._id).populate('staffId', 'name');
    res.status(201).json(populatedShift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().populate('staffId', 'name');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await Shift.findById(id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    shift.attended = !shift.attended;
    await shift.save();
    const populatedShift = await Shift.findById(shift._id).populate('staffId', 'name');
    res.status(200).json(populatedShift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    res.status(200).json({ message: 'Shift deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};