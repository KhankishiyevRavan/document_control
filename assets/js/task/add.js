// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  onValue,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const taskParamsRef = ref(database, "/tasks/parametrs");
const newDataRef = ref(database, "/tasks/data");
const form = document.getElementById("document-form");
// const documentsRef = database().ref('/documents/data/');
// const documentsRef = ref(database, "/task/data");

let data = [];
let departmentList = [];
let priorityList = [];
let statusList = [];
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
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
getTasksParametrs();
const pushTasks = async (newTask) => {
  var objKey = push(newDataRef).key;
  console.log(newTask);

  set(ref(database, "/tasks/data/" + objKey), {
    ...newTask,
  })
    .then(() => {
      alert("Data successfully written!");
      // window.location.pathname = "/assets/pages/document/document-page.html";
    })
    .catch((error) => {
      alert("Error writing data: ", error);
    });
};
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const priority = document.getElementById("priority").value;
  const status = document.getElementById("status").value;
  const note = document.getElementById("note").value;
  const department = document.getElementById("department").value;
  const deadline = document.getElementById("deadline").value;

  let newTask = {
    name: name,
    priority: priority,
    status: status,
    note: note,
    department: department,
    deadline: deadline,
    responsibles: tagsArray,
  };
  pushTasks(newTask);
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
const departmentSelect = document.getElementById("department");
const departmentOption = () => {
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

  $(departmentSelect).selectpicker("refresh");
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
    option.value = role.id;
    option.textContent = role.name;
    statusSelect.append(option);
  });

  $(statusSelect).selectpicker("refresh");
};
