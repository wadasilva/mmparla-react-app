const mongoose = require('mongoose');

const Invitation = mongoose.model('invitation', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['pending', 'expired', 'finished'],
        default: 'pending'
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
}));

module.exports = Invitation;