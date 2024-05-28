import {Anchor, Container, Group, Text} from "@mantine/core";
import classes from "./index.module.css";

export function AppFooter() {
  return (
    <footer className={classes.footer}>
      <Container className={classes.afterFooter}>
        <Text variant="subtle" style={{ color: "var(--mantine-color-black)" }}>
          Developed by
          <Anchor
            href={"https://roej.dev"}
            ml={4}
            mr={4}
            target="_blank"
          >
            roej.dev
          </Anchor>
          © 2023 All rights reserved.
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >

        </Group>
      </Container>
    </footer>
  );
}
