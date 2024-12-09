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
const dataRef = ref(database, "/documents");
let siraCount = 1;
const form = document.getElementById("document-form");
const documentTableBody = document.querySelector("#document-table tbody");
let data = [];
let showData = [];
let rolesArray = [];
let senedNovuList = [];
let businessProcesses = [];
let projectList = [];
let terefList = [];
const roleNames = [
  "Müəllim",
  "Təchizatçı",
  "Müdir",
  "İşçi",
  "Icraci",
  "Sifarisci ",
];
const cedveliGoster = () => {
  documentTableBody.innerHTML = "";
  terefList = [];
  // data.forEach((d, index) => {
  //   console.log(d);
  // });
  // let showData = data.slice()
  // const paginatedData = paginate(data);
  // console.log(paginatedData);

  for (let dataId in data) {
    const newRow = document.createElement("tr");
    // console.log(data[dataId]);

    // let layiheName = data[dataId].layihe;
    // if (!projectList.includes(layiheName)) {
    //   projectList.push(layiheName);
    // }

    let terefler = data[dataId].terefler;
    terefler?.map((teref) => {
      //   console.log(teref.role);

      if (!terefList.includes(teref.role)) {
        terefList.push(teref.role);
      }
    });

    let senedNovuArray = Object.values(senedNovuList);

    let senedNovuText = senedNovuArray.find(
      (s) => s.id == data[dataId].senedNovu
    );
    let businessProcessArray = Object.values(businessProcesses);
    let businessProcessText = businessProcessArray.find(
      (b) => b.id == data[dataId].businessProcess
    );

    let projectListArray = Object.values(projectList);
    let projectName = projectListArray.find((p) => p.id == data[dataId].layihe);

    newRow.innerHTML = `
            <td>${data[dataId].siraCount}</td>
            <td>${senedNovuText?.name}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${data[dataId].senedNomresi}'>${
      data[dataId].senedNomresi
    }</td>
            <td>${data[dataId].tarix ? data[dataId].tarix : ""}</td>
            <td
            style="max-width: 60px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${
              businessProcessText?.name ? businessProcessText?.name : ""
            }'
            >${businessProcessText?.name ? businessProcessText?.name : ""}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${data[dataId].movzu}'>${data[dataId].movzu}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${projectName?.name}'>${projectName?.name}</td>
            <td>
                ${
                  data[dataId].terefler
                    ? data[dataId].terefler?.map(
                        (t) => `<p>${t.roleName}: ${t.role}</p>`
                      )
                    : " "
                }
            </td>
            <td>${data[dataId].qovluq}</td>
            <td>${data[dataId].senedSiraNomresi}</td>
            <td class="tag">${
              data[dataId].tagsArray
                ? data[dataId].tagsArray
                    ?.map(
                      (tag) => `<span class="btn btn-primary">${tag}</span>`
                    )
                    .join("")
                : ""
            }</td>
            <td>${data[dataId].kimde}</td>
            <td>${
              data[dataId].elaqeliSened ? data[dataId].elaqeliSened : ""
            }</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${data[dataId].qeyd}'>${data[dataId].qeyd}</td>
            <td>
                <div class="d-flex">
			    	<button class="btn btn-primary shadow btn-xs sharp me-1 edit-btn"><i class="fa fa-pencil"></i></button>
            </div>
            </td>
            `;
    // <button class="btn btn-danger shadow btn-xs sharp delete-btn"><i class="fa fa-trash"></i></button>

    documentTableBody.appendChild(newRow);

    const editBtn = newRow.querySelector(".edit-btn");
    editBtn.addEventListener("click", function () {
      window.location.href =
        "/assets/pages/document/document-edit.html?id=" + dataId;
    });
  }
  senedNovuFilterOption();
  layiheFilterOption();
  terefFilterOption();
};
const getDocuments = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        // console.log(res);

        data = res.data;
        senedNovuList = res.parametrs.senedNovu;
        businessProcesses = res.parametrs.businessProcess;
        projectList = res.parametrs.projectList;
        // console.log(senedNovuList);
        console.log(projectList);

        const nestedObjects = Object.values(data);
        const lastObject = nestedObjects[nestedObjects.length - 1];
        siraCount = Number(lastObject.siraCount) + 1;
        window.localStorage.setItem("siraCount", siraCount);
        cedveliGoster(1);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");
