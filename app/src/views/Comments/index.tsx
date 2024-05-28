import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  TextInput,
  Title,
} from "@mantine/core";
import { CommentsTable } from "@cmp/CommentsTable";
import { useEffect, useState } from "react";
import { addNewComment, getAllComments } from "@/apis/dashboard.ts";
import { IconMessages } from "@tabler/icons-react";

// const dummyData = {
//   kind: "youtube#commentThreadListResponse",
//   etag: "gorheQnbwvnz_1XyyhDOUXTgisM",
//   pageInfo: {
//     totalResults: 3,
//     resultsPerPage: 20,
//   },
//   items: [
//     {
//       kind: "youtube#commentThread",
//       etag: "Y_0jKoFlBG9nx0v7OceL-a5U35M",
//       id: "Ugz71jOCS59pcFbYRWx4AaABAg",
//       snippet: {
//         channelId: "UCxFRzTXb3wjh3CJwtI1O08Q",
//         videoId: "JkwRRGdFZ3E",
//         topLevelComment: {
//           kind: "youtube#comment",
//           etag: "M0Rijw-rE5-kPrkbbOyhtIJlmAQ",
//           id: "Ugz71jOCS59pcFbYRWx4AaABAg",
//           snippet: {
//             channelId: "UCxFRzTXb3wjh3CJwtI1O08Q",
//             videoId: "JkwRRGdFZ3E",
//             textDisplay: "wonderful",
//             textOriginal: "wonderful",
//             authorDisplayName: "Binary Logic",
//             authorProfileImageUrl:
//               "https://yt3.ggpht.com/ytc/APkrFKYfQojbXHIcIvnlmhVXz2sRY8fLoNiZPNqMPomJwnicFurJlxNRQJr5-NXwExzW=s48-c-k-c0x00ffffff-no-rj",
//             authorChannelUrl:
//               "http://www.youtube.com/channel/UCxFRzTXb3wjh3CJwtI1O08Q",
//             authorChannelId: {
//               value: "UCxFRzTXb3wjh3CJwtI1O08Q",
//             },
//             canRate: true,
//             viewerRating: "none",
//             likeCount: 0,
//             publishedAt: "2023-11-09T06:30:29Z",
//             updatedAt: "2023-11-09T06:30:29Z",
//           },
//         },
//         canReply: true,
//         totalReplyCount: 0,
//         isPublic: true,
//       },
//     },
//     {
//       kind: "youtube#commentThread",
//       etag: "p3XZcR2auYJozOFH3wRKMVuZ0Vs",
//       id: "UgwDUIGkpz8dovm_xc14AaABAg",
//       snippet: {
//         channelId: "UCxFRzTXb3wjh3CJwtI1O08Q",
//         videoId: "JkwRRGdFZ3E",
//         topLevelComment: {
//           kind: "youtube#comment",
//           etag: "NBJymBw5fNs2yH7-doV8pFfLqzI",
//           id: "UgwDUIGkpz8dovm_xc14AaABAg",
//           snippet: {
//             channelId: "UCxFRzTXb3wjh3CJwtI1O08Q",
//             videoId: "JkwRRGdFZ3E",
//             textDisplay: "great",
//             textOriginal: "great",
//             authorDisplayName: "Binary Logic",
//             authorProfileImageUrl:
//               "https://yt3.ggpht.com/ytc/APkrFKYfQojbXHIcIvnlmhVXz2sRY8fLoNiZPNqMPomJwnicFurJlxNRQJr5-NXwExzW=s48-c-k-c0x00ffffff-no-rj",
//             authorChannelUrl:
//               "http://www.youtube.com/channel/UCxFRzTXb3wjh3CJwtI1O08Q",
//             authorChannelId: {
//               value: "UCxFRzTXb3wjh3CJwtI1O08Q",
//             },
//             canRate: true,
//             viewerRating: "none",
//             likeCount: 0,
//             publishedAt: "2023-11-09T06:30:23Z",
//             updatedAt: "2023-11-09T06:30:23Z",
//           },
//         },
//         canReply: true,
//         totalReplyCount: 1,
//         isPublic: true,
//       },
//     },
//     {
//       kind: "youtube#commentThread",
//       etag: "YyisIOA1CO8PstYqLfsEVPqu0zA",
//       id: "UgxWWmKb8JoBW8LXLdh4AaABAg",
//       snippet: {
//         channelId: "UCxFRzTXb3wjh3CJwtI1O08Q",
//         videoId: "JkwRRGdFZ3E",
//         topLevelComment: {
//           kind: "youtube#comment",
//           etag: "uO51rziWYgMooPQwi8NPZI2lNlc",
//           id: "UgxWWmKb8JoBW8LXLdh4AaABAg",
//           snippet: {
//             channelId: "UCxFRzTXb3wjh3CJwtI1O08Q",
//             videoId: "JkwRRGdFZ3E",
//             textDisplay: "beauty",
//             textOriginal: "beauty",
//             authorDisplayName: "Binary Logic",
//             authorProfileImageUrl:
//               "https://yt3.ggpht.com/ytc/APkrFKYfQojbXHIcIvnlmhVXz2sRY8fLoNiZPNqMPomJwnicFurJlxNRQJr5-NXwExzW=s48-c-k-c0x00ffffff-no-rj",
//             authorChannelUrl:
//               "http://www.youtube.com/channel/UCxFRzTXb3wjh3CJwtI1O08Q",
//             authorChannelId: {
//               value: "UCxFRzTXb3wjh3CJwtI1O08Q",
//             },
//             canRate: true,
//             viewerRating: "none",
//             likeCount: 0,
//             publishedAt: "2023-11-09T06:30:18Z",
//             updatedAt: "2023-11-09T06:30:18Z",
//           },
//         },
//         canReply: true,
//         totalReplyCount: 0,
//         isPublic: true,
//       },
//     },
//   ],
// };

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");

  const refreshData = async () => {
    const response = await getAllComments();
    setComments(response.data);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await getAllComments();
      setComments(response.data);
    }
    fetchData();
  }, []);

  async function handleAddComment() {
    await addNewComment(userComment);
    setUserComment("");
    await refreshData();
  }

  return (
    <Container p={18}>
      <Center>
        <Divider
          my="m"
          color={"#FFFFF"}
          variant="dashed"
          labelPosition="center"
          label={
            <>
              <IconMessages size={22} />
              <Box ml={5}>
                <Title size={18}>Comments</Title>
              </Box>
            </>
          }
        />
      </Center>
      <Flex justify={"flex-end"} mt={22}>
        <TextInput
          placeholder="Comment"
          mr={12}
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
        />
        <Button onClick={handleAddComment} variant={"light"}>
          Add new comment
        </Button>
      </Flex>

      <CommentsTable data={comments?.items} refreshData={refreshData} />
    </Container>
  );
}
