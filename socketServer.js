const http = require("http");
const { Server } = require("socket.io");

let io;
const onlineUsers = new Map();

function initSocketServer(app) {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      onlineUsers.set(String(userId), socket.id);
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  return server;
}

function getIO() {
  return io;
}

function getOnlineUsers() {
  return onlineUsers;
}

module.exports = {
  initSocketServer,
  getIO,
  getOnlineUsers,
};
