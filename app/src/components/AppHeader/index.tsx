import { Box, Burger, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import classes from "./index.module.css";
import { logOffUser } from "@/apis/auth.ts";

const links = [
  { link: "/manage-employee", label: "Manage Employee" },
  { link: "/comments", label: "Comments" },
];

export function AppHeader() {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const navigate = useNavigate();

  const items = links.map((link) => (
    <NavLink
      key={link.label}
      className={classes.link}
      data-active={location.pathname === link.link || undefined}
      to={link.link}
    >
      {link.label}
    </NavLink>
  ));

  async function handleLogOff() {
    await logOffUser();
    navigate("/login");
  }

  const hideHeader = ["/login", "/"].includes(location.pathname);

  return (
    <header className={classes.header} hidden={true}>
      <Box className={classes.inner} hidden={hideHeader}>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm">
          {opened && (
            <div
              style={{
                position: "absolute",
                top: 20,
                width: 200,
                left: 30,
                marginLeft: "15px",
                zIndex: 99,
                color: "black",
              }}
            >
              {items}
            </div>
          )}
        </Burger>
      </Box>
      <Box hidden={hideHeader}>
        <Button variant="subtle" onClick={handleLogOff}>
          Log off
        </Button>
      </Box>
    </header>
  );
}
