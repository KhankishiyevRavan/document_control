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
let rolesArray = [];
let senedNovuList = [];
let businessProcesses = [];
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
    senedNovuFilterOption();
    layiheFilterOption();
    terefFilterOption();
    let senedNovuText = senedNovuList.find(
      (s) => s.id == data[dataId].senedNovu
    );
    let businessProcessText = businessProcesses.find(
      (b) => b.id == data[dataId].businessProcess
    );
    console.log(businessProcessText);

    newRow.innerHTML = `
            <td>${data[dataId].siraCount}</td>
            <td>${senedNovuText?.name}</td>
            <td>${data[dataId].senedNomresi}</td>
            <td>${data[dataId].tarix ? data[dataId].tarix : ""}</td>
            <td>${
              businessProcessText?.name ? businessProcessText?.name : ""
            }</td>
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

    const deleteBtn = newRow.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      data = data.filter((_, i) => i !== dataId);
      cedveliGoster();
    });

    const editBtn = newRow.querySelector(".edit-btn");
    editBtn.addEventListener("click", function () {
      window.location.href =
        "/assets/pages/document/document-edit.html?id=" + dataId;
    });
  }

  // console.log(layiheList);
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
        // console.log(senedNovuList);

        const nestedObjects = Object.values(data);
        const lastObject = nestedObjects[nestedObjects.length - 1];
        siraCount = Number(lastObject.siraCount) + 1;
        window.localStorage.setItem("siraCount", siraCount);
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
  const typeValue = typeFilter.value; //
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
    console.log(cells[1]);
    console.log(typeValue);

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
      matchesFolder = cells[8].textContent.includes(folderValue); // 5-ci sütun (Qovluq)
    }

    // Tərəf filtr
    if (partyValue) {
      matchesParty = cells[7].textContent.includes(partyValue); // 4-cü sütun (Tərəflər)
    }

    // Layihe filtr
    if (layiheValue) {
      matchesLayihe = cells[6].textContent.includes(layiheValue); // 3-cü sütun (Layihə)
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
  // console.log(layiheList);

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
  // Existing logic to populate terefList
  partyFilter.innerHTML = ""; // Clear existing options
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  partyFilter.append(optionDefault);

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

  senedNovuList.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.name;
    option.textContent = role.name;
    typeFilter.append(option);
  });

  $(typeFilter).selectpicker("refresh");
};
// Call this function after you have fetched and populated terefList

getDocuments();
// const partySearchInput = document.getElementById("partySearchInput");

// // Function to filter party options based on the search input
// function filterPartyOptions() {
//   const searchValue = partySearchInput.value.toLowerCase(); // Get the input value
//   const options = partyFilter.getElementsByTagName("option");
//   console.log(options);

//   for (let i = 0; i < options.length; i++) {
//     const option = options[i];
//     console.log(option.textContent.toLowerCase().includes(searchValue));

//     // Show or hide option based on search value
//     option.style.display = option.textContent.toLowerCase().includes(searchValue) ? "" : "none";
//   }
//   $(partyFilter).selectpicker("refresh");
// }

// // Add event listener for the party search input
// partySearchInput.addEventListener("input", filterPartyOptions);
