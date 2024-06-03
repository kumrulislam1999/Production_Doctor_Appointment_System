const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    email: {
      type: String,
      requried: [true, "Email is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    website: {
      type: String,
    },
    specialization: {
      type: String,
      requried: [true, "Specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    feesPerConsultation: {
      type: Number,
      requried: [true, "Fee is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "Work timing is required"],
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("Doctors", doctorSchema);

module.exports = doctorModel;
