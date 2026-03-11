const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blackListToken.model");


// REGISTER USER
module.exports.registerUser = async (req, res, next) => {

  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    const isUserExists = await userModel.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
    });

    const token = await user.generateAuthToken();

    res.status(201).json({ token, user });

  } catch (error) {
    next(error);
  }

};


// LOGIN USER
module.exports.loginUser = async (req, res, next) => {

  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ token, user });

  } catch (error) {
    next(error);
  }

};


// GET PROFILE
module.exports.getUserProfile = async (req, res, next) => {

  res.status(200).json({ user: req.user });

};


// LOGOUT
module.exports.logoutUser = async (req, res, next) => {

  try {

    res.clearCookie("token");

    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (token) {
      await blackListTokenModel.create({ token });
    }

    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    next(error);
  }

};