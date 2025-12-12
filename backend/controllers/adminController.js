const NGO = require("../models/ngoModel");

// 📌 APPROVE NGO
exports.approveNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.status(200).json({
      message: "NGO approved successfully",
      ngo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 REJECT NGO
exports.rejectNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.status(200).json({
      message: "NGO rejected successfully",
      ngo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 GET ALL NGOs (optional but useful for admin dashboard)
exports.getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({});
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 GET SINGLE NGO
exports.getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.status(200).json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
