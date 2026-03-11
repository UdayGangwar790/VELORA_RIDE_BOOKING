const axios = require("axios");
const captainModel = require("../models/captain.model");


// GET ADDRESS COORDINATES
module.exports.getAddress = async (address) => {

  try {

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status === "OK") {

      const location = response.data.results[0].geometry.location;

      return {
        lat: location.lat,
        lng: location.lng,
      };

    }

    throw new Error("Unable to find coordinates");

  } catch (error) {

    throw new Error("Geocoding error: " + error.message);

  }

};


// DISTANCE + TIME
module.exports.getDistanceAndTime = async (origin, destination) => {

  try {

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      throw new Error("Unable to fetch distance");
    }

    return response.data.rows[0].elements[0];

  } catch (error) {

    throw new Error("Distance API error: " + error.message);

  }

};


// ADDRESS SUGGESTIONS
module.exports.getSuggestions = async (input) => {

  try {

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    const response = await axios.get(url);

    return response.data.predictions;

  } catch (error) {

    throw new Error("Autocomplete error: " + error.message);

  }

};


// CAPTAINS IN RADIUS
module.exports.getCaptainsInRadius = async (lat, lng, radius) => {

  const captains = await captainModel.find({

    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius / 6371],
      },
    },

  });

  return captains;

};