const express = require("express");
const router = express.Router();

const {
  createDonation,
  getMyDonations,
} = require("../controllers/donationController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Create donation (donor only)
router.post("/", protect, restrictTo("donor"), createDonation);

// Get logged-in donor's donations
router.get("/mine", protect, restrictTo("donor"), getMyDonations);

module.exports = router;
