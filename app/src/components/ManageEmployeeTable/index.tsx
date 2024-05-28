import { Button, Flex, Group, Stack, Table, Text } from "@mantine/core";
import { Employee } from "@/types";
import { AppDialog } from "@cmp/AppDialog/AppDialog.tsx";
import { CreateEmployee } from "@cmp/CreateEmployee";
import { useAppDialog } from "@/hooks/useAppDialog.tsx";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "@/apis/employees.api.ts";
import { UpdateEmployee } from "@cmp/UpdateEmployee";
import { useStorage } from "@/hooks/useStorage.ts";

type UsersTableProps = {
  data: Employee[];
  columns?: string[];
  onRefresh: () => void;
};
export function ManageEmployeeTable({ data, onRefresh }: UsersTableProps) {
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

  const { isAdmin } = useStorage();

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
            {item.name}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.employeeId}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.role}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.email}
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
          {isAdmin && (
            <Button variant="light" onClick={() => openCreateDialog()}>
              Create employee
            </Button>
          )}
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
              <Table.Th>ID</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <AppDialog
        opened={deleteDialogOpened}
        title={"Confirm"}
        onClose={closeDeleteDialog}
        children={
          <Stack p={12}>
            <div>Do you want to delete this employee</div>
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
        title={"Edit employee information"}
        onClose={closeEditDialog}
        children={
          <UpdateEmployee onUpdate={handleUpdate} {...editDialogProps} />
        }
      />
      <AppDialog
        opened={createDialogOpened}
        title={"Create employee"}
        onClose={closeCreateDialog}
        children={<CreateEmployee onCreate={handleCreate} />}
      />
    </>
  );
}
