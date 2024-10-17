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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "/documents");

let siraCount = 1;
const form = document.getElementById("document-form");
const documentTableBody = document.querySelector("#document-table tbody");
const siraInput = document.querySelector("#sira");

const btnModal = document.querySelector("#btn_modal");
const cancelModal = document.querySelector("#cancel_form");
const modal = document.querySelector(".modal_form");

let tagsArray = [];

// Enter düyməsinə və ya düyməyə basıldıqda tag əlavə etmək
const tagInput = document.getElementById("tag-input");
const addTagBtn = document.getElementById("add-tag-btn");
const tagContainer = document.getElementById("tag-container");

// Enter düyməsinə basıldıqda tag əlavə etmək
tagInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag();
  }
});

// Düyməyə basıldıqda tag əlavə etmək
addTagBtn.addEventListener("click", function () {
  addTag();
});

function addTag() {
  const newTag = tagInput.value.trim();
  if (newTag !== "" && !tagsArray.includes(newTag)) {
    tagsArray.push(newTag); // Tag arrayinə əlavə edirik
    displayTags(); // Tag-ları göstəririk
    tagInput.value = ""; // Input sahəsini təmizləyirik
  }
}

function displayTags() {
  tagContainer.innerHTML = "";
  tagsArray.forEach((tag, index) => {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.textContent = tag;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.onclick = function () {
      tagsArray.splice(index, 1); // Tag arraydən çıxarılır
      displayTags(); // Yenilənir
    };

    tagElement.appendChild(removeBtn);
    tagContainer.appendChild(tagElement);
  });
}

btnModal.addEventListener("click", () => {
  modal.classList.add("show");
});
cancelModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

let editingIndex = null; // Redaktə edilən sənədin indeksini saxlamaq üçün dəyişən
siraInput.value = siraCount;

let data = [];
let rolesArray = []; // Rol arrayını yaradın
let layiheList = [];
let terefList = [];
// Rol adları üçün seçimlər
const roleNames = [
  "Müəllim",
  "Təchizatçı",
  "Müdir",
  "İşçi",
  "Icraci",
  "Sifarisci ",
]; // İstədiyiniz rol adlarını buraya əlavə edin

// Dinamik rol inputları üçün funksiyadır
function addRoleInput(roleName = "", role = "") {
  const rolesContainer = document.getElementById("rolesContainer");

  // Yeni rol input divini yaradın
  const roleDiv = document.createElement("div");
  roleDiv.classList.add("role-input");

  // Rol adı üçün seçim (select)
  const roleNameSelect = document.createElement("select");
  roleNameSelect.classList.add("roleName");
  roleNames?.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (name === roleName) {
      option.selected = true; // Əgər redaktə edilirsə, seçimi əlavə edin
    }
    roleNameSelect.appendChild(option);
  });

  // Rol inputu
  const roleInput = document.createElement("input");
  roleInput.type = "text";
  roleInput.placeholder = "Rol";
  roleInput.classList.add("role");
  roleInput.value = role; // Əgər redaktə edilirsə, dəyəri əlavə edin

  // Rol inputlarını div-ə əlavə edin
  roleDiv.appendChild(roleNameSelect);
  roleDiv.appendChild(roleInput);

  // Divi konteynerə əlavə edin
  rolesContainer.appendChild(roleDiv);

  // Sil düyməsi yaradın
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Sil";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = function () {
    roleDiv.remove(); // Rol input divini sil
  };

  roleDiv.appendChild(deleteButton); // Sil düyməsini rol divinə əlavə edin
}

// "+" düyməsinə basıldıqda rol inputları əlavə edin
document.getElementById("addRoleButton").addEventListener("click", function () {
  addRoleInput(); // Yeni boş inputlar əlavə edin
});

