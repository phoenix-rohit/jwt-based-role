const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const app = express();
const connectDb = require("./utils/connectDb");
app.use(express.json());

connectDb();
const port = process.env.PORT || 5000;

function signToken(id, role = "user") {
  //   let token;
  //   if (role === "user") {
  // token = jwt.sign({ id }, process.env.JWT_SECRET_USER, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  //   } else {
  //     token = jwt.sign({ id, role }, process.env.JWT_SECRET_ADMIN, {
  //       expiresIn: process.env.JWT_EXPIRES_IN,
  //     });
  //   }
  const secret =
    role === "user"
      ? process.env.JWT_SECRET_USER
      : process.env.JWT_SECRET_ADMIN;

  console.log(secret);

  const token = jwt.sign({ id, role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}

function createSendToken(user, statusCode, res) {
  const token = signToken(user._id, user.role);
  //   const token = `${user._id} ${user.role}`;
  res.cookie("jwt", token);

  return res.status(statusCode).json({
    status: "success",
    token,
  });
}

app.post("/api/v1/user/signup", async (req, res, next) => {
  //   try {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    return res.status(400).json({
      status: "Failed",
    });
  }

  const newUser = await User.create({
    name,
    password,
    email,
  });

  createSendToken(newUser, 201, res);
  // } catch(err){
  //     res.status(500).json({
  //         status: "Failed",
  //         message : "Server failed"
  //     })
  // }
});

app.post("/api/v1/user/login", async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      status: "Failed",
    });
  }

  // password ecryption and validation is not implemented for simplicity
  const user = await User.findOne({ email: email });

  // now we could have change the role to admin through database but to login as admin we will sign them token of admin

  createSendToken(user, 200, res);
});

// made this route for myself to check if token is valid or not
app.post("/api/v1/user/verify", async (req, res, next) => {
  const { token } = req.body;
  // FOR ADMIN(to check for ADMIN commment out below code)
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
  // FOR USER(to check for user commnet out below code)
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);

  const user = await User.findById(decoded.id);
  console.log(user);

  res.status(200).json({
    message: "recevied",
  });
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
