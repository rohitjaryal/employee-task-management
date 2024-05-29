import { ReactNode } from "react";
import { Container, Flex } from "@mantine/core";
import ApiLoader from "@cmp/ApiLoader";
import { NavbarSimpleColored } from "@cmp/NavbarSimpleColored";
import { useLocation } from "react-router-dom";

type LayoutProviderProps = { children: ReactNode };

const authRoutes = ["/login", "/verify-employee"];

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const location = useLocation();
  return (
    <div>
      {authRoutes.includes(location.pathname) ? (
        children
      ) : (
        <Flex>
          <NavbarSimpleColored />
          <Container mt={"5rem"}>
            <ApiLoader>{children}</ApiLoader>
          </Container>
        </Flex>
      )}
    </div>
  );
}
