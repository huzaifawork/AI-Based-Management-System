const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Menu', MenuSchema);
