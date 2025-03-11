const queryString = window.location.search;

// URLSearchParams ile parametreleri ayıkla
const urlParams = new URLSearchParams(queryString);

// 'id' parametresini al
const documentId = urlParams.get("id");

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
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "/elta/documents/data/" + documentId);
const dataRefParams = ref(database, "/parametrs");

let data = [];
let datas = [];
let senedNovuList = [];
let businessProcesses = [];
let mainDocumentList = [];
let projectList = [];
let terefList = [];
let siraCount = null;

const form = document.getElementById("document-form");
const siraInput = document.querySelector("#sira");
const reletedDocSelect = document.querySelector("#reletedDoc");

const docNameDetails = document.querySelector("#doc-name-details");

let tagsArray = [];

const tagInput = document.getElementById("tag-input");
// const addTagBtn = document.getElementById("add-tag-btn");
const tagContainer = document.getElementById("tag-container");

const mainDocumentCheckbox = document.querySelector("#flexCheckDefault");

const typeSelect = document.querySelector("#sened-novu");
const businessSelect = document.querySelector("#business-prosess");

const projectListSelect = document.querySelector("#layihe");

tagInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag();
  }
});

// addTagBtn.addEventListener("click", function () {
//   addTag();
// });

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
let editingIndex = null;
siraInput.value = siraCount;

let rolesArray = [];

let roleNames = [];

function addRoleInput(roleName = "", role = "") {
  const rolesContainer = document.getElementById("rolesContainer");

  const roleDiv = document.createElement("div");
  roleDiv.classList.add("role-input", "col-xl-6", "mb-3");

  const suggestionsListRole = document.createElement("ul");
  suggestionsListRole.classList.add("dropdown-menu", "inner");
  suggestionsListRole.setAttribute("role", "presentation");
  suggestionsListRole.style.overflowY = "scroll";
  suggestionsListRole.style.maxHeight = "-webkit-fill-available";

  const roleNameSelect = document.createElement("select");
  roleNameSelect.classList.add("roleName");
  console.log(roleName);
  console.log(roleNames);

  for (let roleId in roleNames) {
    let role = roleNames[roleId];
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    console.log(roleName);

    if (role.id == roleName) {
      option.selected = true;
    }
    roleNameSelect.appendChild(option);
  }

  const roleInputDiv = document.createElement("div");
  roleInputDiv.style.width = "-webkit-fill-available";
  const roleInput = document.createElement("input");
  roleInput.type = "text";
  roleInput.placeholder = "Tərəf";
  roleInput.classList.add("role", "form-control");
  roleInput.value = role;
  roleInputDiv.appendChild(roleInput);
  roleDiv.appendChild(roleNameSelect);
  roleDiv.appendChild(roleInputDiv);
  roleInputDiv.appendChild(suggestionsListRole);
  rolesContainer.appendChild(roleDiv);
  $(roleNameSelect).selectpicker("refresh");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Sil";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button", "btn", "btn-danger");
  deleteButton.onclick = function () {
    roleDiv.remove();
  };
  terefDataListShow(roleInput, suggestionsListRole);
  roleDiv.appendChild(deleteButton);
}

