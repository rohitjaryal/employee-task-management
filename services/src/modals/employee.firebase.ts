import { firebaseDB } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { EMPLOYEE_VERIFICATION_STATUS } from "../utils/constants";

const employeeCollection = "employee";
const employeeCredentialsCollection = "employee_credentials";

async function saveNewEmployee(
  email: string,
  name: string,
  role: string,
  address: string,
  accessCode: string,
  verificationStatus: EMPLOYEE_VERIFICATION_STATUS,
  phoneNumber: string,
) {
  const employeeId = uuidv4(); // !Important .Change this to something easy to store n search.
  const docRef = firebaseDB.collection(employeeCollection).doc(employeeId);
  await docRef.set({
    name,
    email: email.toLowerCase(),
    role,
    address,
    employeeId,
    accessCode,
    accessCodeGeneratedAt: new Date(),
    verificationStatus,
    phoneNumber,
  });
  const document = await docRef.get();
  return document.data();
}
async function getEmployee(employeeId: string) {
  const doc = await firebaseDB.collection(employeeCollection).doc(employeeId);
  const result = await doc.get();
  return result.data();
}

async function getAllEmployees() {
  const employeeRef = firebaseDB.collection(employeeCollection);

  const snapshot = await employeeRef.get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  let docList: Promise<any>[] = [];
  snapshot.forEach((doc: any) => {
    docList.push(doc);
  });

  const data: any[] = [];
  await Promise.allSettled(docList).then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        data.push(result.value.data());
      }
    });
  });

  return data;
}

async function deleteEmployee(employeeId: string) {
  const doc = await firebaseDB.collection(employeeCollection).doc(employeeId);
  await doc.delete();
}

async function updateEmployee(
  email: string,
  updatedData: {
    accessCode?: string;
    accessCodeGeneratedAt?: Date;
  },
) {
  const employeeRef = firebaseDB.collection(employeeCollection);
  const snapshot = await employeeRef.where("email", "==", email).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  let documentId = "";
  snapshot.forEach((doc: any) => {
    documentId = doc.id;
  });

  const document = await firebaseDB
    .collection(employeeCollection)
    .doc(documentId);
  await document.update({
    ...updatedData,
  });
}

async function updateEmployeeById(
  empId: string,
  updatedData: {
    address?: string;
    name?: string;
    role?: string;
  },
) {
  const document = await firebaseDB.collection(employeeCollection).doc(empId);
  await document.update({
    ...updatedData,
  });
}

async function validateCode(employeeId: string, accessCode: string) {
  const doc = await firebaseDB.collection(employeeCollection).doc(employeeId);
  const result = await doc.get();
  if (accessCode !== result.data()?.accessCode) {
    throw new Error("The provided access code is invalid.");
  }
}

async function addEmployeeCredentials(
  employeeId: string,
  userName: string,
  password: {
    salt: string;
    hash: string;
  },
) {
  // add transaction control here.
  const docRef = firebaseDB
    .collection(employeeCredentialsCollection)
    .doc(employeeId);

  await docRef.set({
    _id: uuidv4(),
    employeeId,
    userName,
    password: password.hash,
    salt: password.salt,
    verificationStatus: EMPLOYEE_VERIFICATION_STATUS.VERIFIED,
  });
}

async function fetchUserCredentials(userName: string) {
  const employeeRef = firebaseDB.collection(employeeCredentialsCollection);
  const snapshot = await employeeRef.where("userName", "==", userName).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  let documentId = "";
  snapshot.forEach((doc: any) => {
    documentId = doc.id;
  });

  const document = await firebaseDB
    .collection(employeeCredentialsCollection)
    .doc(documentId);

  const result = await document.get();
  return result.data();
}

async function fetchUserCredentialsById(userId: string) {
  const employeeRef = firebaseDB.collection(employeeCredentialsCollection);
  const snapshot = await employeeRef.where("_id", "==", userId).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  let documentId = "";
  snapshot.forEach((doc: any) => {
    documentId = doc.id;
  });

  const document = await firebaseDB
    .collection(employeeCredentialsCollection)
    .doc(documentId);

  const result = await document.get();
  return result.data();
}

export {
  saveNewEmployee,
  getEmployee,
  deleteEmployee,
  updateEmployee,
  getAllEmployees,
  updateEmployeeById,
  validateCode,
  addEmployeeCredentials,
  fetchUserCredentials,
  fetchUserCredentialsById,
};
