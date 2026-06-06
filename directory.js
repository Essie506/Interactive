
const editProfileBtn = document.getElementById(
    "editProfileBtn"
  );

const bioText = document.getElementById(
    "profileBioText"
  );


const navTitleInput =
  document.getElementById("navTitleInput");

const accountOnlineNameInput =
  document.getElementById("accountOnlineNameInput");


const profileBioInput =
  document.getElementById(
    "profileBioInput"
  );

const profileBioSave =
  document.getElementById(
    "profileBioSave"
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


const profileAffiliationToggle =
  document.getElementById(
    "profileAffiliationToggle"
  );

const profileAffiliationMenu =
  document.getElementById(
    "profileAffiliationMenu"
  );

const profileAffiliationText =
  document.getElementById(
    "profileAffiliationText"
  );

const customerFitnessLevelText =
  document.getElementById(
    "customerFitnessLevelText"
  );

const customerFitnessLevelToggle =
  document.getElementById(
    "customerFitnessLevelToggle"
  );

const customerFitnessLevelMenu =
  document.getElementById(
    "customerFitnessLevelMenu"
  );



const servicesEditBtn =
  document.getElementById("servicesEditBtn");

const servicesModalOverlay =
  document.getElementById("servicesModalOverlay");

const servicesModalClose =
  document.getElementById("servicesModalClose");

const servicesCancelBtn =
  document.getElementById("servicesCancelBtn");

const servicesSaveBtn =
  document.getElementById("servicesSaveBtn");

const servicePillOptions =
  document.querySelectorAll(".service-pill-option");

const roleSuggestionsBox =
  document.getElementById(
    "roleSuggestionsBox"
  );


const editableFields = [
  profileNameInput,
  profileHandleInput,
  profileRoleInput,
  profileGymInput
];


// =========================
// DATA
// =========================



const roleSuggestions = [
  "Personal Trainer",
  "Strength Coach",
  "Running Coach",
  "Online Coach",
  "Functional Fitness Coach",
  "HYROX Coach",
  "Class Instructor",
  "Nutrition Coach",
  "Nutritionist",
  "Diet Coach",
  "Meal Planning",
  "Weight Loss Coach",
  "Fat Loss Coach",
  "Physiotherapist",
  "Sports Therapist",
  "Rehabilitation Coach",
  "Injury Recovery",
  "Mobility Specialist",
  "Yoga Instructor",
  "Pilates Instructor",
  "Boxing Coach",
  "MMA Coach"
];



// =========================
// OG STATE VARIABLES
// =========================


let originalBio =
  profileBioInput?.value || "";

let originalProfileValues = {};



// =========================
// HELPERS
// =========================


function getSelectedAffiliations() {
  return Array.from(
    document.querySelectorAll(
      "#profileAffiliationMenu input:checked"
    )
  ).map(input => input.value);
}

function getSelectedItems(menuId) {
  return Array.from(
    document.querySelectorAll(
      `#${menuId} input:checked`
    )
  ).map(input => input.value);
}



function updateAffiliationText() {
  if (!profileAffiliationText) return;

  const selected =
    getSelectedAffiliations();

  profileAffiliationText.textContent =
    selected.length
      ? selected
          .map(item => `✓ ${item}`)
          .join("  •  ")
      : "Select status";
}


function updateFitnessLevelText() {
  if (!customerFitnessLevelText)
    return;

  const selected =
    getSelectedItems(
      "customerFitnessLevelMenu"
    );

  customerFitnessLevelText.textContent =
    selected.length
      ? selected.join("  •  ")
      : "Select fitness level";
}


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

void field.offsetHeight;

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

  const isEditing =
    document.body.classList.contains(
      "editing-profile"
    );

  profileBioSave?.classList.toggle(
    "ready",
    isEditing
  );

}

