import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useStorage } from "@/hooks/useStorage.ts";

const URL = import.meta.env.VITE_API_BASE_URL;

export const useChatSocket = (
  userName,
  commonUserIdentifier,
  onMessageReceived,
) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({ messages: [] });
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);

  const socketRef = useRef(io(URL, { autoConnect: false }));
  const socket = socketRef.current;

  const { getChatSession, setChatSession, deleteChatSession } = useStorage();

  useEffect(() => {
    if (commonUserIdentifier) {
      socket.auth = { username: userName, commonUserIdentifier };
      socket.connect();
    }
  }, [commonUserIdentifier]);

  useEffect(() => {
    const sessionID = getChatSession();

    if (sessionID) {
      setUsernameAlreadySelected(true);
      socket.auth = { sessionID };
      try {
        socket.connect();
      } catch (err) {
        console.error(err);
      }
    }

    socket.on("session", ({ sessionID, userID }) => {
      socket.auth = { sessionID };
      setChatSession(sessionID);
      socket.userID = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
      deleteChatSession();
    });

    socket.on("connect", () => {
      const usersCopy = users.map((user) => ({
        ...user,
        connected: user.self ? true : user.connected,
      }));
      setUsers(usersCopy);
    });

    socket.on("disconnect", () => {
      const usersCopy = users.map((user) => ({
        ...user,
        connected: user.self ? false : user.connected,
      }));
      setUsers(usersCopy);
    });

    const initReactiveProperties = (user) => {
      user.hasNewMessages = false;
    };

    socket.on("users", (newUsers) => {
      const usersCopy = [...users];
      newUsers.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        const existingUser = usersCopy.find((u) => u.userID === user.userID);
        if (existingUser) {
          existingUser.connected = user.connected;
          existingUser.messages = user.messages;
        } else {
          user.self = user.userID === socket.userID;
          initReactiveProperties(user);
          usersCopy.push(user);
        }
      });
      usersCopy.sort((a, b) =>
        a.self ? -1 : b.self ? 1 : a.username.localeCompare(b.username),
      );
      setUsers(usersCopy);
    });

    socket.on("user connected", (user) => {
      const usersCopy = users.map((u) =>
        u.userID === user.userID ? { ...u, connected: true } : u,
      );
      if (!users.some((u) => u.userID === user.userID)) {
        initReactiveProperties(user);
        usersCopy.push(user);
      }
      setUsers(usersCopy);
    });

    socket.on("user disconnected", (id) => {
      const usersCopy = users.map((u) =>
        u.userID === id ? { ...u, connected: false } : u,
      );
      setUsers(usersCopy);
    });

    socket.on("private message", ({ content, from, to }) => {
      const usersCopy = users.map((user) => {
        if (user.userID === (from === socket.userID ? to : from)) {
          const fromSelf = from === socket.userID;
          user.messages.push({ content, fromSelf });
          if (user !== selectedUser) user.hasNewMessages = true;
        }
        return user;
      });
      setUsers(usersCopy);
      onMessageReceived();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  }, [users, selectedUser]);

  return {
    users,
    selectedUser,
    setSelectedUser,
    usernameAlreadySelected,
    socket,
  };
};
