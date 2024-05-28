import { Button, Group, Paper, Select, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

interface UpdateEmployeeProps {
  status?: string;
  onUpdate: (name?: string, role?: string, address?: string) => void;
}
export const UpdateTask = (props: UpdateEmployeeProps) => {
  const { onUpdate, status: taskStatus } = props;
  const [status, setStatus] = useState<string | null>("");

  const handleUpdateTask = () => {
    if (status) {
      onUpdate(status);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <form>
        <Stack>
          <Group>
            <Select
              label="Choose Status"
              placeholder="Pick value"
              data={["In Progress", "Done"]}
              defaultValue={taskStatus}
              value={status}
              onChange={setStatus}
            />
          </Group>
        </Stack>

        <Group justify="space-between" mt="xl">
          <Button type="submit" radius="xl" onClick={() => handleUpdateTask()}>
            Update
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
