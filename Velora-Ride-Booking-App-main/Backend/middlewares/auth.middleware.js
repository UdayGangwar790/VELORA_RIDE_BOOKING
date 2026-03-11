const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListToken.model");


// USER AUTH
module.exports.authUser = async (req, res, next) => {

  try {

    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token });

    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();

  } catch (error) {

    console.error("AuthUser Error:", error.message);

    return res.status(401).json({ message: "Unauthorized" });

  }

};



// CAPTAIN AUTH
module.exports.authCaptain = async (req, res, next) => {

  try {

    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token });

    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const captain = await captainModel.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.captain = captain;

    next();

  } catch (error) {

    console.error("AuthCaptain Error:", error.message);

    return res.status(401).json({ message: "Unauthorized" });

  }

};