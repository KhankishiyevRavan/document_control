import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsCeqm3FPjrjUHsuvanba-9Urg2FZ5F2I",
  authDomain: "document-control-nd.firebaseapp.com",
  projectId: "document-control-nd",
  storageBucket: "document-control-nd.appspot.com",
  messagingSenderId: "851748835904",
  appId: "1:851748835904:web:fcee220f43d3e667d645a5",
  measurementId: "G-JMX7VLXYF3",
  databaseURL:
    "https://document-control-nd-default-rtdb.europe-west1.firebasedatabase.app/",
};
import {
  getDatabase,
  get,
  ref,
  set,
  push,
  update,
  query,
  orderByKey,
  limitToFirst,
  startAt,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "/documents/data");
const pageSize = 10; // Hər səhifədə göstəriləcək element sayı
let lastKey = null; // Son açarı saxlamaq üçün

const getDocuments = async (isNextPage = false) => {
  let q = query(dataRef, orderByKey(), limitToFirst(pageSize));

  if (isNextPage && lastKey) {
    q = query(
      dataRef,
      orderByKey(),
      startAt(lastKey),
      limitToFirst(pageSize + 1)
    );
  }

  try {
    const snapshot = await get(q);
    if (snapshot.exists()) {
      const res = snapshot.val();
      const keys = Object.keys(res);

      // Növbəti səhifə üçün son açarı qeyd edin
      if (keys.length === pageSize + 1) {
        lastKey = keys[keys.length - 1]; // Son açarı saxlayın
        console.log("Növbəti səhifə üçün son açar:", lastKey);
      } else {
        lastKey = null; // Daha çox element qalmayıb
      }

      console.log("Məlumatlar:", res);
    } else {
      console.log("Heç bir məlumat yoxdur");
    }
  } catch (error) {
    console.error("Məlumat oxumaqda xəta:", error);
  }
};

// İlk səhifəni almaq
getDocuments();

// Növbəti səhifəni almaq üçün bu funksiyanı çağırın
// getDocuments(true);
