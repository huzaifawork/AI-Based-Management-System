const Staff = require('../Models/staff');
const Shift = require('../Models/shift');

exports.addStaff = async (req, res) => {
  try {
    const { name, position } = req.body;
    const staff = new Staff({ name, position });
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    // Delete all shifts associated with the staff member
    await Shift.deleteMany({ staffId: req.params.id });

    // Now delete the staff member
    await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Staff and associated shifts deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};