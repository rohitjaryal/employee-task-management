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
import { IconMessage2 } from "@tabler/icons-react";
import { getUserInfo } from "@/utils/helper.ts";

const selfUserName = getUserInfo()?.userName;
const socket: any = io("http://localhost:5001", {
  auth: {
    username: selfUserName,
  },
});

let isRun = false;

export default function Chat() {
  const [selectedReceiver, setSelectedReceiver] = useState("");

  useEffect(() => {
    if (isRun) return;

    if (!isRun) {
      isRun = true;
    }
    const selfUserName = getUserInfo().userName;

    socket.on("users", (users: any) => {
      const filteredUsers = users.filter(
        (user) => user.connected && user.username !== selfUserName,
      );
      setUsers(filteredUsers);
    });

    socket.on("user connected", (user: any) => {
      if (user.username !== selfUserName) {
        const found = users.findIndex((info) => info.userID === user.userID);
        if (found === -1) {
          setUsers((prevState) => {
            return [...prevState, user];
          });
        }
      }
    });

    socket.on("private message", ({ content, from, to }) => {
      setMessages((prevState) => {
        const selectedReceiverConversation =
          prevState[selectedReceiver.userId] || [];
        return {
          ...prevState,
          [selectedReceiver.userId]: [
            ...selectedReceiverConversation,
            {
              text: content,
              sender: from,
            },
          ],
        };
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("private_message");
      // socket.close();
    };
  }, [selectedReceiver.userId]);

  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevState) => {
        console.log("send message", newMessage, selectedReceiver.userId);

        const selectedReceiverConversation =
          prevState[selectedReceiver.userId] || [];
        return {
          ...prevState,
          [selectedReceiver.userId]: [
            ...selectedReceiverConversation,
            {
              text: newMessage,
              sender: "user",
            },
          ],
        };
      });

      setNewMessage("");
      socket.emit("private message", {
        content: newMessage,
        to: selectedReceiver.userId,
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
                <Button
                  key={index}
                  onClick={() =>
                    setSelectedReceiver({
                      userName: user.username,
                      userId: user.userID,
                    })
                  }
                >
                  {user.username}
                </Button>
              ))}
            </Stack>
          </ScrollArea>
          <ScrollArea p={22} w={"50vw"} h={550} bg={"#b7c0c9"}>
            <Stack>
              Chat with {selectedReceiver?.userName}
              {messages[selectedReceiver.userId] &&
                messages[selectedReceiver.userId].map((message, index) => (
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
