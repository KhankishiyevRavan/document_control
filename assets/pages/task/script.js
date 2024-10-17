// Task List Array
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
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "/tasks");
let tasks = [];
let editIndex = -1; // Redaktə edilən tapşırığın indeksi
let responsibles = []; // Məsul şəxslərin siyahısı

// Function to render the tasks and update department tables
function renderTasks() {
  // Hər bir şöbə üçün cədvəlləri sıfırlamaq
  document.getElementById("itTable").innerHTML =
  "<tr><th>Tapşırıq adı</th><th>Prioritet</th><th>Son tarix</th><th>Vəziyyət</th><th>Məsul Şəxslər</th><th>Əməliyyatlar</th></tr>";
  document.getElementById("hrTable").innerHTML =
  "<tr><th>Tapşırıq adı</th><th>Prioritet</th><th>Son tarix</th><th>Vəziyyət</th><th>Məsul Şəxslər</th><th>Əməliyyatlar</th></tr>";
  document.getElementById("marketingTable").innerHTML =
  "<tr><th>Tapşırıq adı</th><th>Prioritet</th><th>Son tarix</th><th>Vəziyyət</th><th>Məsul Şəxslər</th><th>Əməliyyatlar</th></tr>";
  document.getElementById("financeTable").innerHTML =
  "<tr><th>Tapşırıq adı</th><th>Prioritet</th><th>Son tarix</th><th>Vəziyyət</th><th>Məsul Şəxslər</th><th>Əməliyyatlar</th></tr>";
  for(let taskId in tasks){
    // task  ====>  tasks[taskId]
    // index  ====>  taskId
  
    const row = `
    <tr>
    <td>${tasks[taskId].name}</td>
    <td>${tasks[taskId].priority}</td>
    <td>${tasks[taskId].deadline}</td>
    <td>${tasks[taskId].status}</td>
    <td>${tasks[taskId]?.responsibles?.join(", ")}</td>
    <td>
    <button onclick="editTask(${taskId})">Redaktə et</button>
    <button onclick="deleteTask(${taskId})">Sil</button>
    </td>
    </tr>
    `;
    
    // Tapşırığı müvafiq şöbəyə əlavə edirik
    if (tasks[taskId].department === "IT") {
      document.getElementById("itTable").innerHTML += row;
    } else if (tasks[taskId].department === "HR") {
      document.getElementById("hrTable").innerHTML += row;
    } else if (tasks[taskId].department === "Marketing") {
      document.getElementById("marketingTable").innerHTML += row;
    } else if (tasks[taskId].department === "Finance") {
      document.getElementById("financeTable").innerHTML += row;
    }
  };
}

// Add/Edit Task Function
document.getElementById("addTask").addEventListener("click", () => {
  const taskName = document.getElementById("taskName").value;
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;
  const department = document.getElementById("department").value;
  const status = document.getElementById("status").value; // Mövcud vəziyyət seçimi
  const note = document.getElementById("note").value;
  
  if (taskName && deadline) {
    const newTask = {
      name: taskName,
      priority: priority,
      deadline: deadline,
      department: department,
      note: note,
      responsibles: [...responsibles], // Məsul şəxslər tapşırığa əlavə olunur
      status: status, // Mövcud vəziyyət tapşırığa əlavə olunur
      completed: false,
    };
    
    if (editIndex === -1) {
      // Yeni tapşırıq əlavə edir
      console.log(tasks);
      // tasks.push(newTask);
      pushDocuments(newTask);
      tasks = {...tasks,newTask};
    } else {
      // Mövcud tapşırığı redaktə edir
      tasks[editIndex] = newTask;
      editIndex = -1; // Redaktə rejimini sıfırlayır
      document.getElementById("addTask").textContent = "Tapşırıq əlavə et"; // Button mətnini yeniləyir
    }
    
    renderTasks();
    clearForm();
  } else {
    alert("Tapşırığın adı və son tarixi daxil edilməlidir!");
  }
});

// Edit Task Function
function editTask(index) {
  const task = tasks[index];
  document.getElementById("taskName").value = task.name;
  document.getElementById("priority").value = task.priority;
  document.getElementById("deadline").value = task.deadline;
  document.getElementById("department").value = task.department;
  document.getElementById("status").value = task.status;
  document.getElementById("note").value = task.note;
  
  responsibles = [...task.responsibles];
  renderResponsibles();
  
  editIndex = index; // Redaktə edilən tapşırığın indeksini saxlayır
  document.getElementById("addTask").textContent = "Tapşırığı Redaktə et"; // Button mətnini dəyişir
}

// Delete Task Function
function deleteTask(index) {
  tasks.splice(index, 1); // Tapşırığı siyahıdan silir
  renderTasks(); // Cədvəlləri yenidən render edir
}

// Add Responsible Person
document.getElementById("addResponsible").addEventListener("click", () => {
  const responsiblePerson = document.getElementById("responsiblePerson").value;
  if (responsiblePerson) {
    responsibles.push(responsiblePerson); // Məsul şəxs siyahıya əlavə olunur
    renderResponsibles();
    document.getElementById("responsiblePerson").value = ""; // Input sahəsi təmizlənir
  }
});

// Render Responsible List
function renderResponsibles() {
  const responsibleList = document.getElementById("responsibleList");
  responsibleList.innerHTML = "";
  responsibles.forEach((person, index) => {
    const li = document.createElement("li");
    li.textContent = person;
    responsibleList.appendChild(li);
  });
}

// Function to clear the form
function clearForm() {
  document.getElementById("taskName").value = "";
  document.getElementById("priority").value = "Aşağı";
  document.getElementById("deadline").value = "";
  document.getElementById("department").value = "IT";
  document.getElementById("status").value = "Planlaşdırılır"; // Default status
  document.getElementById("note").value = "";
  responsibles = []; // Məsul şəxslər sıfırlanır
  renderResponsibles();
  editIndex = -1; // Redaktə rejimini sıfırlayır
  document.getElementById("addTask").textContent = "Tapşırıq əlavə et"; // Button mətnini yeniləyir
}

renderTasks();



const pushDocuments = async (newDocument) => {
  var objKey = push(dataRef).key;
  console.log(newDocument);

  set(ref(database, "/tasks/" + objKey), {
    ...newDocument,
  })
    .then(() => {
      alert("Data successfully written!");
      // window.location.pathname = "/assets/pages/document/document-page.html";
    })
    .catch((error) => {
      alert("Error writing data: ", error);
    });
};

const getDocuments = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        console.log(res);
       
        tasks = res;
        renderTasks();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
getDocuments();