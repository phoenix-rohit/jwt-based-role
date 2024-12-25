const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.MONGO_LOCAL_URI).then(() => {
    console.log("Database Connected");
  });
};

module.exports = connectDB;
