import { Application } from "express";
import passport from "passport";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
require("dotenv").config();

const http = require("http");
const apiServer = require("./api");
require("./firebase");
require("./utils/passport.js")(passport);

const server = http.createServer(apiServer);
const API_PORT = process.env.API_PORT || 5001;

//Socket IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();
import { v4 as uuidv4 } from "uuid";

io.use((socket: any, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = uuidv4();
  socket.userID = uuidv4();
  socket.username = username;
  next();
});

io.on("connection", (socket: any) => {
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  const users: any[] = [];
  sessionStore.findAllSessions().forEach((session: any) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
    });
  });
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({ content, to }: { content: any; to: any }) => {
    console.log("message received::", content, to);
    socket.to(to).to(socket.userID).emit("private message", {
      content,
      from: socket.userID,
      to,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
  });
});

async function startServer() {
  server.listen(API_PORT);
}

startServer().then(() => {
  console.log(`Listening on port ${API_PORT}....`);
});