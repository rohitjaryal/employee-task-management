import { firebaseDB } from "../firebase";
import { EMPLOYEE_TASK_STATUS } from "../utils/constants";

const employeeTasksCollection = "employee_tasks";

async function createTask(
  employeeId: string,
  taskId: string,
  taskName: string,
) {
  const docRef = firebaseDB.collection(employeeTasksCollection).doc(taskId);
  await docRef.set({
    employeeId,
    taskName,
    status: EMPLOYEE_TASK_STATUS.PENDING,
    taskId,
  });
  const document = await docRef.get();
  return document.data();
}

async function updateTask(
  employeeId: string,
  taskId: string,
  taskStatus: EMPLOYEE_TASK_STATUS,
) {
  const employeeRef = firebaseDB.collection(employeeTasksCollection);
  const snapshot = await employeeRef
    .where("employeeId", "==", employeeId)
    .where("taskId", "==", taskId)
    .get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  let docList: any[] = [];
  snapshot.forEach((doc: any) => {
    docList.push(doc);
  });

  let updateDocs: Promise<any>[] = [];
  docList.forEach((doc) => {
    updateDocs.push(
      employeeRef.doc(doc.id).update({
        taskStatus,
      }),
    );
  });

  return await Promise.allSettled(updateDocs);
}

async function getAllTasks(employeeId: string) {
  const tasksRef = firebaseDB.collection(employeeTasksCollection);
  const snapshot = await tasksRef.where("employeeId", "==", employeeId).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  let results: any[] = [];

  snapshot.forEach((doc: any) => {
    results.push(doc.data());
  });

  return results;
}

async function getAllEmployeeTasks() {
  const tasksRef = firebaseDB.collection(employeeTasksCollection);
  const snapshot = await tasksRef.get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  let results: any[] = [];

  snapshot.forEach((doc: any) => {
    results.push(doc.data());
  });
  return results;
}

export { createTask, updateTask, getAllTasks, getAllEmployeeTasks };
