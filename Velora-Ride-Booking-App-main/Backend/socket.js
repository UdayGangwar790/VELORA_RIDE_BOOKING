require("dotenv").config();

const socketIo = require("socket.io");

const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;


// INITIALIZE SOCKET
function initializeSocket(server) {

  io = socketIo(server, {

    cors: {
      origin: process.env.SOCKET_ORIGIN || "*",
      methods: ["GET", "POST"],
    },

  });

  io.on("connection", (socket) => {

    console.log("Client connected:", socket.id);


    socket.on("join", async (data) => {

      const { userId, userType } = data;

      if (userType === "user") {

        await userModel.findByIdAndUpdate(userId, {
          socketid: socket.id,
        });

      }

      if (userType === "captain") {

        await captainModel.findByIdAndUpdate(userId, {
          socketid: socket.id,
        });

      }

    });


    socket.on("update-location-captain", async (data) => {

      const { userId, location } = data;

      if (!location || !location.lat || !location.lng) {
        return;
      }

      await captainModel.findByIdAndUpdate(userId, {

        location: {
          lat: location.lat,
          lng: location.lng,
        },

      });

    });


    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

  });

  return io;

}


// SEND MESSAGE
const sendMessageToSocketId = (socketId, messageObject) => {

  if (!io) {
    console.log("Socket not initialized");
    return;
  }

  io.to(socketId).emit(messageObject.event, messageObject.data);

};


module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};