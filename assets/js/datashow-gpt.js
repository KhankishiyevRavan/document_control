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
let rolesArray = []; // Rol arrayını yaradın
let layiheList = [];
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
  layiheList = [];
  terefList = [];
  // data.forEach((d, index) => {
  //   console.log(d);
  // });
  for (let dataId in data) {
    const newRow = document.createElement("tr");
    // console.log(data[dataId]);

    let layiheName = data[dataId].layihe;
    if (!layiheList.includes(layiheName)) {
      layiheList.push(layiheName);
    }

    let terefler = data[dataId].terefler;
    terefler?.map((teref) => {
      //   console.log(teref.role);

      if (!terefList.includes(teref.role)) {
        terefList.push(teref.role);
      }
    });

    newRow.innerHTML = `
            <td>${data[dataId].siraCount}</td>
            <td>${data[dataId].senedNovu}</td>
            <td>${data[dataId].senedNomresi}</td>
            <td>${data[dataId].tarix?data[dataId].tarix:""}</td>
            <td>${data[dataId].movzu}</td>
            <td>${data[dataId].layihe}</td>
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
            <td>${data[dataId].qeyd}</td>
            <td>
                <div class="d-flex">
			    	<button class="btn btn-primary shadow btn-xs sharp me-1 edit-btn"><i class="fa fa-pencil"></i></button>
			    	<button class="btn btn-danger shadow btn-xs sharp delete-btn"><i class="fa fa-trash"></i></button>
			    </div>
            </td>
            `;

    documentTableBody.appendChild(newRow);
    // "Sil" düyməsi funksionallığı
    const deleteBtn = newRow.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      data = data.filter((_, i) => i !== dataId);
      cedveliGoster();
    });

    // "Redaktə et" düyməsi funksionallığı
    const editBtn = newRow.querySelector(".edit-btn");
    editBtn.addEventListener("click", function () {
      window.location.href =
        "/assets/pages/document/document-edit.html?id=" + dataId;
    });
  }
  layiheFilterOption();
  terefFilterOption();
  console.log(layiheList);
};
const getDocuments = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        console.log(res);
        const nestedObjects = Object.values(res);
        const lastObject = nestedObjects[nestedObjects.length - 1];
        siraCount = Number(lastObject.siraCount) + 1;
        window.localStorage.setItem("siraCount", siraCount);
        data = res;
        cedveliGoster();
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
  const typeValue = typeFilter.value; // Sənəd növü seçimi
  const searchValue = searchInput.value.toLowerCase(); // Axtarış dəyəri
  const folderValue = folderFilter.value; // Qovluq seçimi
  const partyValue = partyFilter.value; // Tərəf seçimi
  const layiheValue = layiheFilter.value;

  const rows = documentTableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let matchesType = true;
    let matchesSearch = true;
    let matchesFolder = true;
    let matchesParty = true;
    let matchesLayihe = true;

    // Sənəd növü filtr
    if (typeValue) {
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
      matchesFolder = cells[7].textContent.includes(folderValue); // 5-ci sütun (Qovluq)
    }

    // Tərəf filtr
    if (partyValue) {
      matchesParty = cells[6].textContent.includes(partyValue); // 4-cü sütun (Tərəflər)
    }

    // Layihe filtr
    if (layiheValue) {
      matchesLayihe = cells[5].textContent.includes(layiheValue); // 3-cü sütun (Layihə)
    }

    // Bütün kriteriyalar uyğun gəlirsə, satırı göstərin
    rows[i].style.display =
      matchesType &&
      matchesSearch &&
      matchesFolder &&
      matchesParty &&
      matchesLayihe
        ? ""
        : "none";
  }
}

// Filtr inputlarına hadisə dinləyiciləri əlavə edin
typeFilter.addEventListener("change", filterDocuments);
searchInput.addEventListener("input", filterDocuments);
folderFilter.addEventListener("change", filterDocuments);
partyFilter.addEventListener("change", filterDocuments);
layiheFilter.addEventListener("change", filterDocuments);

const layiheFilterOption = () => {
  console.log(layiheList);

  layiheFilter.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  layiheFilter.append(optionDefault);

  layiheList.map((project) => {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    layiheFilter.append(option);
  });

  $(layiheFilter).selectpicker("refresh");
};
const terefFilterOption = () => {
  console.log(terefList);

  partyFilter.innerHTML = ""; // Clear existing options
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  partyFilter.append(optionDefault); // Add the default option

  // Add options dynamically from terefList
  terefList.map((project) => {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    partyFilter.append(option);
  });

  // If using Bootstrap select, refresh the selectpicker
  $(partyFilter).selectpicker("refresh"); // Refresh to display the options
};

getDocuments();
