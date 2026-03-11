module.exports.createRide = async (req, res) => {

  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, dropoff, vehicleType } = req.body;

    if (!["car", "bike", "auto"].includes(vehicleType)) {
      return res.status(400).json({
        error: "Invalid vehicle type",
      });
    }

    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      dropoff,
      vehicleType,
    });

    res.status(201).json({ ride });

    const pickupCoordinates = await mapService.getAddress(pickup);

    const captains = await mapService.getCaptainsInRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      2
    );

    const rideWithUser = await rideModel
      .findById(ride._id)
      .populate("user");

    captains.forEach((captain) => {

      sendMessageToSocketId(captain.socketid, {
        event: "new-ride",
        data: rideWithUser,
      });

    });

  } catch (error) {

    console.error("Create Ride Error:", error);

    res.status(500).json({
      message: error.message || "Server error",
    });

  }

};