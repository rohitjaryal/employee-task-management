import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  rem,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconQuote, IconTrash } from "@tabler/icons-react";
import {
  getAllReplies,
  removeComment,
  replyComment,
} from "@/apis/dashboard.ts";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

type CommentsTableProps = {
  data: any[];
  columns?: string[];
  refreshData: () => void;
};
export function CommentsTable({ data, refreshData }: CommentsTableProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const [repliesOpened, { open: openReply, close: closeReply }] =
    useDisclosure(false);

  const [reply, setReply] = useState("");
  const [replyCommentId, setReplyCommentID] = useState("");
  const [allRepliesData, setAllRepliesData] = useState("");

  async function handleRemoveComment(commentId: string) {
    await removeComment(commentId);
    refreshData();
  }

  async function handleAllReplies(commentId: string) {
    const response = await getAllReplies(commentId);
    setAllRepliesData(response?.data?.items);
    openReply();
  }

  const rows =
    data &&
    data?.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>
          <Group gap="sm">
            <Avatar
              size={30}
              src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
              radius={30}
            />
            <Text fz="sm" fw={500}>
              {item.snippet.topLevelComment.snippet.authorDisplayName}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text fz="sm">
            {item.snippet.topLevelComment.snippet.textDisplay}
          </Text>
        </Table.Td>

        <Table.Td>{item.snippet.topLevelComment.snippet.likeCount}</Table.Td>
        <Table.Td>
          <Button
            variant={"transparent"}
            disabled={item.snippet.totalReplyCount < 1}
            onClick={() => handleAllReplies(item.snippet.topLevelComment.id)}
          >
            {item.snippet.totalReplyCount}
          </Button>
        </Table.Td>

        <Table.Td>
          <Text fz="sm">
            {item.snippet.topLevelComment.snippet.publishedAt}
          </Text>
        </Table.Td>
        <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon variant="subtle" color="gray">
              <IconQuote
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                onClick={() => {
                  setReplyCommentID(item.snippet.topLevelComment.id);
                  open();
                }}
              />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red">
              <IconTrash
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                onClick={() =>
                  handleRemoveComment(item.snippet.topLevelComment.id)
                }
              />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

  async function handleSendReply() {
    await replyComment(reply, replyCommentId);
    refreshData();
    close();
  }

  return (
    <>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Commenter</Table.Th>
              <Table.Th>Comment</Table.Th>
              <Table.Th>Like Count</Table.Th>
              <Table.Th>Total Replies</Table.Th>
              <Table.Th>Published At</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Modal
        opened={opened}
        onClose={close}
        title="Reply"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 1,
        }}
      >
        <Flex p={4} justify={"flex-start"}>
          <TextInput
            value={reply}
            onChange={(e) => {
              setReply(e.target.value);
            }}
            mr={12}
          />
          <Button onClick={() => handleSendReply()}>Send reply</Button>
        </Flex>
      </Modal>

      <Modal
        opened={repliesOpened}
        onClose={closeReply}
        title="Reply"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 1,
        }}
      >
        <Box p={4}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Comment</Table.Th>
                <Table.Th>Commenter</Table.Th>
                <Table.Th>Channel URL</Table.Th>
                <Table.Th>Likes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {allRepliesData &&
                allRepliesData?.map((element) => (
                  <Table.Tr key={element.id}>
                    <Table.Td>{element.snippet.textDisplay}</Table.Td>
                    <Table.Td>
                      <Flex justify={"space-between"} align={"center"}>
                        <Avatar
                          size={30}
                          src={element.snippet.authorProfileImageUrl}
                          radius={30}
                        />
                        {element.snippet.authorDisplayName}
                      </Flex>
                    </Table.Td>
                    <Table.Td>
                      <Anchor
                        href={element.snippet.authorChannelUrl}
                        target="_blank"
                        underline="hover"
                      >
                        Link
                      </Anchor>
                    </Table.Td>
                    <Table.Td>{element.snippet.likeCount}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Modal>
    </>
  );
}
