const express = require("express");

const authMiddleware = require("../middlewares/authMiddlewares");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminController");

/* ===== router Object ===== */
const router = express.Router();

/* ===== Get Users Routes || GET ===== */
router.get("/getAllUsers", authMiddleware, getAllUsersController);

/* ==== Get Doctors Routes || Get ==== */
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

/* ==== Acount Status Routes || Get ==== */
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);
module.exports = router;
