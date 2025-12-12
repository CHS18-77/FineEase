const express = require("express");
const router = express.Router();

const {
  approveNGO,
  rejectNGO,
  getAllNGOs,
  getNGOById,
} = require("../controllers/adminController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

// APPROVE NGO
router.put(
  "/ngos/approve/:id",
  protect,
  restrictTo("admin"),
  approveNGO
);

// REJECT NGO
router.put(
  "/ngos/reject/:id",
  protect,
  restrictTo("admin"),
  rejectNGO
);

// GET ALL NGOs
router.get(
  "/ngos",
  protect,
  restrictTo("admin"),
  getAllNGOs
);

// GET SINGLE NGO
router.get(
  "/ngos/:id",
  protect,
  restrictTo("admin"),
  getNGOById
);

module.exports = router;
