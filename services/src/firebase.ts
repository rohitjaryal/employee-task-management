import path from "path";

const admin = require("firebase-admin");

const FIREBASE_ACCOUNT_FILE = process.env.FIREBASE_SECRET_ACCOUNT_FILE;
if (!FIREBASE_ACCOUNT_FILE) {
  console.error(
    "Please provide valid Firebase service account file. Check Env file for configuration.",
  );
}
const serviceAccount = require(
  path.join(__dirname, "..", `${FIREBASE_ACCOUNT_FILE}`),
);

// 'database' is an older way for storing data. Enable this one in case you're using it.
// const { getDatabase } = require("firebase-admin/database");
const { getFirestore } = require("firebase-admin/firestore");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseDB = getFirestore();

export { firebaseDB };
