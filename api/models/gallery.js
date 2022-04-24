const mongoose = require('mongoose');

const Gallery = mongoose.model('Gallery', new mongoose.Schema({
    image: {
        required: true,
        type: String,
    },
    description: {
        max: 255,
        min: 6,
        required: false,
        type: String,
    },
    public_id: {
        max: 255,
        min: 6,
        required: true,
        type: String
    },
    asset_id: {
        max: 255,
        type: String
    },
    created_at: {
        required: true,
        type: Date
    },
    format: {
        required: true,
        min: 3,
        max: 10,
        type: String
    },
    breakpoints: [{
        format: {
            required: true,
            min: 3,
            max: 10,
            type: String
        },
        images: [{
            image: {
                required: true,
                type: String,
            },
            height: {
                required: true,
                type: Number
            },
            width: {
                required: true,
                type: Number
            },
            secure_url: {
                required: false,
                max: 255,
                type: String
            },
            url: {
                required: false,
                max: 255,
                type: String
            }
        }],
        isPrefered: {
            type: Boolean,
            default: false
        }
    }]
}));

exports.Gallery = Gallery;