
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

const editableFields = [
  profileNameInput,
  profileHandleInput,
  profileRoleInput,
  profileGymInput
];


let originalBio =
  profileBioInput?.value || "";

let originalProfileValues = {};



// =========================
// HELPERS
// =========================


function autoGrowProfileField(field) {

  if (!field) return;

  const minHeight = 32;
  const maxHeight = 220;

  field.style.height = "0px";

  const nextHeight = Math.max(
    minHeight,
    Math.min(
      field.scrollHeight,
      maxHeight
    )
  );

  field.style.height =
    `${nextHeight}px`;

  field.style.overflowY =
    field.scrollHeight > maxHeight
      ? "auto"
      : "hidden";

}



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


function autoFitProfileName() {

  if (!profileNameInput) return;

  const parent =
    profileNameInput.parentElement;

  const maxWidth =
    parent.clientWidth;

  let fontSize = 40;
  const minFontSize = 18;

  // create hidden measurer
  const measurer =
    document.createElement("span");

  measurer.style.position = "absolute";
  measurer.style.visibility = "hidden";
  measurer.style.whiteSpace = "nowrap";

  measurer.style.fontFamily =
    getComputedStyle(profileNameInput).fontFamily;

  measurer.style.fontWeight =
    getComputedStyle(profileNameInput).fontWeight;

  document.body.appendChild(measurer);

  while (fontSize > minFontSize) {

    measurer.style.fontSize =
      `${fontSize}px`;

    measurer.textContent =
      profileNameInput.value || "";

    if (measurer.offsetWidth <= maxWidth) {
      break;
    }

    fontSize -= 1;

  }

  profileNameInput.style.fontSize =
    `${fontSize}px`;

  measurer.remove();

}


// =========================
// RUN ON STARTUP
// =========================



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



editableFields.forEach(field => {

  if (!field) return;

  // restore saved values
  const savedValue =
    localStorage.getItem(field.id);

  if (savedValue) {
    field.value = savedValue;
  }

  // store originals
  originalProfileValues[field.id] =
    field.value;

  // lock fields
  field.readOnly = true;

});


// bio setup
autoGrowProfileBioInput();
updateBioSaveButtonState();
autoFitProfileName();


// =========================
// EVENT LISTENERS
// =========================


// -------------------------
// EDIT PROFILE
// -------------------------

if (editProfileBtn) {

  editProfileBtn.addEventListener(
    "click",
    () => {

      document.body.classList.add(
        "editing-profile"
      );

      editableFields.forEach(field => {

        if (!field) return;

        field.readOnly = false;

      });

      if (profileBioInput) {

        originalBio =
          profileBioInput.value;

        profileBioInput.readOnly =
          false;

        autoGrowProfileBioInput();

      }

    }
  );

}

// -------------------------
// BIO INPUT
// -------------------------

profileBioInput?.addEventListener(
  "input",
  () => {

    autoGrowProfileBioInput();
    updateBioSaveButtonState();

  }
);


// -------------------------
// BIO SAVE
// -------------------------

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

        profileBioInput.blur();

      // save editable fields too
      editableFields.forEach(field => {

        if (!field) return;

        localStorage.setItem(
          field.id,
          field.value.trim()
        );

        originalProfileValues[field.id] =
          field.value;

        field.readOnly = true;

      });

      document.body.classList.remove(
        "editing-profile"
      );

    }
  );

}



// -------------------------
// BIO CANCEL
// -------------------------

if (profileBioCancel && profileBioInput) {

  profileBioCancel.addEventListener(
    "click",
    () => {

      // restore bio
      profileBioInput.value =
        originalBio;

      profileBioInput.readOnly =
        true;

      autoGrowProfileBioInput();

      // restore editable fields
      editableFields.forEach(field => {

        if (!field) return;

        field.value =
          originalProfileValues[field.id];

        field.readOnly = true;

      });

      document.body.classList.remove(
        "editing-profile"
      );

    }
  );

}



// -------------------------
// PROFILE NAME
// -------------------------

profileNameInput?.addEventListener(
  "input",
  () => {

    autoFitProfileName();

  }
);

[
  profileHandleInput,
  profileRoleInput,
  profileGymInput
].forEach(field => {

  if (!field) return;

  autoGrowProfileField(field);

 field.addEventListener(
  "input",
  () => {

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        autoGrowProfileField(field);

      });

    });

  }
);
});


// -------------------------
// WINDOW RESIZE
// -------------------------

window.addEventListener(
  "resize",
  () => {

    requestAnimationFrame(() => {

      autoGrowProfileBioInput();
      autoFitProfileName();

      autoGrowProfileField(
        profileHandleInput
      );

      autoGrowProfileField(
        profileRoleInput
      );

      autoGrowProfileField(
        profileGymInput
      );

    });

  }
);
