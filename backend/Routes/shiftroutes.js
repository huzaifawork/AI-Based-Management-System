// const express = require('express');
// const { addShift, getAllShifts, toggleAttendance } = require('../Controllers/shift controller');

// const router = express.Router();

// router.post('/add', addShift);
// router.get('/', getAllShifts);
// router.put('/:id', async (req, res) => {
//     try {
//       const { staffId, date, time, duration } = req.body;
//       const shift = await Shift.findByIdAndUpdate(req.params.id, { staffId, date, time, duration }, { new: true });
//       res.status(200).json(shift);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
//   router.delete('/:id', async (req, res) => {
//     try {
//       await Shift.findByIdAndDelete(req.params.id);
//       res.status(200).json({ message: 'Shift deleted successfully.' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
// module.exports = router;


// const express = require('express');
// const {
//   addShift,
//   getAllShifts,
//   toggleAttendance,
//   deleteShiftsByStaffId,
//   deleteShift,
// } = require('../Controllers/shift controller');

// const router = express.Router();

// router.post('/add', addShift);
// router.get('/', getAllShifts);
// router.put('/:id/toggle', toggleAttendance);
// router.delete('/staff/:id', deleteShiftsByStaffId); // Delete all shifts for a specific staff
// router.delete('/:id', deleteShift); // Delete a specific shift

// module.exports = router;


const express = require('express');
const {
  addShift,
  getAllShifts,
  toggleAttendance,
  deleteShift,
} = require('../Controllers/shift controller');

const router = express.Router();

router.post('/add', addShift);
router.get('/', getAllShifts);
router.put('/:id/toggle', toggleAttendance);
router.delete('/:id', deleteShift);

module.exports = router;