function autoFitProfileName() {
  if (!profileNameInput) return;

  const parent =
    profileNameInput.closest(".profile-name-row") ||
    profileNameInput.parentElement;

  if (!parent) return;

  profileNameInput.style.width = "100%";
  profileNameInput.style.maxWidth = "100%";

  const maxWidth =
    parent.clientWidth || 260;

  let fontSize = 40;
  const minFontSize = 6;

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
    measurer.style.fontSize = `${fontSize}px`;

    measurer.textContent =
      profileNameInput.value || "Profile";

    if (measurer.offsetWidth <= maxWidth) {
      break;
    }

    fontSize -= 1;
  }

  profileNameInput.style.fontSize =
    `${fontSize}px`;

  measurer.remove();
}


function autoFitNavTitle() {

  if (!navTitleInput) return;

 const parent =
  navTitleInput.closest(".nav-title-wrap") ||
  navTitleInput.parentElement;

  if (!parent) return;

    navTitleInput.style.width = "100%";
navTitleInput.style.maxWidth = "100%";

  const maxWidth =
    parent.clientWidth;

  let fontSize = 20;
  const minFontSize = 6;

  const measurer =
    document.createElement("span");

  measurer.style.position =
    "absolute";

  measurer.style.visibility =
    "hidden";

  measurer.style.whiteSpace =
    "nowrap";

  measurer.style.fontFamily =
    getComputedStyle(navTitleInput)
      .fontFamily;

  measurer.style.fontWeight =
    getComputedStyle(navTitleInput)
      .fontWeight;

  document.body.appendChild(
    measurer
  );

  while (fontSize > minFontSize) {

    measurer.style.fontSize =
      `${fontSize}px`;

    measurer.textContent =
      navTitleInput.value || "Profile";

    if (
      measurer.offsetWidth <=
      maxWidth
    ) {
      break;
    }

    fontSize -= 1;
  }

  navTitleInput.style.fontSize =
    `${fontSize}px`;

  measurer.remove();
}




function openServicesModal() {
  servicesModalOverlay?.classList.add("open");
}

function closeServicesModal() {
  servicesModalOverlay?.classList.remove("open");
}


function resizeNavTitleInput() {
  if (!navTitleInput) return;

  navTitleInput.style.width = "1px";

  const nextWidth =
    Math.max(40, navTitleInput.scrollWidth);

  navTitleInput.style.width =
    `${nextWidth}px`;

  requestAnimationFrame(() => {
    navTitleInput.scrollLeft = 0;
  });
}

// =========================
// RUN ON STARTUP
// =========================



const savedAffiliations =
  JSON.parse(
    localStorage.getItem("profileAffiliation") || "[]"
  );

document
  .querySelectorAll("#profileAffiliationMenu input")
  .forEach(input => {
    input.checked =
      savedAffiliations.includes(input.value);
  });

updateAffiliationText();


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

if (
  navTitleInput &&
  profileNameInput
) {
  navTitleInput.value =
    profileNameInput.value;
}

autoFitNavTitle();


// =========================
// EVENT LISTENERS
// =========================

document
  .querySelectorAll("#customerFitnessLevelMenu input")
  .forEach(input => {
    input.addEventListener(
      "change",
      updateFitnessLevelText
    );
  });


document
  .querySelectorAll("#profileAffiliationMenu input")
  .forEach(input => {
    input.addEventListener(
      "change",
      updateAffiliationText
    );
  });

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

          updateBioSaveButtonState();

      if (profileBioInput) {

        originalBio =
          profileBioInput.value;

        profileBioInput.readOnly =
          false;

        autoGrowProfileBioInput();

      }

    }
  );


   profileAffiliationToggle?.addEventListener(
  "click",
  (event) => {

    if (
      !document.body.classList.contains(
        "editing-profile"
      )
    ) {
      return;
    }

    event.stopPropagation();

    if (profileAffiliationMenu) {
      profileAffiliationMenu.hidden =
        !profileAffiliationMenu.hidden;
    }

  }
);
}


document.addEventListener(
  "click",
  () => {

    if (profileAffiliationMenu) {
      profileAffiliationMenu.hidden = true;
    }

  }
);

profileAffiliationMenu?.addEventListener(
  "click",
  (event) => {

    event.stopPropagation();

  }
);


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

        updateBioSaveButtonState();

    }
  );

}


