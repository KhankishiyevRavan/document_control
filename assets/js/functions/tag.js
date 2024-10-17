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
