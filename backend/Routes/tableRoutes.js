// // /routes/tableRoutes.js
// const express = require('express');
// const router = express.Router();
// const upload = require('../Middlewares/uploadpic');
// const { addTable } = require('../Controllers/tableController');
// const { getAllTables, updateTable, deleteTable } = require('../Controllers/tableController');

// // POST route to add a new table
// router.post('/add', upload.single('image'), addTable);

// // GET endpoint to fetch all tables (R operation)
// router.get('/', getAllTables);

// // PUT endpoint to update a table (U operation)
// router.put('/:id', upload.single('image'), updateTable);

// // DELETE endpoint to delete a table (D operation)
// router.delete('/:id', deleteTable);


// module.exports = router;
const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/uploadpic');
const { addTable, getAllTables, updateTable, deleteTable } = require('../Controllers/tableController');

// POST route to add a new table
// router.post('/add', upload.single('image'), addTable);
router.post('/add', upload.single('image'), (req, res) => {
    console.log(req.file); // This should show the uploaded file details
    addTable(req, res);
  });

// GET route to fetch all tables
router.get('/', getAllTables);

// PUT route to update a table
router.put('/:id', upload.single('image'), updateTable);

// DELETE route to delete a table
router.delete('/:id', deleteTable);

module.exports = router;