// Form submit edildikdə işləyən funksiya
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const tagsString = tagsArray.join(", "); // Tag-ları vergül ilə ayırıb stringə çeviririk
  console.log(tagsString);

  const sira = parseInt(siraInput.value);
  const senedNovu = document.getElementById("sened-novu").value;
  const senedNomresi = document.getElementById("sened-nomresi").value;
  const movzu = document.getElementById("movzu").value;
  const layihe = document.getElementById("layihe").value;
  const qovluq = document.getElementById("qovluq").value;
  const senedSiraNomresi = document.getElementById("sened-sira-nomresi").value;
  // const senedTag = document.getElementById("sened-tag").value;
  const qeyd = document.getElementById("qeyd").value;
  const kimde = document.getElementById("kimde").value; // "kimde" sahəsinin dəyərini al

  // Rol inputlarından məlumat toplayın
  rolesArray = [];
  const roleInputs = document.querySelectorAll(".role-input");
  roleInputs.forEach((roleDiv) => {
    const roleName = roleDiv.querySelector(".roleName").value;
    const role = roleDiv.querySelector(".role").value;
    if (roleName && role) {
      rolesArray.push({ roleName, role });
    }
  });

  // Eyni sənəd nömrəsi varmı yoxlanılır
  const existingSenedNomresiIndex = Object.keys(data).find(
    (key) => data[key].senedNomresi === senedNomresi && key !== editingIndex // burada id-nizi istifadə edirsinizsə, `editingIndex` olmalı
  );
  console.log(existingSenedNomresiIndex);

  if (existingSenedNomresiIndex) {
    alert(
      "Bu sənəd nömrəsi artıq mövcuddur və Sıra nömrəsi " +
        data[existingSenedNomresiIndex].siraCount +
        "!" +
        " Xahiş olunur fərqli bir nömrə daxil edin."
    );
    return;
  }

  if (editingIndex !== null) {
    // Əgər redaktə edilirsə, mövcud məlumatları yeniləyirik
    data[editingIndex] = {
      siraCount: sira,
      senedNovu: senedNovu,
      senedNomresi: senedNomresi,
      movzu: movzu,
      layihe: layihe,
      qovluq: qovluq,
      kimde: kimde, // "kimde" sahəsini əlavə edin
      terefler: rolesArray,
      senedSiraNomresi: senedSiraNomresi,
      tagsArray: tagsArray,
      qeyd: qeyd,
    };
    let updatedDocument = data[editingIndex];
    console.log(updatedDocument);

    putDocuments(editingIndex, updatedDocument);

    editingIndex = null;
  } else {
    let newDocument = {
      siraCount: sira,
      senedNovu: senedNovu,
      senedNomresi: senedNomresi,
      movzu: movzu,
      layihe: layihe,
      qovluq: qovluq,
      kimde: kimde, // "kimde" sahəsini əlavə edin
      terefler: rolesArray,
      senedSiraNomresi: senedSiraNomresi,
      tagsArray: tagsArray,
      qeyd: qeyd,
    };

    pushDocuments(newDocument);
    data = { ...data, newDocument };
  }
  modal.classList.remove("show");
  cedveliGoster(); // Cədvəli yenidən göstəririk
  const siraCount =
    Object.keys(data).length > 0
      ? Math.max(...Object.values(data).map((d) => d.siraCount)) + 1
      : 1;
  form.reset();
  siraInput.value = siraCount;

  // Rol inputlarını təmizləyin
  const rolesContainer = document.getElementById("rolesContainer");
  rolesContainer.innerHTML = ""; // Bütün rol inputlarını silin
});

