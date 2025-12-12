const Donation = require("../models/Donation");

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create({
      ...req.body,
      donor: req.user._id,
    });

    res.status(201).json({
      message: "Donation created successfully",
      donation,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
