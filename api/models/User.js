const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,   //e.g. movieaddict420
        required: true
    },
    password: {
        type: String,   //salt+hashed password using bcryptjs
        required: true
    },
    dateJoined: Date
});

module.exports = mongoose.model('User', UserSchema);