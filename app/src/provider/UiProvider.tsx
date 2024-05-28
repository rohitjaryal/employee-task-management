import "@mantine/core/styles.css";
import { createTheme, MantineProvider, rem } from "@mantine/core";
import { ReactNode } from "react";

const theme = createTheme({
  colors: {
    pink: [
      "#E9EDFC",
      "#C1CCF6",
      "#e14e4e",
      "#E9EDFC",
      "#C1CCF6",
      "#e14e4e",
      "#E9EDFC",
      "#C1CCF6",
      "#e14e4e",
      "#e14e4e",
    ],
    "bg-color-2": [
      "#E9EDFC",
      "#C1CCF6",
      "#99ABF0",
      "#E9EDFC",
      "#C1CCF6",
      "#e14e4e",
      "#E9EDFC",
      "#C1CCF6",
      "#e14e4e",
      "#e14e4e",
    ],
  },
  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },
  fontFamily: "Lato, sans-serif;",
  headings: {
    fontFamily: "Lato, sans-serif;",
    sizes: {
      h1: { fontSize: rem(36) },
      h2: { fontSize: rem(30) },
    },
  },

});

type UiProviderProps = { children: ReactNode };

export default function UiProvider({ children }: UiProviderProps) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
