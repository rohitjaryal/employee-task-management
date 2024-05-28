import {
  Button,
  Container,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Radio,
  TextInput,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { createNewAccessCode, loginAdmin, loginEmployee } from "@/apis/auth.ts";
import { useState } from "react";
import { useStorage } from "@/hooks/useStorage.ts";
import { POSSIBLE_USER_TYPE } from "@/utils/constants.ts";

export default function EmployeeLogin() {
  const navigate = useNavigate();

  const { setToken, setUserType, setUserInfo } = useStorage();

  async function handleLogIn() {
    try {
      const response = await loginEmployee(userName, password);
      setToken(response.token);
      setUserType(POSSIBLE_USER_TYPE.EMPLOYEE);
      setUserInfo({
        userType: POSSIBLE_USER_TYPE.EMPLOYEE,
        userName: response.userName,
      });
      navigate("/manage-employee");
    } catch (err) {
      console.error(err);
    }
  }

  const [userName, setUserName] = useState("" as string);
  const [password, setPassword] = useState("" as string);

  const [phoneNumber, setPhoneNumber] = useState("" as string);
  const [accessCode, setAccessCode] = useState("" as string);

  const [value, setValue] = useState("employee");

  async function handlePhoneNumberLogin() {
    try {
      const response = await loginAdmin(phoneNumber, accessCode);
      setToken(response.token);
      setUserType(POSSIBLE_USER_TYPE.ADMIN);
      setUserInfo({
        userType: POSSIBLE_USER_TYPE.ADMIN,
        userName: response.userName,
      });
      navigate("/manage-employee");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSendVerificationCode() {
    try {
      await createNewAccessCode(phoneNumber);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container size={420} my={160}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Radio.Group size="md" m={"md"} value={value} onChange={setValue}>
          <Group m="md" p="md">
            <Radio variant="outline" value="admin" label="Admin" />
            <Radio value="employee" label="Employee" />
          </Group>
        </Radio.Group>
        <Container hidden={value === "admin"}>
          <TextInput
            label="UserName"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth mt="xl" onClick={handleLogIn}>
            Log in
          </Button>
        </Container>
        <Container hidden={value === "employee"}>
          <Group grow justify="center">
            <TextInput
              label="Phone number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
              mt={20}
              variant="subtle"
              onClick={handleSendVerificationCode}
            >
              Send code
            </Button>
          </Group>
          <PasswordInput
            label="Access code"
            placeholder="Access code"
            required
            mt="md"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
          <Button fullWidth mt="xl" onClick={handlePhoneNumberLogin}>
            Log in
          </Button>
        </Container>
      </Paper>
    </Container>
  );
}
