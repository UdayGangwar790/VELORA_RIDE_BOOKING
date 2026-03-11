const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blackListToken.model");


// REGISTER CAPTAIN
module.exports.registerCaptain = async (req, res) => {

  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { fullName, email, password, vehicle } = req.body;

    const isCaptainExists = await captainModel.findOne({ email });

    if (isCaptainExists) {
      return res.status(409).json({ message: "Captain already exists" });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    const token = await captain.generateAuthToken();

    res.status(201).json({ token, captain });

  } catch (error) {

    console.error("registerCaptain error:", error);
    res.status(500).json({ message: "Server error" });

  }

};


// LOGIN CAPTAIN
module.exports.loginCaptain = async (req, res) => {

  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await captain.generateAuthToken();

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ token, captain });

  } catch (error) {

    console.error("loginCaptain error:", error);
    res.status(500).json({ message: "Server error" });

  }

};


// PROFILE
module.exports.getCaptainProfile = async (req, res) => {

  res.status(200).json({ captain: req.captain });

};


// LOGOUT
module.exports.logoutCaptain = async (req, res) => {

  const token =
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[1]);

  if (token) {
    await blackListTokenModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({ message: "Logged out successfully" });

};