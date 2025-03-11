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
  onValue,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const documentsRefElta = ref(database, "/elta/documents/data");
const documentsRefCCG = ref(database, "/ccg/documents/data");
const dataRef = ref(database, "/elta/documents");
let alldoc = 0;
const getDocuments = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        console.log(res);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
getDocuments();
const docCount = document.querySelector("#doc_count");
console.log(alldoc);

onValue(documentsRefElta, (snapshot) => {
  const data = snapshot.val();
  const length = Object.keys(data).length; // Datanın uzunluğu
  console.log("Verilənlərin uzunluğu: ", length);
  alldoc = alldoc + length;
  //   siraCount = length + 1;
  //   siraInput.value = siraCount;
  docCount.innerHTML = alldoc;
});
onValue(documentsRefCCG, (snapshot) => {
  const data = snapshot.val();
  const length = Object.keys(data).length; // Datanın uzunluğu
  console.log("Verilənlərin uzunluğu: ", length);
  alldoc = alldoc + length;
  //   siraCount = length + 1;
  //   siraInput.value = siraCount;
  docCount.innerHTML = alldoc;

});
