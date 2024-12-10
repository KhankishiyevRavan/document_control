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
const paginationUl = document.querySelector(".pagination.pagination-gutter");
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
const cedveliGoster = (d = showData, p = 10, c = 1) => {
  documentTableBody.innerHTML = "";
  // data.forEach((d, index) => {
  //   console.log(d);
  // });
  // let showData = data.slice()
  console.log(showData);

  const paginatedData = paginate(d, p, c);
  console.log(paginatedData);

  for (let dataId in paginatedData.data) {
    const newRow = document.createElement("tr");
    let dataValue = paginatedData.data[dataId];
    // console.log(data[dataId]);
    // console.log(data[dataId]);

    // let layiheName = data[dataId].layihe;
    // if (!projectList.includes(layiheName)) {
    //   projectList.push(layiheName);
    // }

    // // console.log(terefler);
    // let terefler = data[dataId].terefler;

    // terefler?.map((teref) => {
    //   //   console.log(teref.role);

    //   if (!terefList.includes(teref.role)) {
    //     terefList.push(teref.role);
    //   }
    // });
    // console.log(senedNovuList);

    let senedNovuArray = Object.values(senedNovuList);

    let senedNovuText = senedNovuArray.find((s) => s.id == dataValue.senedNovu);
    let businessProcessArray = Object.values(businessProcesses);
    let businessProcessText = businessProcessArray.find(
      (b) => b.id == dataValue.businessProcess
    );

    let projectListArray = Object.values(projectList);
    let projectName = projectListArray.find((p) => p.id == dataValue.layihe);

    newRow.innerHTML = `
            <td>${dataValue.siraCount}</td>
            <td>${senedNovuText?.name}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${dataValue.senedNomresi}'>${dataValue.senedNomresi}</td>
            <td>${dataValue.tarix ? dataValue.tarix : ""}</td>
            <td
            style="max-width: 60px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${
              businessProcessText?.name ? businessProcessText?.name : ""
            }'
            >${businessProcessText?.name ? businessProcessText?.name : ""}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${dataValue.movzu}'>${dataValue.movzu}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${projectName?.name}'>${projectName?.name}</td>
            <td>
                ${
                  dataValue.terefler
                    ? dataValue.terefler?.map(
                        (t) => `<p>${t.roleName}: ${t.role}</p>`
                      )
                    : " "
                }
            </td>
            <td>${dataValue.qovluq}</td>
            <td>${dataValue.senedSiraNomresi}</td>
            <td class="tag">${
              dataValue.tagsArray
                ? dataValue.tagsArray
                    ?.map(
                      (tag) => `<span class="btn btn-primary">${tag}</span>`
                    )
                    .join("")
                : ""
            }</td>
            <td>${dataValue.kimde}</td>
            <td>${dataValue.elaqeliSened ? dataValue.elaqeliSened : ""}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
            title = '${dataValue.qeyd}'>${dataValue.qeyd}</td>
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
};
const getDocuments = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        // console.log(res);

        data = res.data;
        for (const key in data) {
          let terefler = data[key]?.terefler;
          console.log(terefler);
          terefler &&
            terefler?.map((t) => {
              if (!terefList?.includes(t.role)) {
                terefList.push(t.role);
              }
            });
          //   if (!terefList.includes(te)) {
          //     projectList.push(layiheName);
          //   }
        }
        console.log(projectList);

        senedNovuList = res.parametrs.senedNovu;
        businessProcesses = res.parametrs.businessProcess;
        projectList = res.parametrs.projectList;
        // console.log(senedNovuList);

        const nestedObjects = Object.values(data);
        const lastObject = nestedObjects[nestedObjects.length - 1];
        siraCount = Number(lastObject.siraCount) + 1;
        window.localStorage.setItem("siraCount", siraCount);
        filterDocuments();
        senedNovuFilterOption();
        layiheFilterOption();
        terefFilterOption();
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
const filterDocuments = () => {
  showData = [];
  const typeValue = typeFilter.value; //
  const searchValue = searchInput.value.toLowerCase(); // Axtarış dəyəri
  const folderValue = folderFilter.value; // Qovluq seçimi
  const partyValue = partyFilter.value; // Tərəf seçimi
  const layiheValue = layiheFilter.value;
  console.log(data);

  let count = 0;
  for (const dataId in data) {
    let dataValue = data[dataId];
    let matchesType = true;
    let matchesSearch = true;
    let matchesFolder = true;
    let matchesParty = true;
    let matchesLayihe = true;
    // console.log(typeValue);

    if (typeValue) {
      let senedNovuArray = Object.values(senedNovuList);

      let senedNovuObj = senedNovuArray.find(
        (s) => s.id == dataValue.senedNovu
      );
      //   console.log(s);

      matchesType = senedNovuObj.id == typeValue;
      // matchesType = cells[1].textContent.includes(typeValue); // 1-ci sütun (Sənəd Növü)
    }
    // Axtarış filtr
    if (searchValue) {
      //   console.log(searchValue);
      //   searchInObject(dataValue, searchValue);
      matchesSearch = searchInObject(dataValue, searchValue);
      console.log(matchesSearch);   
    }
    // // Qovluq filtr
    if (folderValue) {
      matchesFolder = dataValue.qovluq == folderValue;
      //   matchesFolder = cells[8].textContent.includes(folderValue); // 5-ci sütun (Qovluq)
    }

    // Layihe filtr
    if (layiheValue) {
      console.log(layiheValue);
      matchesLayihe = dataValue.layihe == layiheValue;
      //   matchesLayihe = cells[6].textContent === layiheValue; // 3-cü sütun (Layihə)
    }
    // Tərəf filtr
    if (partyValue) {
      matchesParty = dataValue.terefler?.some((t) => t.role == partyValue);
      //   matchesParty = cells[7].textContent.includes(partyValue); // 4-cü sütun (Tərəflər)
    }

    if (
      matchesType &&
      matchesSearch &&
      matchesFolder &&
      matchesParty &&
      matchesLayihe
    ) {
      count++;
      showData.push(dataValue);
    }
  }
  console.log(count);
  cedveliGoster();
};
// function filterDocuments() {
//   const typeValue = typeFilter.value; //
//   const searchValue = searchInput.value.toLowerCase(); // Axtarış dəyəri
//   const folderValue = folderFilter.value; // Qovluq seçimi
//   const partyValue = partyFilter.value; // Tərəf seçimi
//   const layiheValue = layiheFilter.value;

//   const rows = documentTableBody.getElementsByTagName("tr");
//   let count = 0;
//   for (let i = 0; i < rows.length; i++) {
//     const cells = rows[i].getElementsByTagName("td");
//     let matchesType = true;
//     let matchesSearch = true;
//     let matchesFolder = true;
//     let matchesParty = true;
//     let matchesLayihe = true;

//     // Sənəd növü filtr
//     // console.log(cells[1]);
//     // console.log(typeValue);

//     if (typeValue) {
//       console.log(typeValue);

//       matchesType = cells[1].textContent.includes(typeValue); // 1-ci sütun (Sənəd Növü)
//     }

//     // Axtarış filtr
//     if (searchValue) {
//       matchesSearch = Array.from(cells).some((cell) =>
//         cell.textContent.toLowerCase().includes(searchValue)
//       ); // Hər bir hüceyrəni yoxlayın
//     }

//     // // Qovluq filtr
//     if (folderValue) {
//       matchesFolder = cells[8].textContent.includes(folderValue); // 5-ci sütun (Qovluq)
//     }

//     // Tərəf filtr
//     if (partyValue) {
//       matchesParty = cells[7].textContent.includes(partyValue); // 4-cü sütun (Tərəflər)
//     }

//     // Layihe filtr
//     if (layiheValue) {
//       console.log(layiheValue);

//       matchesLayihe = cells[6].textContent === layiheValue; // 3-cü sütun (Layihə)
//     }

//     // Bütün kriteriyalar uyğun gəlirsə, satırı göstərin
//     if (
//       matchesType &&
//       matchesSearch &&
//       matchesFolder &&
//       matchesParty &&
//       matchesLayihe
//     ) {
//       count++;
//     }
//     rows[i].style.display =
//       matchesType &&
//       matchesSearch &&
//       matchesFolder &&
//       matchesParty &&
//       matchesLayihe
//         ? ""
//         : "none";
//   }
//   console.log(count);
// }

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
  // console.log(projectList);
  for (const projectId in projectList) {
    let project = projectList[projectId];
    const option = document.createElement("option");
    option.value = project.id;
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
  typeFilter.innerHTML = " "; // Clear existing options
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  typeFilter.append(optionDefault);

  for (const sId in senedNovuList) {
    let role = senedNovuList[sId];
    const option = document.createElement("option");
    option.value = role.id;
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
  //   let totalPages = Math.ceil(totalItems / pageSize);
  //   let startPageIndex = currentPage - 3 >= 1 ? currentPage - 3 : 1;
  //   let endPageIndex =
  //     Number(currentPage) + 3 <= totalPages
  //       ? Number(currentPage) + 3
  //       : totalPages;
  let totalPages = Math.ceil(totalItems / pageSize);

  // Ensure at least 10 pages are visible
  let visiblePages = 10;

  let startPageIndex = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  let endPageIndex = startPageIndex + visiblePages - 1;

  // If the end page exceeds the total pages, adjust the start page to ensure 10 pages
  if (endPageIndex > totalPages) {
    endPageIndex = totalPages;
    startPageIndex = Math.max(endPageIndex - visiblePages + 1, 1);
  }
  console.log(startPageIndex, endPageIndex);
  paginationUl.innerHTML = "";
  for (let i = startPageIndex; i <= endPageIndex; i++) {
    let li = document.createElement("li");
    li.classList.add("page-item");
    let a = document.createElement("a");
    a.classList.add("page-link");
    a.textContent = i;
    li.append(a);
    if (i == currentPage) {
      li.classList.add("active");
    }
    li.addEventListener("click", () => {
      cedveliGoster(showData, 10, a.textContent);
    });
    paginationUl.append(li);
  }
  return {
    currentPage: currentPage,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    data: data, // Return the sliced data as an object for the current page
  };
}
const selectPage = () => {
  //    let startPage =
  //     <ul class="pagination pagination-gutter">
  //          <li class="page-item page-indicator">
  //              <a class="page-link" href="javascript:void(0)">
  //                  <i class="la la-angle-left"></i>
  //              </a>
  //          </li>
  //          <li class="page-item active">
  //              <a class="page-link" href="javascript:void(0)">1</a>
  //          </li>
  //          <li class="page-item"><a class="page-link" href="javascript:void(0)">2</a></li>
  //          <li class="page-item"><a class="page-link" href="javascript:void(0)">3</a></li>
  //          <li class="page-item"><a class="page-link" href="javascript:void(0)">4</a></li>
  //          <li class="page-item page-indicator">
  //              <a class="page-link" href="javascript:void(0)">
  //                  <i class="la la-angle-right"></i>
  //              </a>
  //          </li>
  //   </ul>
};
filterDocuments();
function searchInObject(object, searchTerm) {
  const lowerCaseSearchTerm = searchTerm.toLowerCase(); // Normalize search term
  const excludedKeys = ["senedNovu", "layihe", "businessProcess"]; // Excluded keys

  return Object.entries(object).some(([key, field]) => {
    if (excludedKeys.includes(key)) {
      // Check for excluded keys
      if (key === "senedNovu") {
        for (const id in senedNovuList) {
          if (
            senedNovuList[id].name
              .toLowerCase()
              .includes(lowerCaseSearchTerm) &&
            object.senedNovu == senedNovuList[id].id
          ) {
            return true;
          }
        }
      } else if (key === "businessProcess") {
        for (const id in businessProcesses) {
          if (
            businessProcesses[id].name
              .toLowerCase()
              .includes(lowerCaseSearchTerm) &&
            object.businessProcess == businessProcesses[id].id
          ) {
            return true;
          }
        }
      } else if (key === "layihe") {
        for (const id in projectList) {
          if (
            projectList[id].name.toLowerCase().includes(lowerCaseSearchTerm) &&
            object.layihe == projectList[id].id
          ) {
            return true;
          }
        }
      }
      return false;
    } else {
      // Check for other keys
      if (typeof field === "string") {
        return field.toLowerCase().includes(lowerCaseSearchTerm);
      } else if (Array.isArray(field)) {
        return field.some((item) =>
          typeof item === "string"
            ? item.toLowerCase().includes(lowerCaseSearchTerm)
            : typeof item === "object"
            ? Object.values(item).some((subField) =>
                typeof subField === "string"
                  ? subField.toLowerCase().includes(lowerCaseSearchTerm)
                  : false
              )
            : false
        );
      } else if (typeof field === "object" && field !== null) {
        return Object.values(field).some((subField) =>
          typeof subField === "string"
            ? subField.toLowerCase().includes(lowerCaseSearchTerm)
            : false
        );
      }
    }
    return false;
  });
}
