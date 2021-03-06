const mongoose = require("mongoose");
const photoSchema = require("./schemas/photo");

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
    photo: {
      type: photoSchema,
      required: false,
    },
    createAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  })
);

module.exports = Organization;
