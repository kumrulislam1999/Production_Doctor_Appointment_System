const express = require("express");
const {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorController,
  bookAppointmentController,
  bookingAvailablityController,
  userAppointmentController,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddlewares");

/* ===== router Object ===== */
const router = express.Router();

/* ===== All Routes ===== */

/* ===== Register Routes || POST ===== */
router.post("/register", registerController);

/* ===== Login Routes || POST ===== */
router.post("/login", loginController);

/* ===== getUserData Routes || POST ===== */
router.post("/getUserData", authMiddleware, authController);

/* ===== Apply Doctor Routes || POST ===== */
router.post("/apply-doctor", authMiddleware, applyDoctorController);

/* ===== get Notification Routes || POST ===== */
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

/* ===== Delete Notification Routes || POST ===== */
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

/* ===== get All Doctors Routes || POST ===== */
router.get("/getAllDoctors", authMiddleware, getAllDoctorController);

/* ==== Book Appointment Routes || Post ===== */
router.post("/book-appointment", authMiddleware, bookAppointmentController);

/* ==== Check Booking Availablily Routes || Post ===== */
router.post(
  "/booking-availablity",
  authMiddleware,
  bookingAvailablityController
);

/* ==== Appointment List Routes || Post ===== */
router.get("/user-appointments", authMiddleware, userAppointmentController);

/* ===== Export Router ===== */
module.exports = router;
