const mongoose = require("mongoose");

const Testimonial = mongoose.model(
  "Testimonial",
  new mongoose.Schema({
    photo: {
      image: {
        required: false,
        type: String,
      },
      format: {
        required: true,
        min: 3,
        max: 10,
        type: String,
      },
    },
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 100,
    },
    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 100,
    },
    email: {
      type: String,
      required: false,
    },
    rol: {
      type: String,
      required: false,
      min: 3,
      max: 50,
    },
    message: {
      type: String,
      required: true,
      min: 10,
      max: 500,
    },
    accepted: {
      type: Boolean,
      default: null,
    },
    createAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    invitation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invitation",
    },
  })
);

module.exports = Testimonial;
