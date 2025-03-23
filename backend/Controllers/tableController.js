const Table = require('../models/Table');

// Add a new table
const addTable = async (req, res) => {
  try {
    const { tableName, tableType, capacity, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newTable = new Table({
      tableName,
      tableType,
      capacity,
      image,
      status: status || 'Available',
    });

    await newTable.save();

    res.status(201).json({
      message: 'Table added successfully!',
      table: newTable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tables
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a table
const updateTable = async (req, res) => {
  try {
    const { tableName, tableType, capacity, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      {
        tableName,
        tableType,
        capacity,
        image: image || undefined, // Update image only if provided
        status: status || undefined,
      },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json(updatedTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a table
const deleteTable = async (req, res) => {
  try {
    const deletedTable = await Table.findByIdAndDelete(req.params.id);
    if (!deletedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addTable, getAllTables, updateTable, deleteTable };