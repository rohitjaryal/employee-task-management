import { Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

interface CreateEmployeeProps {
  onCreate: (
    email: string,
    name: string,
    role: string,
    address: string,
    phoneNumber: string,
  ) => void;
}
export const CreateEmployee = (props: CreateEmployeeProps) => {
  const { onCreate } = props;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCreateEmployee = () => {
    onCreate(email, name, role, address, phoneNumber);
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <form>
        <Stack>
          <Group>
            <TextInput
              required
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              radius="md"
            />
            <TextInput
              required
              value={phoneNumber}
              label="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              radius="md"
            />
          </Group>
          <Group>
            <TextInput
              value={email}
              required
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              radius="md"
            />
            <TextInput
              value={role}
              required
              label="Role"
              onChange={(e) => setRole(e.target.value)}
              radius="md"
            />
          </Group>
          <TextInput
            required
            value={address}
            label="Address"
            onChange={(e) => setAddress(e.target.value)}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Button
            type="submit"
            radius="xl"
            onClick={() => handleCreateEmployee()}
          >
            Create
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
