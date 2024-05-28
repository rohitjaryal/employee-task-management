import { Box, Center, Container, Divider, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Employee } from "@/types";
import { IconListCheck } from "@tabler/icons-react";
import { ManageTaskTable } from "@cmp/ManageTaskTable";
import {
  getAllTasksForAllEmployees,
  getAllTasksForEmployee,
} from "@/apis/tasks.api.ts";
import { useStorage } from "@/hooks/useStorage.ts";

export default function ManageTasks() {
  const [employeesData, setEmployeesData] = useState([] as Employee[]);
  const { isEmployee, isAdmin } = useStorage();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (isEmployee) {
      const response = await getAllTasksForEmployee();
      setEmployeesData(response.response);
    } else if (isAdmin) {
      const response = await getAllTasksForAllEmployees();
      setEmployeesData(response.response);
    }
  }

  return (
    <Container>
      <Center mb={24}>
        <Divider
          my="m"
          color={"#FFFFF"}
          variant="dashed"
          labelPosition="center"
          label={
            <>
              <IconListCheck size={22} />
              <Box ml={5}>
                <Title size={18}>Manage Tasks</Title>
              </Box>
            </>
          }
        />
      </Center>
      <ManageTaskTable data={employeesData} onRefresh={fetchData} />
    </Container>
  );
}
