const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Koneksi Error:", error);
  }
};

module.exports = connectToMongoDB;
