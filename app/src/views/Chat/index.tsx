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
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useStorage } from "@/hooks/useStorage.ts";
import { IconMessage2 } from "@tabler/icons-react";

export default function Chat() {
  const { getUserInfo } = useStorage();
  let socket: any;

  useEffect(() => {
    const selfUserName = getUserInfo().userName;
    socket = io("http://localhost:5001", {
      auth: {
        username: selfUserName,
      },
    });

    socket.on("users", (users: any) => {
      const filteredUsers = users.filter(
        (user) => user.connected && user.username !== selfUserName,
      );

      // filteredUsers.forEach((info) => {
      // setUsers((prevState) => [...prevState, info]);
      // });

      setUsers(filteredUsers);
    });

    socket.on("private message", ({ content, from, to }) => {
      // for (let i = 0; i < this.users.length; i++) {
      //   const user = this.users[i];
      //   const fromSelf = socket.userID === from;
      //   if (user.userID === (fromSelf ? to : from)) {
      //     user.messages.push({
      //       content,
      //       fromSelf,
      //     });
      //     if (user !== this.selectedUser) {
      //       user.hasNewMessages = true;
      //     }
      //     break;
      //   }
      // }
    });
  }, []);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "user" },
    { id: 2, text: "Hi there!", sender: "admin" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: "user" },
      ]);
      setNewMessage("");
      socket.emit("private message", {
        content: newMessage,
        to: "rohit",
      });
    }
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
      <Container>
        <Flex>
          <ScrollArea w={"10vw"} h={550} bg={"#e3eaec"}>
            <Stack p={8}>
              {users.map((user, index) => (
                <Button key={index}>{user.username}</Button>
              ))}
            </Stack>
          </ScrollArea>
          <ScrollArea p={22} w={"50vw"} h={550} bg={"#b7c0c9"}>
            <Stack>
              {messages.map((message, index) => (
                <Flex
                  key={index}
                  p="md"
                  style={{
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    textAlign: message.sender === "user" ? "left" : "right",
                  }}
                >
                  <Text
                    pt={6}
                    pb={6}
                    pl={12}
                    pr={12}
                    style={{
                      borderRadius: "14px",
                      background:
                        message.sender === "user" ? "#89eb7f" : "#a1a8a0",
                    }}
                  >
                    {message.text}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </ScrollArea>
        </Flex>

        <Group pb={12}>
          <TextInput
            placeholder="Type a message"
            value={newMessage}
            onChange={(event) => setNewMessage(event.currentTarget.value)}
            style={{ flexGrow: 1 }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </Group>
      </Container>
    </Container>
  );
}
