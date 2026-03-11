const rideModel = require("../models/ride.model");
const mapService = require("./map.service");
const crypto = require("crypto");

function generateOtp(num) {
  return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

async function ridefare(pickup, dropoff) {
  if (!pickup || !dropoff) {
    throw new Error("Pickup and destination locations are required");
  }

  const distanceTime = await mapService.getDistanceAndTime(pickup, dropoff);

  if (!distanceTime?.distance?.value || !distanceTime?.duration?.value) {
    throw new Error("Invalid distance or duration values received");
  }

  const rideFare = {
    auto: { base: 30, perKm: 5 },
    car: { base: 50, perKm: 8 },
    bike: { base: 20, perKm: 3 },
  };

  const perMinuteRate = {
    auto: 1,
    car: 2,
    bike: 1,
  };

  const fares = {
    auto: Math.round(
      rideFare.auto.base +
        (distanceTime.distance.value / 1000) * rideFare.auto.perKm +
        (distanceTime.duration.value / 60) * perMinuteRate.auto
    ),

    car: Math.round(
      rideFare.car.base +
        (distanceTime.distance.value / 1000) * rideFare.car.perKm +
        (distanceTime.duration.value / 60) * perMinuteRate.car
    ),

    bike: Math.round(
      rideFare.bike.base +
        (distanceTime.distance.value / 1000) * rideFare.bike.perKm +
        (distanceTime.duration.value / 60) * perMinuteRate.bike
    ),
  };

  return fares;
}

module.exports.ridefare = ridefare;


// CREATE RIDE
module.exports.createRide = async ({ user, pickup, dropoff, vehicleType }) => {

  if (!user || !pickup || !dropoff || !vehicleType) {
    throw new Error("User, pickup, dropoff and vehicle type are required");
  }

  const fares = await ridefare(pickup, dropoff);
  const calculatedFare = fares[vehicleType];

  const ride = await rideModel.create({
    user,
    pickup,
    dropoff,
    fare: calculatedFare,
    otp: generateOtp(6),
  });

  return ride;
};


// CONFIRM RIDE
module.exports.confirmRide = async ({ rideId, captain }) => {

  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel.findById(rideId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "pending") {
    throw new Error("Ride already accepted");
  }

  ride.status = "accepted";
  ride.captain = captain._id;

  await ride.save();

  return await ride.populate("user").populate("captain").execPopulate();
};


// START RIDE
module.exports.startRide = async ({ rideId, otp, captain }) => {

  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findById(rideId)
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  ride.status = "in-progress";

  await ride.save();

  return ride;
};


// END RIDE
module.exports.endRide = async ({ rideId, captain }) => {

  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "in-progress") {
    throw new Error("Ride not in progress");
  }

  ride.status = "completed";

  await ride.save();

  return ride;
};