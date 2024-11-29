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
  remove,
  push,
  update,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "/documents/parametrs");

const senedNovuTable = document.querySelector("#senedNovuTable tbody");
const senedNovuBtn = document.querySelector("#senedNovuBtn");

const docTypeInput = document.querySelector("#document-type-input");

let senedNovuList = [];
let parametrsRef = {
  docType: "senedNovu",
};
const getDocumentsParametrs = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        senedNovuList = res?.senedNovu;
        console.log(res);
        showSenedNovuList();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
const createTr = (s, parametrRef) => {
  console.log(parametrRef);
  
  let tr = document.createElement("tr");
  // ID
  let tdId = document.createElement("td");
  tdId.style.textAlign = "center";
  tdId.textContent = s.id;
  // Adı
  let tdName = document.createElement("td");
  tdName.textContent = s.name;
  // Action
  let tdAction = document.createElement("td");
  let span = document.createElement("span");
  // //Edit
  let aEdit = document.createElement("a");
  aEdit.classList.add("me-4");
  let iEdit = document.createElement("i");
  iEdit.classList.add("fa", "fa-pencil", "color-muted");
  aEdit.append(iEdit);
  // //Remove
  let aRemove = document.createElement("a");
  aRemove.classList.add("me-4");
  let iRemove = document.createElement("i");
  iRemove.classList.add("fa", "fa-solid", "fa-xmark", "text-danger");
  aRemove.append(iRemove);
  aRemove.addEventListener("click", () => {
    let itemKey = s.id - 1;
    remove(ref(database, `/documents/parametrs/${parametrRef}/` + itemKey))
      .then(() => {
        console.log("Data successfully deleted!");
        alert("Data successfully deleted!");
        location.reload();
      })
      .catch((error) => {
        console.error("Error deleting data: ", error);
        alert("Error deleting data: " + error);
        location.reload();
      });
  });
  span.append(aEdit, aRemove);
  tdAction.append(span);

  tr.append(tdId, tdName, tdAction);
  senedNovuTable.append(tr);
};
const addParametrData = (id, parametrData) => {
  set(ref(database, "/documents/parametrs/senedNovu/" + id), parametrData)
    .then(() => {
      alert("Data successfully written!");
      location.reload();
    })
    .catch((error) => {
      alert("Error writing data: ", error);
    });
};
const showSenedNovuList = () => {
  senedNovuList.map((s) => {
    createTr(s, parametrsRef.docType);
  });
};
getDocumentsParametrs();

senedNovuBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!docTypeInput.value) return;
  let id = senedNovuList.length + 1;
  let index = senedNovuList.length;
  let addDocType = {
    name: docTypeInput.value,
    id: id,
  };
  addParametrData(index,addDocType);
  console.log("test");
});
