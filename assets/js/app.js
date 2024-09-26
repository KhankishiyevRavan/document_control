let siraCount = 1;
const form = document.getElementById("document-form");
const documentTableBody = document.querySelector("#document-table tbody");
const siraInput = document.querySelector("#sira");
siraInput.value = siraCount;

let data = [];

// Form submit edildikdə işləyən funksiya
let editingIndex = null; // Redaktə edilən sənədin indeksini saxlamaq üçün dəyişən

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const sira = parseInt(siraInput.value);
  const senedNovu = document.getElementById("sened-novu").value;
  const senedNomresi = document.getElementById("sened-nomresi").value;
  const movzu = document.getElementById("movzu").value;
  const terefler = document.getElementById("terefler").value;
  const qovluq = document.getElementById("qovluq").value;
  const qeyd = document.getElementById("qeyd").value;

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
    data[editingIndex] = {
      siraCount: sira,
      senedNovu: senedNovu,
      senedNomresi: senedNomresi,
      movzu: movzu,
      qovluq: qovluq,
      terefler: terefler,
      qeyd: qeyd,
    };
    editingIndex = null; // Redaktə bitdi, index təmizlənir
  } else {
    // Əgər redaktə edilmirsə, yeni sənəd əlavə edirik
    data.push({
      siraCount: sira,
      senedNovu: senedNovu,
      senedNomresi: senedNomresi,
      movzu: movzu,
      qovluq: qovluq,
      terefler: terefler,
      qeyd: qeyd,
    });
  }

  cedveliGoster(); // Cədvəli yenidən göstəririk
  siraCount =
    data.length > 0 ? Math.max(...data.map((d) => d.siraCount)) + 1 : 1;

  form.reset();
  siraInput.value = siraCount;
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
          <td>${d.terefler}</td>
          <td>${d.qovluq}</td>
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
      // Məlumatları formda yenidən göstərmək
      document.getElementById("sened-novu").value = d.senedNovu;
      document.getElementById("sened-nomresi").value = d.senedNomresi;
      document.getElementById("movzu").value = d.movzu;
      document.getElementById("terefler").value = d.terefler;
      document.getElementById("qovluq").value = d.qovluq;
      document.getElementById("qeyd").value = d.qeyd;

      // Redaktə edərkən sıra nömrəsini yenidən formda göstəririk
      siraInput.value = d.siraCount;

      // Redaktə edilən sənədin indeksini qeyd edirik
      editingIndex = index;
    });
  });
};