// Cədvəli göstərən funksiya
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
      console.log(teref.role);

      if (!terefList.includes(teref.role)) {
        terefList.push(teref.role);
      }
    });
    newRow.innerHTML = `
          <td>${data[dataId].siraCount}</td>
          <td>${data[dataId].senedNovu}</td>
          <td>${data[dataId].senedNomresi}</td>
          <td>${data[dataId].movzu}</td>
          <td>${data[dataId].layihe}</td>
          <td>
              ${
                data[dataId].terefler
                  ? data[dataId].terefler
                      ?.map((t) => `<p>${t.roleName}: ${t.role}</p>`)
                      .join("")
                  : " "
              }
          </td>
          <td>${data[dataId].qovluq}</td>
          <td>${data[dataId].senedSiraNomresi}</td>
          <td class="tag">${data[dataId].tagsArray}</td>
          <td>${data[dataId].kimde}</td>
          <td>${data[dataId].qeyd}</td>
          <td>
              <button class="edit-btn" title="Redaktə et">
                  <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn" title="Sil">
                  <i class="fas fa-trash"></i>
              </button>
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
      modal.classList.add("show");
      // Məlumatları formda yenidən göstərmək
      document.getElementById("sened-novu").value = data[dataId].senedNovu;
      document.getElementById("sened-nomresi").value =
        data[dataId].senedNomresi;
      document.getElementById("movzu").value = data[dataId].movzu;
      document.getElementById("layihe").value = data[dataId].layihe;
      document.getElementById("layihe").value = data[dataId].layihe;
      document.getElementById("qovluq").value = data[dataId].qovluq;
      document.getElementById("sened-sira-nomresi").value =
        data[dataId].senedSiraNomresi;
      // document.getElementById("sened-tag").value = data[dataId].senedTag;
      document.getElementById("qeyd").value = data[dataId].qeyd;

      const rolesContainer = document.getElementById("rolesContainer");
      rolesContainer.innerHTML = "";
      rolesArray = data[dataId].terefler;

      rolesArray?.forEach((role) => {
        addRoleInput(role.roleName, role.role);
      });

      siraInput.value = data[dataId].siraCount;
      editingIndex = dataId;
      console.log(editingIndex);
      // Set the editing index for updates
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
        // console.log(res);

        const nestedObjects = Object.values(res);

        // Sonuncu obyekti tap
        const lastObject = nestedObjects[nestedObjects.length - 1];
        siraCount = Number(lastObject.siraCount) + 1;
        siraInput.value = siraCount;
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
//////////////////////////////////////////////
const pushDocuments = async (newDocument) => {
  // try {
  //   const response = await fetch("http://localhost:3004/documents", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(newDocument), // Sənədi JSON formatında göndəririk
  //   });

  //   if (!response.ok) {
  //     throw new Error("Sənəd əlavə edilərkən xəta baş verdi");
  //   }
  // } catch (error) {
  //   console.error("Xəta:", error);
  //   return;
  // }
  var objKey = push(dataRef).key;
  set(ref(database, "/documents/" + objKey), {
    ...newDocument,
  })
    .then(() => {
      alert("Data successfully written!");
    })
    .catch((error) => {
      alert("Error writing data: ", error);
    });
};

const putDocuments = async (id, updatedDocument) => {
  // try {
  //   const response = await fetch(`http://localhost:3004/documents/${id}`, {
  //     method: "PUT", // PUT metodu istifadə edilir
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(updatedDocument), // Yenilənmiş sənədi JSON formatında göndəririk
  //   });

  //   if (!response.ok) {
  //     throw new Error("Sənəd yenilənərkən xəta baş verdi");
  //   }

  //   const updatedDocumentFromServer = await response.json();
  //   data[editingIndex] = updatedDocumentFromServer; // Yenilənmiş məlumatı data massivinə yeniləyirik
  //   editingIndex = null; // Redaktə prosesi bitdi, index sıfırlanır
  // } catch (error) {
  //   console.error("Xəta:", error);
  //   return;
  // }
  console.log(id);

  update(ref(database, "/documents/" + id), updatedDocument)
    .then(() => {
      // if (snapshot.exists()) {
      //   const res = snapshot.val();
      // }
      // console.log(res);

      console.log("Price successfully updated!");
      // data[editingIndex] =
      editingIndex = null;
    })
    .catch((error) => {
      console.error("Error updating price: ", error);
      return;
    });
};

getDocuments();
/////////////////////////////////////////////////////////
// Filtr inputlarını əldə edin
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

    // Qovluq filtr
    if (folderValue) {
      matchesFolder = cells[6].textContent.includes(folderValue); // 5-ci sütun (Qovluq)
    }

    // Tərəf filtr
    if (partyValue) {
      matchesParty = cells[5].textContent.includes(partyValue); // 4-cü sütun (Tərəflər)
    }

    if (layiheValue) {
      matchesLayihe = cells[4].textContent.includes(layiheValue); // 3-cü sütun (Layihə)
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
};
const terefFilterOption = () => {
  console.log(terefList);

  partyFilter.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Hamısını Göstər";
  partyFilter.append(optionDefault);

  terefList.map((project) => {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    partyFilter.append(option);
  });
};
