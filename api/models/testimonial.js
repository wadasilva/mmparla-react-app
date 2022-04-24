const mongoose = require('mongoose');

const Testimonial = mongoose.model('Testimonial', new mongoose.Schema({
    photo: {
        required: false,
        type: String
    },
    extention: {
        required: true,
        min: 3,
        max: 10,
        type: String
    },
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true,
        min: 10,
        max: 500
    },
    accepted: {
        type: Boolean,
        default: null
    }
}));

module.exports = Testimonial;