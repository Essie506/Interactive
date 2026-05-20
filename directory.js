
const editProfileBtn = document.getElementById(
    "editProfileBtn"
  );

const bioText = document.getElementById(
    "profileBioText"
  );


const profileBioInput =
  document.getElementById(
    "profileBioInput"
  );

const profileBioSave =
  document.getElementById(
    "profileBioSave"
  );


const profileBioCancel =
  document.getElementById(
    "profileBioCancel"
  );


const profileNameInput =
  document.getElementById(
    "profileNameInput"
  );

const profileHandleInput =
  document.getElementById(
    "profileHandleInput"
  );

const profileRoleInput =
  document.getElementById(
    "profileRoleInput"
  );

const profileGymInput =
  document.getElementById(
    "profileGymInput"
  );


let originalBio =
  profileBioInput?.value || "";

let originalProfileValues = {};



// =========================
// HELPERS
// =========================

function autoGrowProfileBioInput() {

 if (!profileBioInput) return;

const wrap =
  profileBioInput.closest(".profile-section-inner");

  const minHeight = 55.5;
  const maxHeight = 550;

 profileBioInput.style.height = "0px";

  if (wrap) {
    wrap.style.height = "auto";
  }

 const nextHeight = Math.max(
  minHeight,
  Math.min(
    profileBioInput.scrollHeight,
    maxHeight
  )
);

  profileBioInput.style.height =
    `${nextHeight}px`;

profileBioInput.style.overflowY =
  profileBioInput.scrollHeight > maxHeight
    ? "auto"
    : "hidden";

  if (wrap) {

    wrap.style.height =
      `${nextHeight}px`;

    wrap.style.minHeight =
      `${minHeight}px`;

  }

}

function updateBioSaveButtonState() {

  const hasText =
    profileBioInput &&
    profileBioInput.value.trim().length > 0;

  profileBioSave?.classList.toggle(
    "ready",
    hasText
  );

}


// =========================
// LOAD SAVED BIO
// =========================


const savedBio =
  localStorage.getItem(
    "profileBio"
  );

if (
  savedBio &&
  profileBioInput
) {

  profileBioInput.value =
    savedBio;

}

// =========================
// SAVE / CANCEL
// =========================

if (profileBioSave && profileBioInput) {

  profileBioSave.addEventListener(
    "click",
    () => {

      const newBio =
        profileBioInput.value.trim();

      localStorage.setItem(
        "profileBio",
        newBio
      );

      profileBioInput.value =
        newBio;

      profileBioInput.readOnly =
        true;

      document.body.classList.remove(
        "editing-profile"
      );

    }
  );

}

if (profileBioCancel && profileBioInput) {

  profileBioCancel.addEventListener(
    "click",
    () => {

      profileBioInput.value =
        originalBio;

      profileBioInput.readOnly =
        true;

      autoGrowProfileBioInput();

      document.body.classList.remove(
        "editing-profile"
      );

    }
  );

}

profileBioInput?.addEventListener(
  "input",
  () => {

    autoGrowProfileBioInput();
    updateBioSaveButtonState();

  }
);

window.addEventListener(
  "resize",
  autoGrowProfileBioInput
);

autoGrowProfileBioInput();
updateBioSaveButtonState();

// =========================
// EDIT / EVENT LISTENERS
// =========================


if (editProfileBtn) {

  editProfileBtn.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "editing-profile"
      );


      if (profileBioInput) {

        originalBio =
          profileBioInput.value;

        profileBioInput.readOnly =
          false;

        profileBioInput.focus();

        autoGrowProfileBioInput();

      }

    }
  );

}

editableFields.forEach(field => {

  if (!field) return;

  originalProfileValues[field.id] =
    field.value;

  field.readOnly = false;

});

editableFields.forEach(field => {

  if (!field) return;

  field.readOnly = true;

  localStorage.setItem(
    field.id,
    field.value.trim()
  );

});

editableFields.forEach(field => {

  if (!field) return;

  field.value =
    originalProfileValues[field.id];

  field.readOnly = true;

});

editableFields.forEach(field => {

  if (!field) return;

  const savedValue =
    localStorage.getItem(field.id);

  if (savedValue) {
    field.value = savedValue;
  }

});



