import passport from "passport";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

const http = require("http");
const apiServer = require("./api");
require("./firebase");
require("./utils/passport.js")(passport);

const server = http.createServer(apiServer);
const API_PORT = process.env.API_PORT || 5001;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const { InMemoryMessageStore } = require("./messageStore");
const messageStore = new InMemoryMessageStore();

io.engine.use((req: any, res: any, next: any) => {
  const isHandshake = req._query.sid === undefined;
  const userType = req.headers.usertype;

  if (!isHandshake) {
    next();
    return;
  }
  switch (userType) {
    case "ADMIN":
      passport.authenticate("admin-jwt", { session: false })(req, res, next);
      break;
    case "EMPLOYEE":
      passport.authenticate("employee-jwt", { session: false })(req, res, next);
      break;
    default:
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid userType" }));
  }
});

io.use((socket: any, next: any) => {
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
  const commonUserIdentifier = socket.handshake.auth.commonUserIdentifier;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = uuidv4();
  socket.username = username;
  socket.userID = commonUserIdentifier;
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
  const messagesPerUser = new Map();
  messageStore.findMessagesForUser(socket.userID).forEach((message: any) => {
    const { from, to } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });
  sessionStore.findAllSessions().forEach((session: any) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
      messages: messagesPerUser.get(session.userID) || [],
    });
  });
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    messages: [],
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({ content, to }: { content: any; to: any }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
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
