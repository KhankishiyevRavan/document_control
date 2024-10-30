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
const dataRef = ref(database, "/documents/data/" + documentId);
let data = [];
let datas = [];
let senedNovuList = [];
let businessProcesses = [];
let mainDocumentList = [];
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
  if (newTag !== "" && !tagsArray.includes(newTag)) {
    tagsArray.push(newTag);
    displayTags();
    tagInput.value = "";
  }
}

function displayTags() {
  tagContainer.innerHTML = "";
  tagsArray.forEach((tag, index) => {
    const tagElement = document.createElement("span");
    tagElement.classList.add("tag", "btn", "btn-danger", "mt-2");
    tagElement.textContent = tag;

    const removeBtn = document.createElement("span");
    removeBtn.classList.add("btn-icon-end");
    const removeBtnIcon = document.createElement("i");
    removeBtnIcon.classList.add("fas", "fa-times");
    removeBtn.append(removeBtnIcon);
    removeBtn.onclick = function () {
      tagsArray.splice(index, 1);
      displayTags();
    };

    tagElement.appendChild(removeBtn);
    tagContainer.appendChild(tagElement);
  });
}
let editingIndex = null;
siraInput.value = siraCount;

let rolesArray = [];

const roleNames = [
  "Podratçı",
  "SubPodratçı",
  "Sifarisçi ",
  "İcraçı",
  "İcarəyə verən",
  "İcarəçi",
  "Alıcı",
  "Satıcı",
];

function addRoleInput(roleName = "", role = "") {
  const rolesContainer = document.getElementById("rolesContainer");

  const roleDiv = document.createElement("div");
  roleDiv.classList.add("role-input", "col-xl-6", "mb-3");

  const roleNameSelect = document.createElement("select");
  roleNameSelect.classList.add("roleName");
  roleNames?.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (name === roleName) {
      option.selected = true;
    }
    roleNameSelect.appendChild(option);
  });

  const roleInput = document.createElement("input");
  roleInput.type = "text";
  roleInput.placeholder = "Rol";
  roleInput.classList.add("role", "form-control");
  roleInput.value = role;

  roleDiv.appendChild(roleNameSelect);
  roleDiv.appendChild(roleInput);

  rolesContainer.appendChild(roleDiv);
  $(roleNameSelect).selectpicker("refresh");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Sil";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button", "btn", "btn-danger");
  deleteButton.onclick = function () {
    roleDiv.remove();
  };

  roleDiv.appendChild(deleteButton);
}

document.getElementById("addRoleButton").addEventListener("click", function () {
  addRoleInput();
});
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const tagsString = tagsArray.join(", ");
  console.log(tagsString);

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

  update(ref(database, "/documents/data/" + id), updatedDocument)
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
  rolesArray = data.terefler;
  rolesArray?.forEach((role) => {
    addRoleInput(role.roleName, role.role);
  });
  ////////////////////
  tagContainer.innerHTML = "";
  tagsArray = data.tagsArray;

  displayTags();

  siraInput.value = data.siraCount;
  editingIndex = documentId;
  // $(document.getElementById("sened-novu")).selectpicker("refresh");
  $(document.getElementById("qovluq")).selectpicker("refresh");
};
const dataRefS = ref(database, "/documents");
const getDocuments = async () => {
  get(dataRefS)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        datas = res.data;
        senedNovuList = res.parametrs.senedNovu;
        businessProcesses = res.parametrs.businessProcess;

        for (let resId in datas) {
          if (datas[resId].mainDocument) {
            mainDocumentList.push(datas[resId].senedNomresi);
          }
        }
        mainDocumentOption();
        senedNovuFilterOption();
        businessProcessesOption();
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

  console.log(senedNovuList);

  senedNovuList.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    typeSelect.append(option);
  });

  document.getElementById("sened-novu").value = data.senedNovu;

  $(typeSelect).selectpicker("refresh");
};
const businessProcessesOption = () => {
  console.log(businessSelect);
  console.log(businessProcesses);

  businessSelect.innerHTML = ""; // Clear existing options
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  businessSelect.append(optionDefault);

  businessProcesses.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = role.name;
    businessSelect.append(option);
  });

  document.getElementById("business-prosess").value = data.businessProcess;

  $(businessSelect).selectpicker("refresh");
};
