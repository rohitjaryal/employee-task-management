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
import { useMemo, useRef, useState } from "react";
import {
  IconBrandHipchat,
  IconCircleArrowRight,
  IconMessage2,
} from "@tabler/icons-react";
import { useStorage } from "@/hooks/useStorage.ts";
import { useChatSocket } from "@/hooks/useChatSocket.ts";

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const { userName, commonUserIdentifier } = useStorage();

  const { users, selectedUser, setSelectedUser, socket } = useChatSocket(
    userName,
    commonUserIdentifier,
    onMessageReceived,
  );

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
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
  };

  function onMessageReceived() {
    scrollToBottom();
  }

  const usersExcludingMe = useMemo(() => {
    return users.filter((info) => info.userID !== commonUserIdentifier);
  }, [users, commonUserIdentifier]);

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
          <Text fw={500}>
            {selectedUser?.username
              ? "Chatting with"
              : " Please select user to chat with"}
          </Text>
          <Text ml={8} fw={700}>
            {selectedUser?.username}
          </Text>
        </Flex>
      </Center>
      <Container>
        <Flex>
          <ScrollArea w={"15vw"} h={550} bg={"#e3eaec"}>
            <Stack p={8}>
              {usersExcludingMe.map((user) => (
                <Button
                  justify="center"
                  fullWidth
                  size="lg"
                  key={user.userID}
                  variant="gradient"
                  gradient={{ from: "green", to: "gray", deg: 177 }}
                  leftSection={<IconBrandHipchat size={26} />}
                  onClick={() => setSelectedUser(user)}
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
