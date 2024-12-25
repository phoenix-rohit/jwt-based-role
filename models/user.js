const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Name"],
  },
  email: {
    type: String,
    required: [true, "Enter email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Enter password"],
    minlength: 4,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
