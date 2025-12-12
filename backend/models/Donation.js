const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  message: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);
