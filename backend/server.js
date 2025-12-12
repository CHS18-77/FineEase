const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
// connect only when this file is run directly (tests will control connection)
if (require.main === module) {
  connectDB();
}

const app = express();
app.use(cors());
app.use(express.json());

// default route
app.get("/", (req, res) => {
  res.send("FineEase Backend Running...");
});

// import routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ngo", require("./routes/ngoRoutes"));
app.use("/api/donation", require("./routes/donationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// start server only when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// export app for tests
module.exports = app;