document.getElementById("addRoleButton").addEventListener("click", function () {
  addRoleInput();
});
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const tagsString = tagsArray?.join(", ");
  // console.log(tagsString);

  const sira = parseInt(siraInput.value);
  const senedNovu = document.getElementById("sened-novu").value;
  const businessProcess = document.getElementById("business-prosess").value;
  const elaqeliSened = document.getElementById("reletedDoc").value;
  const senedNomresi = document.getElementById("sened-nomresi").value;
  const movzu = document.getElementById("movzu").value;
  const tarix = document.getElementById("datepicker").value;
  const layihe = document.getElementById("layihe").value;
  const qovluq = document.getElementById("qovluq").value;
  const senedSiraNomresi = document.getElementById("sened-sira-nomresi").value;
  // const senedTag = document.getElementById("sened-tag").value;
  const qeyd = document.getElementById("qeyd").value;
  const kimde = document.getElementById("kimde").value;

  const mainDocument = mainDocumentCheckbox.checked;

  rolesArray = [];
  const roleInputs = document.querySelectorAll(".role-input");
  roleInputs.forEach((roleDiv) => {
    // console.log(roleDiv);

    const roleName = roleDiv.querySelector("select.roleName").value;
    const role = roleDiv.querySelector(".role").value;

    // console.log(roleName, role);

    if (roleName && role) {
      rolesArray.push({ roleName, role });
    }
  });

  // console.log(data);

  // console.log(Object.keys(data));

  const existingSenedNomresiIndex = Object.keys(data).find(
    (key) => data[key].senedNomresi === senedNomresi
  );

  // console.log(existingSenedNomresiIndex);

  if (existingSenedNomresiIndex) {
    alert(
      "Bu sənəd nömrəsi artıq mövcuddur və Sıra nömrəsi " +
        data[existingSenedNomresiIndex].siraCount +
        "!" +
        " Xahiş olunur fərqli bir nömrə daxil edin."
    );
    return;
  }

  // console.log(existingSenedNomresiIndex);
  // console.log(rolesArray);

  data[editingIndex] = {
    siraCount: sira,
    senedNovu: senedNovu,
    businessProcess: businessProcess,
    elaqeliSened: elaqeliSened,
    senedNomresi: senedNomresi,
    movzu: movzu,
    tarix: tarix,
    layihe: layihe,
    qovluq: qovluq,
    kimde: kimde,
    terefler: rolesArray,
    senedSiraNomresi: senedSiraNomresi,
    tagsArray: tagsArray,
    qeyd: qeyd,
    mainDocument: mainDocument,
  };
  let updatedDocument = data[editingIndex];
  // console.log(updatedDocument);

  putDocuments(editingIndex, updatedDocument);

  editingIndex = null;
  const siraCount =
    Object.keys(data).length > 0
      ? Math.max(...Object.values(data).map((d) => d.siraCount)) + 1
      : 1;
  form.reset();
  siraInput.value = siraCount;

  const rolesContainer = document.getElementById("rolesContainer");
  rolesContainer.innerHTML = "";
});
const getDocument = async () => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        // console.log(res);

        // console.log(res);

        data = res;
        // for (let resId in data) {
        //   console.log(data[resId].mainDocument);

        //   if (data[resId].mainDocument) {
        //     mainDocumentList.push(data[resId].senedNomresi);
        //   }
        // }
        // console.log(mainDocumentList);

        mainDocumentOption();
        senedNovuFilterOption();
        projectListOption();
        businessProcessesOption();
        editDataShow();
        docNameDetails.textContent =
          data.senedNomresi + " nömrəli sənədin detalları";
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
getDocument();
const putDocuments = async (id, updatedDocument) => {
  // console.log(id);

  update(ref(database, "/elta/documents/data/" + id), updatedDocument)
    .then(() => {
      // if (snapshot.exists()) {
      //   const res = snapshot.val();
      // }
      // console.log(res);

      alert(" successfully updated!");
      // data[editingIndex] =
      editingIndex = null;
      window.location.pathname = "/assets/pages/document/document-page.html";
    })
    .catch((error) => {
      console.error("Error updating data: ", error);
      alert("Error updating data: ", error);
      return;
    });
};
const editDataShow = () => {
  document.getElementById("sened-novu").value = data.senedNovu;
  document.getElementById("business-prosess").value = data.businessProcess;

  document.getElementById("reletedDoc").value = data.elaqeliSened;
  // console.log(data.elaqeliSened);
  // console.log(document.getElementById("reletedDoc").value);

  document.getElementById("sened-nomresi").value = data.senedNomresi;
  document.getElementById("movzu").value = data.movzu;
  document.getElementById("datepicker").value = data.tarix;
  document.getElementById("layihe").value = data.layihe;
  document.getElementById("qovluq").value = data.qovluq;
  document.getElementById("sened-sira-nomresi").value = data.senedSiraNomresi;
  // document.getElementById("sened-tag").value = data.senedTag;
  document.getElementById("kimde").value = data.kimde;
  document.getElementById("qeyd").value = data.qeyd;
  mainDocumentCheckbox.checked = data.mainDocument;
  const rolesContainer = document.getElementById("rolesContainer");
  ////////////////////
  rolesContainer.innerHTML = "";

  ////////////////////
  tagContainer.innerHTML = "";
  tagsArray = data.tagsArray ? data.tagsArray : [];

  displayTags();

  siraInput.value = data.siraCount;
  editingIndex = documentId;
  // $(document.getElementById("sened-novu")).selectpicker("refresh");
  $(document.getElementById("qovluq")).selectpicker("refresh");
};
const dataRefS = ref(database, "/elta/documents");
const getDocuments = async () => {
  get(dataRefS)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        datas = res.data;
        getParametrs();
        // senedNovuList = res.parametrs.senedNovu;
        // businessProcesses = res.parametrs.businessProcess;
        projectList = res.parametrs.projectList;
        // console.log(datas);

        for (let resId in datas) {
          let terefler = datas[resId].terefler;
          terefler?.map((teref) => {
            if (!terefList.includes(teref.role)) {
              terefList.push(teref.role);
            }
          });
          if (datas[resId].mainDocument) {
            mainDocumentList.push(datas[resId].senedNomresi);
          }
        }
        mainDocumentOption();
        // senedNovuFilterOption();
        projectListOption();
        // businessProcessesOption();
        // projectDataListShow();
        // console.log(mainDocumentList);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
getDocuments();
const mainDocumentOption = () => {
  // console.log(mainDocumentList);

  reletedDocSelect.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  reletedDocSelect.append(optionDefault);

  mainDocumentList.map((project) => {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    reletedDocSelect.append(option);
  });
  // console.log(data);

  document.getElementById("reletedDoc").value = data.elaqeliSened;
  $(reletedDocSelect).selectpicker("refresh"); // Refresh to display the options
};

const senedNovuFilterOption = () => {
  typeSelect.innerHTML = ""; // Clear existing options
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  typeSelect.append(optionDefault);

  // console.log(senedNovuList);

  for (const sId in senedNovuList) {
    let role = senedNovuList[sId];
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    typeSelect.append(option);
  }

  document.getElementById("sened-novu").value = data.senedNovu;

  $(typeSelect).selectpicker("refresh");
};
const businessProcessesOption = () => {
  // console.log(businessSelect);
  // console.log(businessProcesses);

  businessSelect.innerHTML = ""; // Clear existing options
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  businessSelect.append(optionDefault);

  for (const bId in businessProcesses) {
    let role = businessProcesses[bId];
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    businessSelect.append(option);
  }

  document.getElementById("business-prosess").value = data.businessProcess;

  $(businessSelect).selectpicker("refresh");
};
const suggestionsList = document.getElementById("suggestions");
const createSuggestionItem = (item, input) => {
  const li = document.createElement("li");
  if (item.name) {
    li.textContent = item?.name;
    li.classList.add("dropdown-item", "drop-css");
    li.addEventListener("click", function () {
      input.value = item?.name;
      suggestionsList.innerHTML = "";
      suggestionsList.style.display = "none";
    });
  } else {
    li.textContent = item;
    li.classList.add("dropdown-item", "drop-css");
    li.addEventListener("click", function () {
      console.log(li);
      console.log(input);
      input.value = item;
      suggestionsList.innerHTML = "";
      suggestionsList.style.display = "none";
    });
  }
  return li;
};
const input = document.getElementById("layihe");

const showResults = (data, suggestionsList, input) => {
  console.log(suggestionsList);

  suggestionsList.innerHTML = "";
  data.forEach((item) => {
    const li = createSuggestionItem(item, input);
    suggestionsList.appendChild(li);
  });
  suggestionsList.style.display = data.length > 0 ? "block" : "none";
};
const projectListOption = () => {
  projectListSelect.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  projectListSelect.append(optionDefault);

  for (const bId in projectList) {
    let role = projectList[bId];
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    projectListSelect.append(option);
  }
  document.getElementById("layihe").value = data.layihe;

  $(projectListSelect).selectpicker("refresh");
};
// const projectDataListShow = () => {
//   input.addEventListener("input", function () {
//     const searchQuery = input.value.toLowerCase();
//     if (searchQuery.length >= 0) {
//       const filteredData = projectList.filter((item) =>
//         item.name.toLowerCase().includes(searchQuery)
//       );
//       showResults(filteredData, suggestionsList, input);
//     }
//   });

//   input.addEventListener("focus", function () {
//     // if (input.value.trim() === "") {
//     const searchQuery = input.value.toLowerCase();
//     if (searchQuery.length > 0) {
//       const filteredData = projectList.filter((item) =>
//         item.name.toLowerCase().includes(searchQuery)
//       );
//       showResults(filteredData, suggestionsList, input);
//     } else {
//       showResults(projectList, suggestionsList, input);
//     }
//     // }
//   });

//   document.addEventListener("click", function (e) {
//     if (e.target !== input) {
//       suggestionsList.innerHTML = "";
//       suggestionsList.style.display = "none";
//     }
//   });
// };
const terefDataListShow = (input, suggestionsListRole) => {
  input.addEventListener("input", function () {
    const searchQuery = input.value.toLowerCase();
    if (searchQuery.length >= 0) {
      const filteredData = terefList.filter((item) =>
        item.toLowerCase().includes(searchQuery)
      );
      console.log(filteredData);

      showResults(filteredData, suggestionsListRole, input);
    }
  });

  input.addEventListener("focus", function () {
    // if (input.value.trim() === "") {
    const searchQuery = input.value.toLowerCase();
    if (searchQuery.length > 0) {
      const filteredData = terefList.filter((item) =>
        item.toLowerCase().includes(searchQuery)
      );
      console.log(filteredData);

      showResults(filteredData, suggestionsListRole, input);
    } else {
      console.log(terefList);

      showResults(terefList, suggestionsListRole, input);
    }
    // }
  });
  document.addEventListener("click", function (e) {
    if (e.target !== input) {
      suggestionsListRole.innerHTML = "";
      suggestionsListRole.style.display = "none";
    }
  });
};
const getParametrs = async () => {
  get(dataRefParams)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        console.log(res);

        senedNovuList = res.senedNovu;
        businessProcesses = res.businessProcess;
        roleNames = res.rolesList;
        // projectList = res.parametrs.projectList;
        // console.log(senedNovuList);

        // const nestedObjects = Object.values(data);
        // const lastObject = nestedObjects[nestedObjects.length - 1];
        // siraCount = Number(lastObject.siraCount) + 1;
        // window.localStorage.setItem("siraCount", siraCount);
        rolesArray = data.terefler;
        console.log(rolesArray);

        rolesArray?.forEach((role) => {
          addRoleInput(role.roleName, role.role);
        });
        senedNovuFilterOption();
        businessProcessesOption();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error reading data: ", error);
    });
};
