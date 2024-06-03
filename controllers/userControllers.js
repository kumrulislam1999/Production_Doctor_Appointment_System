const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModels");
const appointmentModel = require("../models/appointmentModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

/* ===== Login Controller || POST ===== */
const loginController = async (req, res) => {
  try {
    /* ===== Find User ===== */
    const user = await userModel.findOne({ email: req.body.email });
    /* ===== Check user Has or not ===== */
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    }

    /* ===== Check Matching Password ===== */
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    /* ===== Check password Match or Not ===== */
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid Email or Password " });
    }

    /* ===== Create JWT Token ===== */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Login Controller ${error.message}`,
    });
  }
};

/* ===== Register Controller || POST ===== */

const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });

    /* === Check Exisiting User === */
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Exist",
      });
    }

    const password = req.body.password;
    /* === Hashed Password === */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    /* === Saved New User === */
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({
      success: true,
      message: "Registerd Successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

/* ===== getUser/Auth Controller || POST ===== */
const authController = async (req, res) => {
  try {
    /* ==== Find User from Model ==== */
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    /* ==== Check User Has or Not ==== */
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not Found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "User Got Successfully",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in AuthController",
      error,
    });
  }
};

/* ===== Apply Doctor Controller || POST ===== */
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res
      .status(201)
      .send({ success: true, message: "Doctor Account Applied Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Applying For Doctor",
      error,
    });
  }
};

/* ===== get All Notification Controller || Post ===== */
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;
    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Notification Controller ",
      error,
    });
  }
};

/* ===== Delete All Notification Controller || Post ===== */
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete All Notifications",
      error,
    });
  }
};

/* ===== get All Doctor Controller || Post ===== */
const getAllDoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting All Doctor Controller",
      error,
    });
  }
};

/* ===== Book Appintment Controller || Post ===== */
const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A New Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });

    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Booking Appointment Controller",
    });
  }
};

/* ===== Book Check Availablity Controller || Post ===== */
const bookingAvailablityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Appointments no Available at this time",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointment Available",
      });
    }
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Error while Cheack Abailablity Controller",
        error,
      });
  }
};

const userAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointment Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in User Appointment Controller",
      error,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorController,
  bookAppointmentController,
  bookingAvailablityController,
  userAppointmentController,
};
