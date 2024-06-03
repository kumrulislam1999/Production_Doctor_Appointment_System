const doctorModel = require("../models/doctorModels");
const appointmentModel = require("../models/appointmentModels");
const userModel = require("../models/userModels");
/* ===== get single Doctor Controller || GET ===== */
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data fetch successful",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Fetching Doctor Details",
      error,
    });
  }
};

/* ===== Update Doctor Profile Controller || Post ===== */
const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated Successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Doctor profile Update Controller",
      error,
    });
  }
};

/* ===== Get Single Doctor Info Controller || GET ===== */
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error white Getting Doctor By Id Controller",
      error,
    });
  }
};

/* ===== Doctor Appointment Controller || GET ===== */
const doctorAppointmentController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointment Fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Doctor Appointment Controler",
      error,
    });
  }
};

/* ===== updateStatus Controller || POST ===== */
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      {
        _id: appointmentsId,
      },
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      type: "status-updated",
      message: `Your Appointment has been updated ${status}`,
      onClickPath: "/doctor-appointments",
    });

    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Update Status Controller",
      error,
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateDoctorProfileController,
  getDoctorByIdController,
  doctorAppointmentController,
  updateStatusController,
};
