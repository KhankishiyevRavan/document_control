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
  remove,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "/tasks");
const tablesContainer = document.getElementById("tables_container");
let tasks = [];
let taskStatus = [];
let taskDepartments = [];
let editIndex = -1; // Redaktə edilən tapşırığın indeksi
let responsibles = []; // Məsul şəxslərin siyahısı
let departments = [];
let counters = {};
// Function to render the tasks and update department tables
function renderTasks() {
  // console.log(counters);
  createDepartmentsTr();
  console.log(counters);
  for (let taskId in tasks) {
    let task = tasks[taskId];

    let tr = document.createElement("tr");
    tr.classList.add("tr_table");

    let tdCount = document.createElement("td");
    // console.log(counters);
    let departmentText = taskDepartments.find((s) => s.id == task.department);
    tdCount.textContent = counters[departmentText.name];
    // console.log(task.department);
    counters[departmentText.name]++;
    // console.log(counters);

    let tdName = document.createElement("td");
    tdName.textContent = task?.name;

    let tdPriority = document.createElement("td");
    tdPriority.textContent = task?.priority;

    let tdDeadline = document.createElement("td");
    tdDeadline.textContent = task?.deadline;

    let tdStatus = document.createElement("td");
    let taskText = taskStatus.find((s) => s.degree == task.status);

    let spanStatus = document.createElement("span");
    spanStatus.classList.add("badge", "light");
    spanStatus.style.color = "white";
    spanStatus.style.backgroundColor = taskText.color;
    spanStatus.textContent = taskText.name;

    tdStatus.append(spanStatus);

    let tdresponsibles = document.createElement("td");
    task?.responsibles?.map((re) => {
      let spanResponsible = document.createElement("span");
      spanResponsible.textContent = re;
      spanResponsible.classList.add("responsible_span");
      tdresponsibles.append(spanResponsible);
    });
    let tdNote = document.createElement("td");
    tdNote.textContent = task?.note;

    let tdAction = document.createElement("td");
    tdAction.innerHTML = `
    <span>
        <a
            href="javascript:void(0);"
            class="me-4"
            title="Edit"
        >
            <i class="fa fa-pencil color-muted"></i>
        </a>
        <a
            href="javascript:void(0);"
            title="btn-close"
            class="btn-closee"
        >
            <i class="fa-solid fa-xmark text-danger"></i>
        </a>
    </span>
    `;

    tr.append(
      tdCount,
      tdName,
      tdPriority,
      tdDeadline,
      tdStatus,
      tdresponsibles,
      tdNote,
      tdAction
    );

    const delBtn = tr.querySelector(".btn-closee");
    delBtn.addEventListener("click", () => {
      const itemKey = taskId;
      const itemRef = ref(database, `/tasks/data/${itemKey}`);
      remove(itemRef)
        .then(() => {
          alert("Item removed successfully.");
          window.location.reload();
        })
        .catch((error) => {
          alert("Error removing item: ", error);
          console.error("Error removing item: ", error);
        });
    });
    document.querySelector(`#dep${task.department} tbody`).append(tr);
  }
}

const getDocuments = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        taskStatus = res.parametrs.status;
        taskDepartments = res.parametrs.departments;
        tasks = res?.data;
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
const createDepartmentsTr = () => {
  // console.log(counters);
  // console.log(taskDepartments);
  
  taskDepartments.map((taskDepartment) => {
    console.log(taskDepartment.name);
    counters[taskDepartment.name] = 1;
    console.log(counters);
    
    let tableContainer = document.createElement("div");
    tableContainer.classList.add("col-xl-12", "card");
    tableContainer.setAttribute("id", "bootstrap-table9");
    tableContainer.innerHTML = `
    <div class="card-header flex-wrap d-flex justify-content-between px-3">
      <h4 class="card-title">${taskDepartment?.name}</h4>
        <button class="ms-2 btn light btn-primary addTrBtn">
          <a class="add-task" href="./add-task.html"> + </a> 
        </button>

    </div>
    <div class="tab-content" id="myTabContent-7">
        <div
            class="tab-pane fade show active"
            id="solidbackground"
            role="tabpanel"
            aria-labelledby="home-tab-7"
        >
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table
                        class="table table-bordered table-striped verticle-middle table-responsive-sm"
                        id='dep${taskDepartment.id}'
                    >
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Task</th>
                            <th scope="col">Prioritet</th>
                            <th scope="col">Deadline</th>
                            <th scope="col">Status</th>
                            <th scope="col">Məsul şəxslər</th>
                            <th scope="col">Note</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;

    tablesContainer.append(tableContainer);
  });
};
// renderTasks();
