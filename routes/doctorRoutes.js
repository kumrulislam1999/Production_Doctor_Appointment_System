const express = require("express");
const authMiddleware = require("../middlewares/authMiddlewares");
const {
  getDoctorInfoController,
  updateDoctorProfileController,
  getDoctorByIdController,
  doctorAppointmentController,
  updateStatusController,
} = require("../controllers/doctorController");

/* ===== router Object ===== */
const router = express.Router();

/* ===== Post Single Doctor Route || GET ===== */
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

/* ===== Update Doctor Profile Route || GET ===== */
router.post("/updateProfile", authMiddleware, updateDoctorProfileController);

/* ==== Get Single Doctor info || Get ==== */
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

/* ==== Get Doctor Appointments info || Get ==== */
router.get("/doctor-appoinments", authMiddleware, doctorAppointmentController);

router.post("/update-status", authMiddleware, updateStatusController);
/* ===== Export Router ===== */
module.exports = router;
