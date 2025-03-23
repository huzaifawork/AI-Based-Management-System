const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    image: {
        type: String, // Store the image URL
        default: ''
    }
});

// Check if the model already exists before defining it
const UserModel = mongoose.models.users || mongoose.model('users', userSchema);

module.exports = UserModel;
