const NGO = require("../models/ngoModel");

// Add NGO
exports.addNGO = async (req, res) => {
  try {
    const ngo = await NGO.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "NGO added successfully",
      ngo,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get NGOs created by logged-in user
exports.getMyNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ createdBy: req.user._id });
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public – get all approved NGOs
exports.getAllApprovedNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ status: "approved" });
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
