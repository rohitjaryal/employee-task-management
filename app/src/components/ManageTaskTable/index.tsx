import { Button, Flex, Group, Stack, Table, Text } from "@mantine/core";
import { Employee } from "@/types";
import { AppDialog } from "@cmp/AppDialog/AppDialog.tsx";
import { useAppDialog } from "@/hooks/useAppDialog.tsx";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "@/apis/employees.api.ts";
import { useStorage } from "@/hooks/useStorage.ts";
import { UpdateTask } from "@cmp/UpdateTask";
import { CreateTask } from "@cmp/CreateTask";

type UsersTableProps = {
  data: Employee[];
  columns?: string[];
  onRefresh: () => void;
};
export function ManageTaskTable({ data, onRefresh }: UsersTableProps) {
  const { isEmployee } = useStorage();

  const {
    dialogOpened: deleteDialogOpened,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
    dialogProps: deleteDialogProps,
  } = useAppDialog();

  const {
    dialogOpened: createDialogOpened,
    openDialog: openCreateDialog,
    closeDialog: closeCreateDialog,
  } = useAppDialog();

  const {
    dialogOpened: editDialogOpened,
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    dialogProps: editDialogProps,
  } = useAppDialog();

  async function handleDelete() {
    const employeeId = deleteDialogProps.employeeId;
    try {
      await deleteEmployee(employeeId);
      closeDeleteDialog();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate(
    email: string,
    name: string,
    role: string,
    address: string,
    phoneNumber: string,
  ) {
    try {
      await createEmployee(email, name, role, address, phoneNumber);
      closeCreateDialog();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdate(name?: string, role?: string, address?: string) {
    try {
      const employeeId = editDialogProps.employeeId;
      await updateEmployee(employeeId, name, role, address);
      closeEditDialog();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  }

  const rows =
    data &&
    data?.map((item) => (
      <Table.Tr key={item.employeeId}>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.taskName}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.status}
          </Text>
        </Table.Td>

        <Table.Td>
          <Group justify="center">
            <Button variant="subtle" onClick={() => openEditDialog(item)}>
              Edit
            </Button>
            <Button
              variant="subtle"
              onClick={() =>
                openDeleteDialog({
                  employeeId: item.employeeId,
                })
              }
              hidden={isEmployee}
            >
              Delete
            </Button>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <>
      <Table.ScrollContainer minWidth={800}>
        <Flex
          mih={50}
          gap="md"
          justify="flex-end"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          <Button
            variant="light"
            hidden={isEmployee}
            onClick={() => openCreateDialog()}
          >
            Create Task
          </Button>
        </Flex>
        <Table
          verticalSpacing="sm"
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <AppDialog
        opened={deleteDialogOpened}
        title={"Delete"}
        onClose={closeDeleteDialog}
        children={
          <Stack p={12}>
            <div>Do you want to delete this task</div>
            <Group mt={"xs"} justify={"flex-end"}>
              <Button variant={"subtle"} onClick={handleDelete}>
                Yes
              </Button>
            </Group>
          </Stack>
        }
        {...deleteDialogProps}
      />
      <AppDialog
        opened={editDialogOpened}
        title={"Edit"}
        onClose={closeEditDialog}
        children={<UpdateTask onUpdate={handleUpdate} {...editDialogProps} />}
      />
      <AppDialog
        opened={createDialogOpened}
        title={"Create"}
        onClose={closeCreateDialog}
        children={<CreateTask onCreate={handleCreate} />}
      />
    </>
  );
}
