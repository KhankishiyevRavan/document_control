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
const tablesContainer = document.getElementById("tables_container");
let tasks = [];
let editIndex = -1; // Redaktə edilən tapşırığın indeksi
let responsibles = []; // Məsul şəxslərin siyahısı
let departments = [];
let counters = {};
// Function to render the tasks and update department tables
function renderTasks() {
  for (let taskId in tasks) {
    let task = tasks[taskId];
    if (!departments.includes(task.department)) {
      departments.push(task.department);
      counters[task.department] = 1;
      let tableContainer = document.createElement("div");
      tableContainer.classList.add("col-xl-12", "card");
      tableContainer.setAttribute("id", "bootstrap-table9");
      tableContainer.innerHTML = `
        <div class="card-header flex-wrap d-flex justify-content-between px-3">
          <h4 class="card-title">${task.department}</h4>
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
                            id='dep${task.shortName}'
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
    }
    let tr = document.createElement("tr");
    tr.classList.add("tr_table");

    let tdCount = document.createElement("td");
    tdCount.textContent = counters[task.department];
    counters[task.department]++;

    let tdName = document.createElement("td");
    tdName.textContent = task?.name;

    let tdPriority = document.createElement("td");
    tdPriority.textContent = task?.priority;

    let tdDeadline = document.createElement("td");
    tdDeadline.textContent = task?.deadline;

    let tdStatus = document.createElement("td");
    tdStatus.textContent = task?.status;

    let tdresponsibles = document.createElement("td");
    tdresponsibles.textContent = " ";

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
        >
            <i class="fa-solid fa-xmark text-danger"></i>
        </a>
    </span>
    `;

    tr.append(tdCount, tdName, tdPriority, tdDeadline, tdStatus, tdresponsibles, tdNote, tdAction);
    document.querySelector(`#dep${task.shortName}`).append(tr);
  }

  // Hər bir şöbə üçün cədvəlləri sıfırlamaq

  //   document.getElementById("itTable").innerHTML =
  //     "<tr><th>Tapşırıq adı</th><th>Prioritet</th><th>Son tarix</th><th>Vəziyyət</th><th>Məsul Şəxslər</th><th>Əməliyyatlar</th></tr>";
  //   document.getElementById("hrTable").innerHTML =
  //     "<tr><th>Tapşırıq adı</th><th>Prioritet</th><th>Son tarix</th><th>Vəziyyət</th><th>Məsul Şəxslər</th><th>Əməliyyatlar</th></tr>";
  //   document.getElementById("marketingTable").innerHTML =
  //     "<tr><th>Tapşırıq adı</th><th>Prioritet</th><th>Son tarix</th><th>Vəziyyət</th><th>Məsul Şəxslər</th><th>Əməliyyatlar</th></tr>";
  //   document.getElementById("financeTable").innerHTML =
  //     "<tr><th>Tapşırıq adı</th><th>Prioritet</th><th>Son tarix</th><th>Vəziyyət</th><th>Məsul Şəxslər</th><th>Əməliyyatlar</th></tr>";
  //   for (let taskId in tasks) {
  //     const row = `
  //     <tr>
  //     <td>${tasks[taskId].name}</td>
  //     <td>${tasks[taskId].priority}</td>
  //     <td>${tasks[taskId].deadline}</td>
  //     <td>${tasks[taskId].status}</td>
  //     <td>${tasks[taskId]?.responsibles?.join(", ")}</td>
  //     <td>
  //     <button onclick="editTask('${taskId}')">Redaktə et</button>
  //     <button onclick="deleteTask('${taskId}')">Sil</button>
  //     </td>
  //     </tr>
  //     `;

  //     // Tapşırığı müvafiq şöbəyə əlavə edirik
  //     if (tasks[taskId].department === "IT") {
  //       document.getElementById("itTable").innerHTML += row;
  //     } else if (tasks[taskId].department === "HR") {
  //       document.getElementById("hrTable").innerHTML += row;
  //     } else if (tasks[taskId].department === "Marketing") {
  //       document.getElementById("marketingTable").innerHTML += row;
  //     } else if (tasks[taskId].department === "Finance") {
  //       document.getElementById("financeTable").innerHTML += row;
  //     }
  //   }
}

// // Add/Edit Task Function
// window.editTask = function (taskId) {
//   console.log(tasks);

//   const task = tasks[taskId]; // Firebase-dən tapşırığı alırıq
//   document.getElementById("taskName").value = task.name;
//   document.getElementById("priority").value = task.priority;
//   document.getElementById("deadline").value = task.deadline;
//   document.getElementById("department").value = task.department;
//   document.getElementById("status").value = task.status;
//   document.getElementById("note").value = task.note;
//   console.log(responsibles);

//   responsibles = [...task.responsibles];
//   renderResponsibles();
//   console.log(taskId);

//   editIndex = taskId; // Redaktə edilən tapşırığın ID-sini saxlayır
//   document.getElementById("addTask").textContent = "Tapşırığı Redaktə et"; // Button mətnini dəyişir
// };

// document.getElementById("addTask").addEventListener("click", () => {
//   const taskName = document.getElementById("taskName").value;
//   const priority = document.getElementById("priority").value;
//   const deadline = document.getElementById("deadline").value;
//   const department = document.getElementById("department").value;
//   const status = document.getElementById("status").value;
//   const note = document.getElementById("note").value;

//   if (taskName && deadline) {
//     const newTask = {
//       name: taskName,
//       priority: priority,
//       deadline: deadline,
//       department: department,
//       note: note,
//       responsibles: [...responsibles],
//       status: status,
//       completed: false,
//     };

//     if (editIndex === -1) {
//       // Yeni tapşırıq əlavə edir
//       pushDocuments(newTask);
//     } else {
//       // Mövcud tapşırığı redaktə edir və Firebase-də yeniləyir
//       const taskId = Object.keys(tasks)[editIndex];

//       update(ref(database, "/tasks/" + editIndex), newTask)
//         .then(() => {
//           alert("Tapşırıq uğurla yeniləndi!");
//         })
//         .catch((error) => {
//           console.error("Tapşırıq yenilənərkən səhv:", error);
//         });

//       editIndex = -1; // Redaktə rejimini sıfırlayır
//       document.getElementById("addTask").textContent = "Tapşırıq əlavə et";
//     }

//     renderTasks();
//     clearForm();
//   } else {
//     alert("Tapşırığın adı və son tarixi daxil edilməlidir!");
//   }
//   getDocuments();
// });

// // Delete Task Function
// window.deleteTask = function (index) {
//   const taskId = Object.keys(tasks)[index]; // Firebase-dən tapşırığın ID-sini götürür
//   remove(ref(database, "/tasks/" + taskId))
//     .then(() => {
//       alert("Tapşırıq uğurla silindi!");
//       tasks.splice(index, 1); // Massivdən tapşırığı çıxardır
//       renderTasks(); // Siyahını yenidən render edir
//     })
//     .catch((error) => {
//       console.error("Tapşırıq silinərkən səhv:", error);
//     });
// };

// // Add Responsible Person
// document.getElementById("addResponsible").addEventListener("click", () => {
//   const responsiblePerson = document.getElementById("responsiblePerson").value;
//   if (responsiblePerson) {
//     responsibles.push(responsiblePerson); // Məsul şəxs siyahıya əlavə olunur
//     renderResponsibles();
//     document.getElementById("responsiblePerson").value = ""; // Input sahəsi təmizlənir
//   }
// });

// // Render Responsible List
// function renderResponsibles() {
//   const responsibleList = document.getElementById("responsibleList");
//   responsibleList.innerHTML = "";
//   responsibles.forEach((person, index) => {
//     const li = document.createElement("li");
//     li.textContent = person;
//     responsibleList.appendChild(li);
//   });
// }

// // Function to clear the form
// function clearForm() {
//   document.getElementById("taskName").value = "";
//   document.getElementById("priority").value = "Aşağı";
//   document.getElementById("deadline").value = "";
//   document.getElementById("department").value = "IT";
//   document.getElementById("status").value = "Planlaşdırılır"; // Default status
//   document.getElementById("note").value = "";
//   responsibles = []; // Məsul şəxslər sıfırlanır
//   renderResponsibles();
//   editIndex = -1; // Redaktə rejimini sıfırlayır
//   document.getElementById("addTask").textContent = "Tapşırıq əlavə et"; // Button mətnini yeniləyir
// }

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
/////////////////////////////////////////////////

// let taskCol = document.createElement("div");
// taskCol.classList.add("col-xl-12","card");
// taskCol.setAttribute("id","bootstrap-table9");

// <div class="col-xl-12 card" id="bootstrap-table9">
//   <div class="card-header flex-wrap d-flex justify-content-between px-3">
//     <h4 class="card-title">Tapşırıqlar</h4>
//   </div>
//   <div class="tab-content" id="myTabContent-7">
//     <div
//       class="tab-pane fade show active"
//       id="solidbackground"
//       role="tabpanel"
//       aria-labelledby="home-tab-7"
//     >
//       <div class="card-body p-0">
//         <div class="table-responsive">
//
//         </div>
//       </div>
//     </div>
//   </div>
// </div>;
///////////////////////

// <tbody>
//                       <tr>
//                         <td>Air Conditioner</td>
//                         <td>
//                           <div
//                             class="progress"
//                             style="background: rgba(127, 99, 244, 0.1)"
//                           >
//                             <div
//                               class="progress-bar bg-primary"
//                               style="width: 70%"
//                               role="progressbar"
//                             >
//                               <span class="sr-only">70% Complete</span>
//                             </div>
//                           </div>
//                         </td>
//                         <td>Apr 20,2018</td>
//                         <td>
//                           <span class="badge badge-primary">70%</span>
//                         </td>
//                         <td>
//                           <span
//                             ><a
//                               href="javascript:void(0);"
//                               class="me-4"
//                               data-bs-toggle="tooltip"
//                               data-placement="top"
//                               title="Edit"
//                               ><i
//                                 class="fa fa-pencil color-muted"
//                               ></i> </a
//                             ><a
//                               href="javascript:void(0);"
//                               data-bs-toggle="tooltip"
//                               data-placement="top"
//                               title="btn-close"
//                               ><i
//                                 class="fa-solid fa-xmark text-danger"
//                               ></i></a
//                           ></span>
//                         </td>
//                       </tr>
//                     </tbody>
