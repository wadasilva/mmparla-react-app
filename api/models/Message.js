const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 3,
      max: 100,
    },
    email: {
      type: String,
      required: false,
      max: 100,
    },
    subject: {
      type: String,
      required: false,
      max: 50,
    },
    message: {
      type: String,
      required: true,
      min: 10,
      max: 500,
    },
    createAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  })
);

module.exports = Message;
