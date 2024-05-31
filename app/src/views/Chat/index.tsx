import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconBrandHipchat,
  IconCircleArrowRight,
  IconMessage2,
} from "@tabler/icons-react";
import { io } from "socket.io-client";
import { useStorage } from "@/hooks/useStorage.ts";

const URL = "http://localhost:5001";

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<[]>([]);
  const [selectedUser, setSelectedUser] = useState({
    messages: [],
  });
  const [usernameAlreadySelected, setUsernameAlreadySelected] =
    useState<boolean>(false);

  const { userName, commonUserIdentifier } = useStorage();

  const socketRef = useRef(io(URL, { autoConnect: false }));
  const socket = socketRef.current;

  console.log("commonUserIdentifier:>", commonUserIdentifier);

  const usersExcludingMe = useMemo(() => {
    return users.filter((info) => info.userID !== commonUserIdentifier);
  }, [users]);

  useEffect(() => {
    if (commonUserIdentifier) {
      console.log("socket connecting.", userName);
      socket.auth = { username: userName, commonUserIdentifier };
      socket.connect();
    }
  }, [commonUserIdentifier, socket]);

  useEffect(() => {
    // --> this can be on base component mount for eg. App.tsx
    const sessionID = localStorage.getItem("sessionID");

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
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
      console.log("test:>");
      // incase of server down, clear the session id.
      localStorage.removeItem("sessionID");
    });

    socket.on("connect", () => {
      const usersCopy = [...users];
      usersCopy.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
      setUsers(usersCopy);
    });

    socket.on("disconnect", () => {
      const usersCopy = [...users];
      usersCopy.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
      setUsers(usersCopy);
    });

    const initReactiveProperties = (user) => {
      user.hasNewMessages = false;
    };

    socket.on("users", (users) => {
      const usersCopy = [...users];
      usersCopy.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        for (let i = 0; i < usersCopy.length; i++) {
          const existingUser = usersCopy[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        users.push(user);
      });
      // put the current user first, and sort by username
      usersCopy.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(usersCopy);
    });

    socket.on("user connected", (user) => {
      const usersCopy = [...users];
      for (let i = 0; i < usersCopy.length; i++) {
        const existingUser = usersCopy[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      initReactiveProperties(user);
      setUsers([...usersCopy, user]);
    });

    socket.on("user disconnected", (id) => {
      const usersCopy = [...users];
      for (let i = 0; i < usersCopy.length; i++) {
        const user = usersCopy[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
      setUsers(usersCopy);
    });

    socket.on("private message", ({ content, from, to }) => {
      const usersCopy = [...users];
      console.log("print", users);
      for (let i = 0; i < usersCopy.length; i++) {
        const user = usersCopy[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf,
          });
          if (user !== selectedUser) {
            user.hasNewMessages = true;
          }
          setUsers(usersCopy);
          break;
        }
      }
      scrollToBottom();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  }, [selectedUser, socket, users]);

  function handleSendMessage() {
    if (selectedUser) {
      socket.emit("private message", {
        content: newMessage,
        to: selectedUser.userID,
      });

      const copySelectedUser = { ...selectedUser };

      copySelectedUser.messages.push({
        content: newMessage,
        fromSelf: true,
      });

      setSelectedUser(copySelectedUser);
      setNewMessage("");
      scrollToBottom();
    }
  }

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container>
      <Center mb={24}>
        <Divider
          my="m"
          color={"#FFFFF"}
          variant="dashed"
          labelPosition="center"
          label={
            <>
              <IconMessage2 size={22} />
              <Box ml={5}>
                <Title size={18}>Chat</Title>
              </Box>
            </>
          }
        />
      </Center>
      <Center>
        <Flex>
          <Text fw={500}>Chatting with </Text>
          <Text ml={8} fw={700}>
            {selectedUser?.username}
          </Text>
        </Flex>
      </Center>
      <Container>
        <Flex>
          <ScrollArea w={"15vw"} h={550} bg={"#e3eaec"}>
            <Stack p={8}>
              {usersExcludingMe.map((user, index) => (
                <Button
                  justify="center"
                  fullWidth
                  size="lg"
                  key={user.userID}
                  variant="gradient"
                  gradient={{ from: "green", to: "gray", deg: 177 }}
                  leftSection={<IconBrandHipchat size={26} />}
                  onClick={() => {
                    setSelectedUser(user);
                  }}
                >
                  {user.username}
                </Button>
              ))}
            </Stack>
          </ScrollArea>

          <ScrollArea p={22} w={"50vw"} h={550} bg={"#b7c0c9"}>
            <Stack>
              {selectedUser?.messages?.length &&
                selectedUser.messages.map((message, index) => (
                  <Flex
                    key={index}
                    p="md"
                    style={{
                      justifyContent: message.fromSelf
                        ? "flex-end"
                        : "flex-start",
                      textAlign: message.fromSelf ? "left" : "right",
                    }}
                  >
                    <Text
                      pt={6}
                      pb={6}
                      pl={12}
                      pr={12}
                      style={{
                        borderRadius: "14px",
                        background: message.fromSelf ? "#85af7c" : "#acb0ab",
                      }}
                    >
                      {message.content}
                    </Text>
                    <div ref={messagesEndRef} />
                  </Flex>
                ))}
            </Stack>
          </ScrollArea>
        </Flex>

        <Group p={12}>
          <TextInput
            placeholder="Type a message"
            value={newMessage}
            onChange={(event) => setNewMessage(event.currentTarget.value)}
            style={{ flexGrow: 1 }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!selectedUser.userID}
            justify="center"
            size="lg"
            variant="gradient"
            gradient={{ from: "cyan", to: "gray", deg: 177 }}
            leftSection={<IconCircleArrowRight size={26} />}
          >
            Send
          </Button>
        </Group>
      </Container>
    </Container>
  );
}