// -------------------------
// PROFILE NAME
// -------------------------

profileNameInput?.addEventListener(
  "input",
  () => {

       console.log("profile name input fired");
    autoFitProfileName();

    requestAnimationFrame(() => {
      autoFitProfileName();
    
    });

    if (navTitleInput) {
      navTitleInput.value =
        profileNameInput.value;
         autoFitNavTitle();
    }
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

    autoGrowProfileField(field);

  }
);
    });


// -------------------------
// PROFILE NAME BANNER
// -------------------------

editProfileBtn?.addEventListener(
  "click",
  () => {
    if (navTitleInput) {
  navTitleInput.readOnly = false;
}
  }
);

profileBioSave?.addEventListener(
  "click",
  () => {

      if (profileAffiliationMenu) {
  profileAffiliationMenu.hidden = true;
}


localStorage.setItem(
  "profileAffiliation",
  JSON.stringify(
    getSelectedAffiliations()
  )
);

      
    const onlineName =
      navTitleInput.value.trim() || "Profile";

    navTitleInput.value = onlineName;

    if (accountOnlineNameInput) {
      accountOnlineNameInput.value = onlineName;
    }

      if (profileNameInput) {
  profileNameInput.value = onlineName;
}

      autoFitProfileName();
autoFitNavTitle();

    localStorage.setItem(
      "accountOnlineName",
      onlineName
    );

    if (navTitleInput) {
  navTitleInput.readOnly = true;
}
  }
);




navTitleInput?.addEventListener(
  "input",
  () => {

    if (profileNameInput) {
      profileNameInput.value =
        navTitleInput.value;
    }

      if (accountOnlineNameInput) {
  accountOnlineNameInput.value =
    navTitleInput.value;
}

    autoFitProfileName();
       autoFitNavTitle();


  }
);


resizeNavTitleInput();

navTitleInput?.addEventListener(
  "input",
  resizeNavTitleInput
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
          autoFitNavTitle();

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


servicesEditBtn?.addEventListener("click", openServicesModal);
servicesModalClose?.addEventListener("click", closeServicesModal);
servicesCancelBtn?.addEventListener("click", closeServicesModal);

servicePillOptions.forEach(pill => {
  pill.addEventListener("click", () => {
    pill.classList.toggle("active");
  });
});

servicesSaveBtn?.addEventListener("click", () => {
  const selectedServices = [...servicePillOptions]
    .filter(pill => pill.classList.contains("active"))
    .map(pill => pill.textContent.trim());

  console.log(selectedServices);

  closeServicesModal();
});


// -------------------------
// ROLE SUGGESTIONS
// -------------------------

profileRoleInput?.addEventListener(
  "input",
  () => {

    const fullText =
      profileRoleInput.value;

    const parts =
      fullText.split(/[,.•]/);

    const currentInput =
      parts[parts.length - 1]
        .trim()
        .toLowerCase();

    roleSuggestionsBox.innerHTML = "";

    if (currentInput.length < 2) {
      roleSuggestionsBox.classList.remove(
        "show"
      );
      return;
    }

    const matches =
      roleSuggestions.filter(role =>
        role.toLowerCase().includes(
          currentInput
        )
      );

    if (!matches.length) {
      roleSuggestionsBox.classList.remove(
        "show"
      );
      return;
    }

    roleSuggestionsBox.classList.add(
      "show"
    );

    matches.forEach(match => {

      const button =
        document.createElement("button");

      button.type = "button";
      button.className =
        "role-suggestion-item";

      button.textContent = match;

      button.addEventListener(
        "click",
        () => {

          parts[parts.length - 1] =
            ` ${match}`;

          profileRoleInput.value =
            parts
              .map(part => part.trim())
              .filter(Boolean)
              .join(" • ");

          roleSuggestionsBox.innerHTML = "";

          roleSuggestionsBox.classList.remove(
            "show"
          );

        }
      );

      roleSuggestionsBox.appendChild(
        button
      );

    });

  }
);
