// backend/middlewares/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;
