const mongoose = require("mongoose");

const Organization = mongoose.model(
  "organization",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      max: 255,
      min: 3,
    },
    logo: {
      image: {
        required: true,
        type: String,
      },
      format: {
        required: true,
        min: 3,
        max: 10,
        type: String,
      },
    },
    createAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  })
);

module.exports = Organization;
