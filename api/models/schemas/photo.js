const mongoose = require("mongoose");

const photo = new mongoose.Schema({
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
});

module.exports = photo;
