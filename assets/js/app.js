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
  roleNames.forEach((name) => {
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

  const sira = parseInt(siraInput.value);
  const senedNovu = document.getElementById("sened-novu").value;
  const senedNomresi = document.getElementById("sened-nomresi").value;
  const movzu = document.getElementById("movzu").value;
  const qovluq = document.getElementById("qovluq").value;
  const senedSiraNomresi = document.getElementById("sened-sira-nomresi").value;
  const senedTag = document.getElementById("sened-tag").value;
  const qeyd = document.getElementById("qeyd").value;

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
  const existingSenedNomresiIndex = data.findIndex(
    (d, index) => d.senedNomresi === senedNomresi && index !== editingIndex
  );

  if (existingSenedNomresiIndex !== -1) {
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
    let id = data[editingIndex].id;
    data[editingIndex] = {
      id: id,
      siraCount: sira,
      senedNovu: senedNovu,
      senedNomresi: senedNomresi,
      movzu: movzu,
      qovluq: qovluq,
      terefler: rolesArray,
      senedSiraNomresi: senedSiraNomresi,
      senedTag: senedTag,
      qeyd: qeyd,
    };
    let updatedDocument = data[editingIndex];

    putDocuments(id, updatedDocument);

    editingIndex = null;
  } else {
    let newDocument = {
      siraCount: sira,
      senedNovu: senedNovu,
      senedNomresi: senedNomresi,
      movzu: movzu,
      qovluq: qovluq,
      terefler: rolesArray,
      senedSiraNomresi: senedSiraNomresi,
      senedTag: senedTag,
      qeyd: qeyd,
    };
    pushDocuments(newDocument);
    data.push(newDocument);
  }
  modal.classList.remove("show");
  cedveliGoster(); // Cədvəli yenidən göstəririk
  siraCount =
    data.length > 0 ? Math.max(...data.map((d) => d.siraCount)) + 1 : 1;
  form.reset();
  siraInput.value = siraCount;

  // Rol inputlarını təmizləyin
  const rolesContainer = document.getElementById("rolesContainer");
  rolesContainer.innerHTML = ""; // Bütün rol inputlarını silin
});

// Cədvəli göstərən funksiya
const cedveliGoster = () => {
  documentTableBody.innerHTML = "";

  data.forEach((d, index) => {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
          <td>${d.siraCount}</td>
          <td>${d.senedNovu}</td>
          <td>${d.senedNomresi}</td>
          <td>${d.movzu}</td>
          <td>
              ${d.terefler
                .map((t) => `<p>${t.roleName}: ${t.role}</p>`)
                .join("")}
          </td>
          <td>${d.qovluq}</td>
          <td>${d.senedSiraNomresi}</td>
          <td>${d.senedTag}</td>
          <td>${d.qeyd}</td>
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
      data = data.filter((_, i) => i !== index);
      cedveliGoster();
    });

    // "Redaktə et" düyməsi funksionallığı
    const editBtn = newRow.querySelector(".edit-btn");
    editBtn.addEventListener("click", function () {
      modal.classList.add("show");
      // Məlumatları formda yenidən göstərmək
      document.getElementById("sened-novu").value = d.senedNovu;
      document.getElementById("sened-nomresi").value = d.senedNomresi;
      document.getElementById("movzu").value = d.movzu;
      document.getElementById("qovluq").value = d.qovluq;
      document.getElementById("sened-sira-nomresi").value = d.senedSiraNomresi;
      document.getElementById("sened-tag").value = d.senedTag;
      document.getElementById("qeyd").value = d.qeyd;

      // Tərəflər arrayını göstərmək
      const rolesContainer = document.getElementById("rolesContainer");
      rolesContainer.innerHTML = ""; // Clear previous role inputs
      rolesArray = d.terefler;

      rolesArray.forEach((role) => {
        addRoleInput(role.roleName, role.role); // Add existing roles back to the form
      });

      siraInput.value = d.siraCount;
      editingIndex = index; // Set the editing index for updates
    });
  });
};
///////////////////////////////////////////////
const getDocuments = async () => {
  try {
    const response = await fetch("http://localhost:3004/documents");
    if (!response.ok) {
      throw new Error("Məlumatları çəkməkdə xəta baş verdi");
    }
    const documents = await response.json();
    siraCount = Number(documents[documents.length - 1].siraCount) + 1;
    siraInput.value = siraCount;
    data = documents; // API-dən gələn məlumatları data massivinə yazırıq
    cedveliGoster(); // Cədvəli yenidən göstəririk
  } catch (error) {
    console.error("Xəta:", error);
  }

  // get(dataRef)
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       const res = snapshot.val();
  //       console.log(res);
  //       siraCount = Number(res[res.length - 1].siraCount) + 1;
  //       siraInput.value = siraCount;
  //       data = res;
  //       cedveliGoster();
  //     } else {
  //       console.log("No data available");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error reading data: ", error);
  //   });
};
//////////////////////////////////////////////
const pushDocuments = async (newDocument) => {
  try {
    const response = await fetch("http://localhost:3004/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDocument), // Sənədi JSON formatında göndəririk
    });

    if (!response.ok) {
      throw new Error("Sənəd əlavə edilərkən xəta baş verdi");
    }
    getDocuments();
  } catch (error) {
    console.error("Xəta:", error);
    return;
  }
};

const putDocuments = async (id, updatedDocument) => {
  console.log(id);

  try {
    const response = await fetch(`http://localhost:3004/documents/${id}`, {
      method: "PUT", // PUT metodu istifadə edilir
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDocument), // Yenilənmiş sənədi JSON formatında göndəririk
    });

    if (!response.ok) {
      throw new Error("Sənəd yenilənərkən xəta baş verdi");
    }

    const updatedDocumentFromServer = await response.json();
    data[editingIndex] = updatedDocumentFromServer; // Yenilənmiş məlumatı data massivinə yeniləyirik
    editingIndex = null; // Redaktə prosesi bitdi, index sıfırlanır
    
  } catch (error) {
    console.error("Xəta:", error);
    return;
  }
};

getDocuments();
/////////////////////////////////////////////////////////
// Filtr inputlarını əldə edin
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");
const folderFilter = document.getElementById("folderFilter");
const partyFilter = document.getElementById("partyFilter");

// Filtr funksiyası
function filterDocuments() {
  const typeValue = typeFilter.value; // Sənəd növü seçimi
  const searchValue = searchInput.value.toLowerCase(); // Axtarış dəyəri
  const folderValue = folderFilter.value; // Qovluq seçimi
  const partyValue = partyFilter.value; // Tərəf seçimi

  const rows = documentTableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let matchesType = true;
    let matchesSearch = true;
    let matchesFolder = true;
    let matchesParty = true;

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
      matchesFolder = cells[5].textContent.includes(folderValue); // 5-ci sütun (Qovluq)
    }

    // Tərəf filtr
    if (partyValue) {
      matchesParty = cells[4].textContent.includes(partyValue); // 4-cü sütun (Tərəflər)
    }

    // Bütün kriteriyalar uyğun gəlirsə, satırı göstərin
    rows[i].style.display =
      matchesType && matchesSearch && matchesFolder && matchesParty
        ? ""
        : "none";
  }
}

// Filtr inputlarına hadisə dinləyiciləri əlavə edin
typeFilter.addEventListener("change", filterDocuments);
searchInput.addEventListener("input", filterDocuments);
folderFilter.addEventListener("change", filterDocuments);
partyFilter.addEventListener("change", filterDocuments);
