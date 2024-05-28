import { Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

interface UpdateEmployeeProps {
  name?: string;
  role?: string;
  address?: string;
  onUpdate: (name?: string, role?: string, address?: string) => void;
}
export const UpdateEmployee = (props: UpdateEmployeeProps) => {
  const { onUpdate, name: empName, role: empRole, address: empAddress } = props;
  const [name, setName] = useState(empName);
  const [role, setRole] = useState(empRole);
  const [address, setAddress] = useState(empAddress);

  const handleUpdateEmployee = () => {
    onUpdate(name, role, address);
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
          </Group>
          <Group>
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
            onClick={() => handleUpdateEmployee()}
          >
            Update
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
