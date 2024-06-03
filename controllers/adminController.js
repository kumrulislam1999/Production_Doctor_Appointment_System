const doctorModel = require("../models/doctorModels");
const userModel = require("../models/userModels");

/* ===== Get All Users Controller || GET ===== */
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users Data List",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Fetching Users",
      error,
    });
  }
};

/* ===== Get All Doctors Routes || GET ===== */
const getAllDoctorsController = async (req, res) => {
  try {
    const users = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors Data List",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Fetching Doctors",
      error,
    });
  }
};

/* ===== Change Account Status Controller || GET ===== */
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await userModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onclickPath: "/notification",
    });

    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Account Status Controller",
      error,
    });
  }
};

/* =====  Export Controller ===== */

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
};
