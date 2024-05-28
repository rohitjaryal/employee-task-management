import { useState } from "react";
import { Code, Group } from "@mantine/core";
import {
  IconDeviceLaptop,
  IconListCheck,
  IconLogout,
  IconMessage2,
} from "@tabler/icons-react";
import classes from "./index.module.css";
import { useStorage } from "@/hooks/useStorage.ts";
import { useNavigate } from "react-router-dom";

const data = [
  {
    link: "/manage-employee",
    label: "Manage Employee",
    icon: IconDeviceLaptop,
  },
  { link: "/manage-tasks", label: "Manage Tasks", icon: IconListCheck },
  { link: "/chat", label: "Chat", icon: IconMessage2 },
];

export function NavbarSimpleColored() {
  const [active, setActive] = useState("Manage Employee");

  const { getUserType } = useStorage();

  const navigate = useNavigate();
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        navigate(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Code fw={700} className={classes.version}>
            User type: {getUserType()}
          </Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
