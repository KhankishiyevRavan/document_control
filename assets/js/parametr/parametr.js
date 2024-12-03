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
const businessProcessTable = document.querySelector(
  "#businessProcessTable tbody"
);
const projectListTable = document.querySelector("#projectListTable tbody");
// const senedNovuBtn = document.querySelector("#senedNovuBtn");

// const docTypeInput = document.querySelector("#document-type-input");

let senedNovuList = [];
let businessProcessesList = [];
let projectList = [];
let parametrsRef = {
  docType: "senedNovu",
  businessProcess: "businessProcess",
  projectList: "projectList",
};
const getDocumentsParametrs = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        console.log(res);
        senedNovuList = res?.senedNovu;
        businessProcessesList = res?.businessProcess;
        projectList = res?.projectList;
        showSenedNovuList();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
const createTr = (s, parametrRef, table) => {
  // console.log(parametrRef);

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
  // console.log(table);

  table?.append(tr);
};
const addParametrData = (parametrData, path) => {
  let objKey = push(ref(database, "/documents/parametrs/" + path)).key;
  set(
    ref(database, "/documents/parametrs/" + path + "/" + objKey),
    parametrData
  )
    .then(() => {
      alert("Data successfully written!");
      location.reload();
    })
    .catch((error) => {
      alert("Error writing data: ", error);
    });
};
// const addParametrData = (parametrData, path) => {
//   var objKey = push(dataRef).key;
//   set(ref(database, `/documents/parametrs/${path}/${objKey}`), parametrData)
//     .then(() => {
//       alert("Data successfully written!");
//       location.reload();
//     })
//     .catch((error) => {
//       alert("Error writing data: ", error);
//     });
// };
const showSenedNovuList = () => {
  for (const senedNovuId in senedNovuList) {
    createTr(senedNovuList[senedNovuId], parametrsRef.docType, senedNovuTable);
  }
  // senedNovuList.map((s) => {
  //   createTr(s, parametrsRef.docType, senedNovuTable);
  // });
  for (const businessProcessesId in businessProcessesList) {
    createTr(
      businessProcessesList[businessProcessesId],
      parametrsRef.businessProcess,
      businessProcessTable
    );
  }
  // businessProcessesList.map((bp) => {
  //   createTr(bp, parametrsRef.businessProcess, businessProcessTable);
  // });
  for (const projectListId in projectList) {
    createTr(
      projectList[projectListId],
      parametrsRef.docType,
      projectListTable
    );
  }
  // projectList.map((p) => {
  //   createTr(p, parametrsRef.projectList, projectListTable);
  // });
};
getDocumentsParametrs();
[...document.querySelectorAll("button")].map((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log();
    let input = e.target.closest("form")?.querySelector("input");
    console.log(input.name);

    if (!input.value) return;
    let id = "";
    let index = "";
    let data = {};
    let path = input.name;
    if (input.name === "senedNovu") {
      id = senedNovuList.length + 1;
      // index = senedNovuList.length;
    } else if (input.name === "businessProcess") {
      id = businessProcessesList.length + 1;
      // index = businessProcessesList.length;
    } else if (input.name === "projectList") {
      id = Object.keys(projectList).length + 1;
    }

    data = {
      name: input.value,
      id: id,
    };
    addParametrData(data, path);
  });
});
