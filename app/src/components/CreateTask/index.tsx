import { Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

interface CreateTaskProps {
  onCreate: (taskName: string) => void;
}
export const CreateTask = (props: CreateTaskProps) => {
  const { onCreate } = props;
  const [taskName, setTaskName] = useState("");

  const handleCreateEmployee = () => {
    onCreate(taskName);
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <form>
        <Stack>
          <TextInput
            value={taskName}
            required
            label="Task name"
            onChange={(e) => setTaskName(e.target.value)}
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
