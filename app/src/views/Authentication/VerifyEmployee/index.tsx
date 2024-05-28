import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { validateAndOnboardEmployee } from "@/apis/auth.ts";
import { useState } from "react";

export default function VerifyEmployee() {
  const navigate = useNavigate();
  const location = useLocation();

  const code = new URLSearchParams(location.search).get("code");
  const employeeId = new URLSearchParams(location.search).get("employeeId");

  const [userName, setUserName] = useState("" as string);
  const [password, setPassword] = useState("" as string);
  const [confirmPassword, setConfirmPassword] = useState("" as string);
  const [accessCode, setAccessCode] = useState(code as string);

  async function handleCreateAccount() {
    try {
      if (!employeeId) {
        console.error("Employee ID missing");
        return;
      }
      if (password !== confirmPassword) {
        console.error("Password doesn't match");
        return;
      }

      await validateAndOnboardEmployee(
        employeeId,
        accessCode,
        userName,
        password,
      );
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container size={420} my={160}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Container p={8}>
          <Text fw={800} mb={8}>
            Employee account verification
          </Text>
          <PasswordInput
            label="Verification code"
            required
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            mb={8}
          />
          <TextInput
            label="Enter desired User name"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <PasswordInput
            label="Enter Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Your password"
            required
            mt="md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button fullWidth mt="xl" onClick={handleCreateAccount}>
            Create account
          </Button>
        </Container>
      </Paper>
    </Container>
  );
}
