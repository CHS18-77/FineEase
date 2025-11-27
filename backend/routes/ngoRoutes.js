const express = require("express");
const router = express.Router();

const {
  addNGO,
  getMyNGOs,
  getAllApprovedNGOs,
} = require("../controllers/ngoController");

const { protect } = require("../middlewares/authMiddleware");

// Add NGO
router.post("/add", protect, addNGO);

// Get NGOs created by logged-in user
router.get("/mine", protect, getMyNGOs);

// Get all approved NGOs
router.get("/approved", getAllApprovedNGOs);

module.exports = router;
