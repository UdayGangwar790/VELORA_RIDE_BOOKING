const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");


// REGISTER CAPTAIN
router.post(
  "/register",
  [

    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long."),

    body("fullName.lastName")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long."),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),

    body("vehicle.plate")
      .notEmpty()
      .withMessage("Vehicle plate is required."),

    body("vehicle.color")
      .notEmpty()
      .withMessage("Vehicle color is required."),

    body("vehicle.vehicleType")
      .isIn(["car", "bike", "auto"])
      .withMessage("Vehicle type must be car, bike or auto"),

    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity must be at least 1"),
  ],

  captainController.registerCaptain
);


// LOGIN CAPTAIN
router.post(
  "/login",
  [

    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body("password")
      .notEmpty()
      .withMessage("Password is required."),

  ],

  captainController.loginCaptain
);


// PROFILE
router.get(
  "/profile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile
);


// LOGOUT
router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain
);

module.exports = router;