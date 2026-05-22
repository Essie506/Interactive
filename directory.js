
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


// =========================
// ELEMENTS
// =========================

const profileHandleText =
  document.getElementById(
    "profileHandleText"
  );

const profileRoleText =
  document.getElementById(
    "profileRoleText"
  );

const profileGymText =
  document.getElementById(
    "profileGymText"
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

const editableContent = [
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


// =========================
// SAVE PROFILE
// =========================

function saveProfileDetails() {

  const handle =
    profileHandleInput.textContent.trim();

  const role =
    profileRoleInput.textContent.trim();

  const gym =
    profileGymInput.textContent.trim();


  // update view text
  profileHandleText.textContent =
    handle;

  profileRoleText.textContent =
    role;

  profileGymText.textContent =
    gym;


  // save locally
  localStorage.setItem(
    "profileHandle",
    handle
  );

  localStorage.setItem(
    "profileRole",
    role
  );

  localStorage.setItem(
    "profileGym",
    gym
  );

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
// LOAD SAVED VALUES
// =========================

editableContent.forEach(field => {

  if (!field) return;

  const savedValue =
    localStorage.getItem(field.id);

  if (savedValue) {

    field.textContent =
      savedValue;

  }

  originalProfileValues[field.id] =
    field.textContent;

  field.contentEditable =
    "false";

});


// sync display text
profileHandleText.textContent =
  profileHandleInput.textContent;

profileRoleText.textContent =
  profileRoleInput.textContent;

profileGymText.textContent =
  profileGymInput.textContent;



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


      // unlock editable content
      editableContent.forEach(field => {

        if (!field) return;

        originalProfileValues[field.id] =
          field.textContent;

        field.contentEditable =
          "true";

      });


      // unlock bio
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

      // save bio
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


   // save profile details
      saveProfileDetails();


      // lock editable content
      editableContent.forEach(field => {

        if (!field) return;

        field.contentEditable =
          "false";

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


      // restore editable content
      editableContent.forEach(field => {

        if (!field) return;

        field.textContent =
          originalProfileValues[field.id];

        field.contentEditable =
          "false";

      });


      // restore display text
      profileHandleText.textContent =
        profileHandleInput.textContent;

      profileRoleText.textContent =
        profileRoleInput.textContent;

      profileGymText.textContent =
        profileGymInput.textContent;


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





// -------------------------
// WINDOW RESIZE
// -------------------------

window.addEventListener(
  "resize",
  () => {

    requestAnimationFrame(() => {

      autoGrowProfileBioInput();
      autoFitProfileName();

    });

  }
);




