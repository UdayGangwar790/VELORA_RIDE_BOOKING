const express = require("express");
const router = express.Router();

const { body, query } = require("express-validator");

const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");


// CREATE RIDE
router.post(
  "/create",
  authMiddleware.authUser,
  [
    body("pickup")
      .isLength({ min: 3 })
      .withMessage("Pickup location must be at least 3 characters long"),

    body("dropoff")
      .isLength({ min: 3 })
      .withMessage("Dropoff location must be at least 3 characters long"),

    body("vehicleType")
      .isIn(["car", "bike", "auto"])
      .withMessage("Invalid ride type"),
  ],
  rideController.createRide
);


// GET FARE
router.get(
  "/fare",
  authMiddleware.authUser,
  [
    query("pickup")
      .isLength({ min: 3 })
      .withMessage("Pickup location must be at least 3 characters long"),

    query("dropoff")
      .isLength({ min: 3 })
      .withMessage("Dropoff location must be at least 3 characters long"),
  ],
  rideController.ridefare
);


// CONFIRM RIDE
router.post(
  "/confirm",
  authMiddleware.authCaptain,
  [
    body("rideId")
      .isMongoId()
      .withMessage("Invalid ride ID"),
  ],
  rideController.confirmRide
);


// START RIDE
router.get(
  "/start-ride",
  authMiddleware.authCaptain,
  [
    query("rideId")
      .isMongoId()
      .withMessage("Invalid ride id"),

    query("otp")
      .isNumeric()
      .isLength({ min: 6, max: 6 })
      .withMessage("Invalid OTP"),
  ],
  rideController.startRide
);


// END RIDE
router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  [
    body("rideId")
      .isMongoId()
      .withMessage("Invalid ride id"),
  ],
  rideController.endRide
);

module.exports = router;