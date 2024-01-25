const JWT = require("jsonwebtoken");
const { hashpassword, comparepassword } = require("../helpers/authHelper");
const UserModel = require("../models/UserModel");
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireSingIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
// Register

const registercontroller = async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name) {
      return resp.status(400).send({
        sucess: false,
        message: "name is required",
      });
    }
    if (!email) {
      return resp.status(400).send({
        sucess: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6 || password.length > 24) {
      return resp.status(400).send({
        sucess: false,
        message: "Password is required and between 6 to 24 characters",
      });
    }
    //   existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return resp.status(500).send({
        success: false,
        message: "User Already Registred With This Mail",
      });
    }

    // hashed password
    const hashedpassword = await hashpassword(password);

    // save user
    const user = await UserModel({
      name,
      email,
      password: hashedpassword,
    }).save();

    return resp.status(201).send({
      success: true,
      message: "Registration Successful Please Login",
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: true,
      message: "Error in Register API",
      error,
    });
  }
};

// login
const loginController = async (req, resp) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return resp.status(500).send({
        success: false,
        message: "please provide email and password",
      });
    }

    // Find User
    const user = await UserModel.findOne({ email });
    if (!user) {
      return resp.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }

    // Match password
    const match = await comparepassword(password, user.password);
    if (!match) {
      return resp.status(500).send({
        success: false,
        message: "Invalid Username or Password",
      });
    }

    // TOKEN
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      dexpiresIn: "7d",
    });

    // undefined password
    user.password = undefined;
    resp.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      sucess: false,
      message: "Error in Login Api",
      error,
    });
  }
};

// update user
const UpdateUserController = async (req, resp) => {
  try {
    const { name, email, password } = req.body;
    // user find
    const user = await UserModel.findOne({ email });
    // password validate
    if (password && password.length < 8 && password.length > 24) {
      return resp.status(400).send({
        success: false,
        message: "Incorrect password or password length",
      });
    }
    // hashpassword
    const hashedpassword = password ? await hashpassword(password) : undefined;
    // updated User
    const updateduser = await UserModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedpassword || user.password,
      },
      { new: true }
    );

    updateduser.password = undefined;
    resp.status(200).send({
      success: true,
      message: "Profile Updated , Kindly Login",
      updateduser,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error is User Updatation Api...",
      error,
    });
  }
};

module.exports = {
  requireSingIn,
  registercontroller,
  loginController,
  UpdateUserController,
};
