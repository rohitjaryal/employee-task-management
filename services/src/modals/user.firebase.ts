import { firebaseDB } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const userCollection = "users";

async function addNewUser(
  email: string,
  firstName: string,
  lastName: string,
  encryptedPassword: string,
) {
  // const docRef = firebaseDB.collection(userCollection).doc(email);
  // await docRef.set({
  //   first_name: firstName,
  //   last_name: lastName,
  //   email: email.toLowerCase(),
  //   password: encryptedPassword,
  // });
  //
  // return docRef.get();
}
async function getUser(email: string) {
  // const doc = await firebaseDB.collection(userCollection).doc(email).get();
  // return doc.data();
}

async function getToken(email: string) {
  // const doc = await firebaseDB.collection(userCollection).doc(email).get();
  // return doc.data();
}

async function saveAccessCode(phoneNumber: string, accessCode: string) {
  const docRef = firebaseDB.collection(userCollection).doc(phoneNumber);
  await docRef.set({
    phoneNumber,
    accessCode,
    _id: uuidv4(),
  });
}

async function fetchUserRecord(phoneNumber: string) {
  const doc = await firebaseDB
    .collection(userCollection)
    .doc(phoneNumber)
    .get();
  return doc.data();
}

async function fetchAdminCredentialsById(userId: string) {
  const employeeRef = firebaseDB.collection(userCollection);
  const snapshot = await employeeRef.where("_id", "==", userId).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  let documentId = "";
  snapshot.forEach((doc: any) => {
    documentId = doc.id;
  });

  const document = await firebaseDB.collection(userCollection).doc(documentId);

  const result = await document.get();
  return result.data();
}

async function saveWebToken(
  phoneNumber: string,
  hashedPassword: {
    hash: string;
    salt: string;
  },
) {
  const docRef = firebaseDB.collection(userCollection).doc(phoneNumber);
  return await docRef.update({
    password: hashedPassword.hash,
    salt: hashedPassword.salt,
  });
}

export {
  saveAccessCode,
  fetchUserRecord,
  saveWebToken,
  fetchAdminCredentialsById,
};
