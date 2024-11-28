const queryString = window.location.search;

// URLSearchParams ile parametreleri ayıkla
const urlParams = new URLSearchParams(queryString);

// 'id' parametresini al
const taskId = urlParams.get("id");

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
  remove,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, `/tasks/data/${taskId}`);
const taskParamsRef = ref(database, "/tasks/parametrs");
const form = document.getElementById("document-form");
let departmentList = [];
let priorityList = [];
let statusList = [];
let data = {};
const getDocuments = async () => {
  console.log(taskId);
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        console.log(res);
        data = res;
        editDataShow();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};

const getTasksParametrs = async () => {
  get(taskParamsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        // data = res.data;
        console.log(res);
        departmentList = res.departments;
        priorityList = res.priority;
        statusList = res.status;
        departmentOption();
        priorityOption();
        statusOption();
        getDocuments();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
getTasksParametrs();
const pushTasks = async (editTask, taskId) => {
  //   var objKey = push(newDataRef).key;
  console.log(editTask);
  update(ref(database, "/tasks/data/" + taskId), editTask)
    .then(() => {
      alert(" successfully updated!");
    })
    .catch((error) => {
      console.error("Error updating data: ", error);
      alert("Error updating data: ", error);
      return;
    });
  // set(ref(database, "/tasks/data/" + objKey), {
  //   ...editTask,
  // })
  //   .then(() => {
  //     alert("Data successfully written!");
  //     // window.location.pathname = "/assets/pages/document/document-page.html";
  //   })
  //   .catch((error) => {
  //     alert("Error writing data: ", error);
  //   });
};
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const priority = document.getElementById("priority").value;
  const status = document.getElementById("status").value;
  const note = document.getElementById("note").value;
  const department = document.getElementById("department").value;
  const deadline = document.getElementById("deadline").value;

  let editTask = {
    name: name,
    priority: priority,
    status: status,
    note: note,
    department: department,
    deadline: deadline,
    responsibles: tagsArray,
  };
  pushTasks(editTask, taskId);
  form.reset();
});
let tagsArray = [];
const tagInput = document.getElementById("tag-input");
const tagContainer = document.getElementById("tag-container");
tagInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag();
  }
});
function addTag() {
  const newTag = tagInput.value.trim();
  if (newTag !== "" && !tagsArray?.includes(newTag)) {
    tagsArray?.push(newTag);
    displayTags();
    tagInput.value = "";
  }
}
function displayTags() {
  tagContainer.innerHTML = "";
  console.log(tagsArray);
  
  tagsArray?.forEach((tag, index) => {
    const tagElement = document.createElement("span");
    tagElement.classList.add("tag", "btn", "btn-danger", "mt-2");
    tagElement.textContent = tag;

    const removeBtn = document.createElement("span");
    removeBtn.classList.add("btn-icon-end");
    const removeBtnIcon = document.createElement("i");
    removeBtnIcon.classList.add("fas", "fa-times");
    removeBtn.append(removeBtnIcon);
    removeBtn.onclick = function () {
      tagsArray?.splice(index, 1);
      displayTags();
    };

    tagElement.appendChild(removeBtn);
    tagContainer.appendChild(tagElement);
  });
}
const editDataShow = () => {
  document.getElementById("name").value = data.name;
  document.getElementById("priority").value = data.priority;
  document.getElementById("status").value = data.status;
  document.getElementById("note").value = data.note;
  document.getElementById("department").value = data.department;
  document.getElementById("deadline").value = data.deadline;
  tagsArray = data.responsibles;
  console.log(data.responsibles);

  displayTags();
  $(departmentSelect).selectpicker("refresh");
  $(prioritySelect).selectpicker("refresh");
  $(statusSelect).selectpicker("refresh");
};
const departmentSelect = document.getElementById("department");
const departmentOption = () => {
  console.log(document.getElementById("department").value);

  departmentSelect.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  departmentSelect.append(optionDefault);

  departmentList.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    departmentSelect.append(option);
  });

  // $(departmentSelect).selectpicker("refresh");
  console.log(document.getElementById("department").value);
};
const prioritySelect = document.getElementById("priority");
const priorityOption = () => {
  prioritySelect.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  prioritySelect.append(optionDefault);

  priorityList.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    prioritySelect.append(option);
  });

  $(prioritySelect).selectpicker("refresh");
};
const statusSelect = document.getElementById("status");
const statusOption = () => {
  statusSelect.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  statusSelect.append(optionDefault);

  statusList.forEach((role) => {
    const option = document.createElement("option");
    option.value = Number(role.degree);
    option.textContent = role.name;
    statusSelect.append(option);
  });

  $(statusSelect).selectpicker("refresh");
};