const folderFilter = document.getElementById("folderFilter");
const partyFilter = document.getElementById("partyFilter");
const layiheFilter = document.getElementById("layiheFilter");
// Filtr funksiyası
function filterDocuments() {
  const typeValue = typeFilter.value; //
  const searchValue = searchInput.value.toLowerCase(); // Axtarış dəyəri
  const folderValue = folderFilter.value; // Qovluq seçimi
  const partyValue = partyFilter.value; // Tərəf seçimi
  const layiheValue = layiheFilter.value;

  const rows = documentTableBody.getElementsByTagName("tr");
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let matchesType = true;
    let matchesSearch = true;
    let matchesFolder = true;
    let matchesParty = true;
    let matchesLayihe = true;

    // Sənəd növü filtr
    // console.log(cells[1]);
    // console.log(typeValue);

    if (typeValue) {
      console.log(typeValue);

      matchesType = cells[1].textContent.includes(typeValue); // 1-ci sütun (Sənəd Növü)
    }

    // Axtarış filtr
    if (searchValue) {
      matchesSearch = Array.from(cells).some((cell) =>
        cell.textContent.toLowerCase().includes(searchValue)
      ); // Hər bir hüceyrəni yoxlayın
    }

    // // Qovluq filtr
    if (folderValue) {
      matchesFolder = cells[8].textContent.includes(folderValue); // 5-ci sütun (Qovluq)
    }

    // Tərəf filtr
    if (partyValue) {
      matchesParty = cells[7].textContent.includes(partyValue); // 4-cü sütun (Tərəflər)
    }

    // Layihe filtr
    if (layiheValue) {
      console.log(layiheValue);

      matchesLayihe = cells[6].textContent === layiheValue; // 3-cü sütun (Layihə)
    }

    // Bütün kriteriyalar uyğun gəlirsə, satırı göstərin
    if (
      matchesType &&
      matchesSearch &&
      matchesFolder &&
      matchesParty &&
      matchesLayihe
    ) {
      count++;
    }
    rows[i].style.display =
      matchesType &&
      matchesSearch &&
      matchesFolder &&
      matchesParty &&
      matchesLayihe
        ? ""
        : "none";
  }
  console.log(count);
}

// Filtr inputlarına hadisə dinləyiciləri əlavə edin
typeFilter.addEventListener("change", filterDocuments);
searchInput.addEventListener("input", filterDocuments);
folderFilter.addEventListener("change", filterDocuments);
partyFilter.addEventListener("change", filterDocuments);
layiheFilter.addEventListener("change", filterDocuments);

const layiheFilterOption = () => {
  layiheFilter.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  layiheFilter.append(optionDefault);
  console.log(projectList);
  for (const projectId in projectList) {
    let project = projectList[projectId];
    const option = document.createElement("option");
    option.value = project.name;
    option.textContent = project.name;
    layiheFilter.append(option);
  }
  $(layiheFilter).selectpicker("refresh");
};
const terefFilterOption = () => {
  // Existing logic to populate terefList
  partyFilter.innerHTML = ""; // Clear existing options
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  partyFilter.append(optionDefault);
  // console.log(terefList);

  terefList.forEach((role) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    partyFilter.append(option);
  });

  $(partyFilter).selectpicker("refresh"); // Refresh to show new options
};
const senedNovuFilterOption = () => {
  typeFilter.innerHTML = ""; // Clear existing options
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  typeFilter.append(optionDefault);

  for (const sId in senedNovuList) {
    let role = senedNovuList[sId];
    const option = document.createElement("option");
    option.value = role.name;
    option.textContent = role.name;
    typeFilter.append(option);
  }

  $(typeFilter).selectpicker("refresh");
};
// Call this function after you have fetched and populated terefList

getDocuments();
function paginate(object = {}, pageSize = 10, currentPage = 1) {
  // object: Data to paginate (should be an object)
  // pageSize: Number of items per page
  // currentPage: The current page to display (1-indexed)

  const keys = Object.keys(object); // Get all keys of the object
  const totalItems = keys.length; // Total number of items
  const startIndex = (currentPage - 1) * pageSize; // Calculate the start index
  const endIndex = startIndex + pageSize; // Calculate the end index

  const paginatedKeys = keys.slice(startIndex, endIndex); // Slice the keys for the current page
  const data = paginatedKeys.reduce((result, key) => {
    result[key] = object[key];
    return result;
  }, {}); // Create a new object for the current page

  return {
    currentPage: currentPage,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    data: data, // Return the sliced data as an object for the current page
  };
}
const selectPage = ()=>{

}