const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "expired", "finished", "revoked"],
    default: "pending",
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
});

schema.index({ email: 1, organization: 1 }, { unique: true });

const Invitation = mongoose.model("invitation", schema);

module.exports = Invitation;
