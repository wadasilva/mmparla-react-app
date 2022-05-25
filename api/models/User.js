const mongoose = require("mongoose");
const photoSchema = require("./schemas/photo");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      max: 255,
      min: 3,
    },
    lastName: {
      type: String,
      required: true,
      max: 255,
      min: 3,
    },
    photo: {
      type: photoSchema,
      required: false,
    },
    password: {
      type: String,
      required: true,
      min: 3,
    },
    createAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  })
);

module.exports = User;
