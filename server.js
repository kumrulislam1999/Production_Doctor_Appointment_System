const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

/* ===== Dotenv Config ===== */
dotenv.config();

/* ===== MongoDB Connection ===== */
connectDB();

/* ===== Rest Object ===== */
const app = express();

/* ===== Middlewares ===== */
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

/* ===== Routes ===== */
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
/* ===== Port ===== */
const PORT = process.env.PORT || 8080;

/* ===== Listening Port ===== */
app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode at localhost:${PORT}`
      .bgCyan.white
  );
});
