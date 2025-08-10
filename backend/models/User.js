const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // hashed
    avatar: { type: String } // optional
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
