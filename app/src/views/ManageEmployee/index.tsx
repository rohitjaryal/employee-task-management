import { Box, Center, Container, Divider, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { Employee } from "@/types";
import { ManageEmployeeTable } from "@cmp/ManageEmployeeTable";
import { IconActivityHeartbeat, IconDeviceLaptop } from "@tabler/icons-react";
import { getAllEmployees } from "@/apis/employees.api.ts";

export default function ManageEmployee() {
  const [employeesData, setEmployeesData] = useState([] as Employee[]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await getAllEmployees();
    setEmployeesData(response.employees);
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
              <IconDeviceLaptop size={22} />
              <Box ml={5}>
                <Title size={18}>Manage Employee</Title>
              </Box>
            </>
          }
        />
      </Center>
      <ManageEmployeeTable data={employeesData} onRefresh={fetchData} />
    </Container>
  );
}
