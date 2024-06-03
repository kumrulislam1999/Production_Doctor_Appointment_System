const mongoose = require("mongoose");

const colors = require("colors");

/* ==== Database Connection Function ==== */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(
      `MongoDB Server is Faild To Connect Database. ${error}`.bgRed.white
    );
  }
};

module.exports = connectDB;
