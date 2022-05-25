const mongoose = require("mongoose");
const photoSchema = require("./schemas/photo");

const Testimonial = mongoose.model(
  "Testimonial",
  new mongoose.Schema({
    photo: {
      type: photoSchema,
      required: false,
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
      max: 255,
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
