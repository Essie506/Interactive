const editProfileBtn = document.getElementById("editProfileBtn");
const profileBioSave = document.getElementById("profileBioSave");

const navTitleInput = document.getElementById("navTitleInput");
const accountOnlineNameInput = document.getElementById("accountOnlineNameInput");

const profileNameInput = document.getElementById("profileNameInput");
const profileBioInput = document.getElementById("profileBioInput");

const profileHandleText = document.getElementById("profileHandleText");
const profileRoleText = document.getElementById("profileRoleText");
const customerLikesText = document.getElementById("customerLikesText");
const profileGymText = document.getElementById("profileGymText");

const profileHandleInput = document.getElementById("profileHandleInput");
const profileRoleInput = document.getElementById("profileRoleInput");
const customerLikesInput = document.getElementById("customerLikesInput");
const profileGymInput = document.getElementById("profileGymInput");

const handleEditorModal = document.getElementById("handleEditorModal");
const roleEditorModal = document.getElementById("roleEditorModal");
const likesEditorModal = document.getElementById("likesEditorModal");
const locationEditorModal = document.getElementById("locationEditorModal");

const saveHandleBtn = document.getElementById("saveHandleBtn");
const saveRoleBtn = document.getElementById("saveRoleBtn");
const saveLikesBtn = document.getElementById("saveLikesBtn");
const saveLocationBtn = document.getElementById("saveLocationBtn");

const closeHandleBtn = document.getElementById("closeHandleBtn");
const closeRoleBtn = document.getElementById("closeRoleBtn");
const closeLikesBtn = document.getElementById("closeLikesBtn");
const closeLocationBtn = document.getElementById("closeLocationBtn");

const roleSuggestionsBox = document.getElementById("roleSuggestionsBox");
const customerLikesSuggestionsBox = document.getElementById("customerLikesSuggestionsBox");

const profileAffiliationToggle = document.getElementById("profileAffiliationToggle");
const profileAffiliationMenu = document.getElementById("profileAffiliationMenu");
const profileAffiliationText = document.getElementById("profileAffiliationText");

const customerFitnessLevelToggle = document.getElementById("customerFitnessLevelToggle");
const customerFitnessLevelMenu = document.getElementById("customerFitnessLevelMenu");
const customerFitnessLevelText = document.getElementById("customerFitnessLevelText");
const fitnessLevelIcon = document.getElementById("customerFitnessLevelIcon");

const servicesEditBtn = document.getElementById("servicesEditBtn");
const servicesModalOverlay = document.getElementById("servicesModalOverlay");
const servicesModalClose = document.getElementById("servicesModalClose");
const servicesCancelBtn = document.getElementById("servicesCancelBtn");
const servicesSaveBtn = document.getElementById("servicesSaveBtn");
const servicePillOptions = document.querySelectorAll(".service-pill-option");

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

const customerLikeSuggestions = [
  "Running",
  "Walking",
  "Weight Training",
  "Strength Training",
  "Gym Workouts",
  "Football",
  "Gymnastics",
  "Yoga",
  "Pilates",
  "Cycling",
  "Swimming",
  "Boxing",
  "Martial Arts",
  "Dance",
  "Hiking",
  "Netball",
  "Tennis",
  "Rugby",
  "Climbing",
  "HIIT",
  "Functional Fitness"
];

const fitnessIcons = {
  "Keeping Up Appearances": "🌱",
  "Finding My Feet": "👟",
  "Steady Eddy": "🚶",
  "Joe Regular": "🏋️",
  "Fighting Fit": "💪",
  "Seasoned Pro": "🔥",
  "Fitter Than A Butcher's Dog!": "🐕"
};

function openModal(modal, input, value) {
  if (!document.body.classList.contains("editing-profile")) return;

  modal?.classList.add("show");

  if (input) {
    input.value = value.trim();
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }
}

function closeModal(modal) {
  modal?.classList.remove("show");
}

function saveField(input, textEl, storageKey, fallback, modal) {
  if (!input || !textEl) return;

  const value = input.value.trim();

  textEl.textContent = value || fallback;

  localStorage.setItem(storageKey, value);

  closeModal(modal);
}

function autoGrowProfileBioInput() {
  if (!profileBioInput) return;

  const minHeight = 55.5;
  const maxHeight = 550;

  profileBioInput.style.height = "0px";

  const nextHeight = Math.max(
    minHeight,
    Math.min(profileBioInput.scrollHeight, maxHeight)
  );

  profileBioInput.style.height = `${nextHeight}px`;

  profileBioInput.style.overflowY =
    profileBioInput.scrollHeight > maxHeight ? "auto" : "hidden";
}

function updateBioSaveButtonState() {
  const isEditing = document.body.classList.contains("editing-profile");
  profileBioSave?.classList.toggle("ready", isEditing);
}

function autoFitProfileName() {
  if (!profileNameInput) return;

  const parent =
    profileNameInput.closest(".profile-name-row") ||
    profileNameInput.parentElement;

  if (!parent) return;

  profileNameInput.style.width = "100%";
  profileNameInput.style.maxWidth = "100%";

  const maxWidth = parent.clientWidth || 260;
  let fontSize = 40;
  const minFontSize = 6;

  const measurer = document.createElement("span");

  measurer.style.position = "absolute";
  measurer.style.visibility = "hidden";
  measurer.style.whiteSpace = "nowrap";
  measurer.style.fontFamily = getComputedStyle(profileNameInput).fontFamily;
  measurer.style.fontWeight = getComputedStyle(profileNameInput).fontWeight;

  document.body.appendChild(measurer);

  while (fontSize > minFontSize) {
    measurer.style.fontSize = `${fontSize}px`;
    measurer.textContent = profileNameInput.value || "Profile";

    if (measurer.offsetWidth <= maxWidth) break;

    fontSize -= 1;
  }

  profileNameInput.style.fontSize = `${fontSize}px`;

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

  const maxWidth = parent.clientWidth;
  let fontSize = 20;
  const minFontSize = 6;

  const measurer = document.createElement("span");

  measurer.style.position = "absolute";
  measurer.style.visibility = "hidden";
  measurer.style.whiteSpace = "nowrap";
  measurer.style.fontFamily = getComputedStyle(navTitleInput).fontFamily;
  measurer.style.fontWeight = getComputedStyle(navTitleInput).fontWeight;

  document.body.appendChild(measurer);

  while (fontSize > minFontSize) {
    measurer.style.fontSize = `${fontSize}px`;
    measurer.textContent = navTitleInput.value || "Profile";

    if (measurer.offsetWidth <= maxWidth) break;

    fontSize -= 1;
  }

  navTitleInput.style.fontSize = `${fontSize}px`;

  measurer.remove();
}

function getSelectedAffiliations() {
  return Array.from(
    document.querySelectorAll("#profileAffiliationMenu input:checked")
  ).map(input => input.value);
}

function updateAffiliationText() {
  if (!profileAffiliationText) return;

  const selected = getSelectedAffiliations();

  profileAffiliationText.textContent = selected.length
    ? selected.map(item => `✓ ${item}`).join("  •  ")
    : "Select status";
}

function updateFitnessLevelText() {
  if (!customerFitnessLevelText) return;

  const selected = document.querySelector(
    '#customerFitnessLevelMenu input:checked'
  );

  customerFitnessLevelText.textContent = selected
    ? selected.value
    : "Select fitness level";

  if (fitnessLevelIcon && selected) {
    fitnessLevelIcon.textContent = fitnessIcons[selected.value] || "";
  }
}

function setupSuggestions(input, box, suggestions) {
  input?.addEventListener("input", () => {
    if (!box) return;

    const fullText = input.value;
    const parts = fullText.split(",");

    const currentInput = parts[parts.length - 1]
      .trim()
      .toLowerCase();

    box.innerHTML = "";

    if (currentInput.length < 2) {
      box.classList.remove("show");
      return;
    }

    const matches = suggestions.filter(item =>
      item.toLowerCase().includes(currentInput)
    );

    if (!matches.length) {
      box.classList.remove("show");
      return;
    }

    box.classList.add("show");

    matches.forEach(match => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "role-suggestion-item";
      button.textContent = match;

      button.addEventListener("click", () => {
        parts[parts.length - 1] = ` ${match}`;

        input.value = parts
          .map(part => part.trim())
          .filter(Boolean)
          .join(", ");

        box.innerHTML = "";
        box.classList.remove("show");

        input.focus();

        const cursorPosition = input.value.length;
        input.setSelectionRange(cursorPosition, cursorPosition);
      });

      box.appendChild(button);
    });
  });
}

function openServicesModal() {
  servicesModalOverlay?.classList.add("open");
}

function closeServicesModal() {
  servicesModalOverlay?.classList.remove("open");
}

/* =========================
   LOAD SAVED VALUES
========================= */

profileHandleInput.value =
  localStorage.getItem("profileHandleInput") ||
  profileHandleText?.textContent.trim() ||
  "@estherclarke";

profileRoleInput.value =
  localStorage.getItem("profileRoleInput") ||
  profileRoleText?.textContent.trim() ||
  "Trainer • Strength & Conditioning";

customerLikesInput.value =
  localStorage.getItem("customerLikesInput") ||
  customerLikesText?.textContent.trim() ||
  "Running • Lifting • Walking";

profileGymInput.value =
  localStorage.getItem("profileGymInput") ||
  profileGymText?.textContent.trim() ||
  "";

if (profileHandleText) {
  profileHandleText.textContent = profileHandleInput.value || "@username";
}

if (profileRoleText) {
  profileRoleText.textContent = profileRoleInput.value || "Add role...";
}

if (customerLikesText) {
  customerLikesText.textContent = customerLikesInput.value || "Running • Lifting • Walking";
}

if (profileGymText) {
  profileGymText.textContent = profileGymInput.value || "Search location...";
}

const savedBio = localStorage.getItem("profileBio");

if (savedBio && profileBioInput) {
  profileBioInput.value = savedBio;
}

const savedAffiliations = JSON.parse(
  localStorage.getItem("profileAffiliation") || "[]"
);

document
  .querySelectorAll("#profileAffiliationMenu input")
  .forEach(input => {
    input.checked = savedAffiliations.includes(input.value);
  });

updateAffiliationText();
updateFitnessLevelText();
autoGrowProfileBioInput();
updateBioSaveButtonState();
autoFitProfileName();

if (navTitleInput && profileNameInput) {
  navTitleInput.value = profileNameInput.value;
}

autoFitNavTitle();

/* =========================
   EDIT PROFILE
========================= */

editProfileBtn?.addEventListener("click", () => {
  document.body.classList.add("editing-profile");

  if (profileBioInput) {
    profileBioInput.readOnly = false;
    autoGrowProfileBioInput();
  }

  if (navTitleInput) {
    navTitleInput.readOnly = false;
  }

  updateBioSaveButtonState();
});

/* =========================
   OPEN FIELD EDITORS
========================= */

document.querySelector(".profile-handle-row")?.addEventListener("click", () => {
  openModal(handleEditorModal, profileHandleInput, profileHandleText?.textContent || "");
});

document.querySelector(".profile-role")?.addEventListener("click", () => {
  openModal(roleEditorModal, profileRoleInput, profileRoleText?.textContent || "");
});

document.querySelector(".profile-likes")?.addEventListener("click", () => {
  openModal(likesEditorModal, customerLikesInput, customerLikesText?.textContent || "");
});

document.querySelector(".profile-gym")?.addEventListener("click", () => {
  openModal(locationEditorModal, profileGymInput, profileGymText?.textContent || "");
});

/* =========================
   CLOSE FIELD EDITORS
========================= */

closeHandleBtn?.addEventListener("click", () => closeModal(handleEditorModal));
closeRoleBtn?.addEventListener("click", () => closeModal(roleEditorModal));
closeLikesBtn?.addEventListener("click", () => closeModal(likesEditorModal));
closeLocationBtn?.addEventListener("click", () => closeModal(locationEditorModal));


[
  handleEditorModal,
  roleEditorModal,
  likesEditorModal,
  locationEditorModal
].forEach(modal => {
  modal?.addEventListener("click", event => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });
});

/* =========================
   SAVE FIELD EDITORS
========================= */

saveHandleBtn?.addEventListener("click", () => {
  saveField(
    profileHandleInput,
    profileHandleText,
    "profileHandleInput",
    "@username",
    handleEditorModal
  );
});

saveRoleBtn?.addEventListener("click", () => {
  saveField(
    profileRoleInput,
    profileRoleText,
    "profileRoleInput",
    "Add role...",
    roleEditorModal
  );
});

saveLikesBtn?.addEventListener("click", () => {
  saveField(
    customerLikesInput,
    customerLikesText,
    "customerLikesInput",
    "Running • Lifting • Walking",
    likesEditorModal
  );
});

saveLocationBtn?.addEventListener("click", () => {
  saveField(
    profileGymInput,
    profileGymText,
    "profileGymInput",
    "Search location...",
    locationEditorModal
  );
});

/* =========================
   BIO
========================= */

profileBioInput?.addEventListener("input", () => {
  autoGrowProfileBioInput();
  updateBioSaveButtonState();
});

profileBioSave?.addEventListener("click", () => {
  const newBio = profileBioInput?.value.trim() || "";

  localStorage.setItem("profileBio", newBio);

  if (profileBioInput) {
    profileBioInput.value = newBio;
    profileBioInput.readOnly = true;
    profileBioInput.blur();
  }

  localStorage.setItem(
    "profileAffiliation",
    JSON.stringify(getSelectedAffiliations())
  );

  if (profileAffiliationMenu) {
    profileAffiliationMenu.hidden = true;
  }

  const onlineName = navTitleInput?.value.trim() || "Profile";

  if (navTitleInput) {
    navTitleInput.value = onlineName;
    navTitleInput.readOnly = true;
  }

  if (profileNameInput) {
    profileNameInput.value = onlineName;
  }

  if (accountOnlineNameInput) {
    accountOnlineNameInput.value = onlineName;
  }

  localStorage.setItem("accountOnlineName", onlineName);

  document.body.classList.remove("editing-profile");

  autoFitProfileName();
  autoFitNavTitle();
  updateBioSaveButtonState();
});

/* =========================
   NAME / NAV TITLE
========================= */

profileNameInput?.addEventListener("input", () => {
  autoFitProfileName();

  if (navTitleInput) {
    navTitleInput.value = profileNameInput.value;
    autoFitNavTitle();
  }
});

navTitleInput?.addEventListener("input", () => {
  if (profileNameInput) {
    profileNameInput.value = navTitleInput.value;
  }

  if (accountOnlineNameInput) {
    accountOnlineNameInput.value = navTitleInput.value;
  }

  autoFitProfileName();
  autoFitNavTitle();
});

/* =========================
   AFFILIATION / FITNESS LEVEL
========================= */

profileAffiliationToggle?.addEventListener("click", event => {
  if (!document.body.classList.contains("editing-profile")) return;

  event.stopPropagation();

  if (profileAffiliationMenu) {
    profileAffiliationMenu.hidden = !profileAffiliationMenu.hidden;
  }
});

profileAffiliationMenu?.addEventListener("click", event => {
  event.stopPropagation();
});

document
  .querySelectorAll("#profileAffiliationMenu input")
  .forEach(input => {
    input.addEventListener("change", updateAffiliationText);
  });

customerFitnessLevelToggle?.addEventListener("click", event => {
  if (!document.body.classList.contains("editing-profile")) return;

  event.stopPropagation();

  if (customerFitnessLevelMenu) {
    customerFitnessLevelMenu.hidden = !customerFitnessLevelMenu.hidden;
  }
});

customerFitnessLevelMenu?.addEventListener("click", event => {
  event.stopPropagation();
});

document
  .querySelectorAll('#customerFitnessLevelMenu input[name="fitnessLevel"]')
  .forEach(input => {
    input.addEventListener("change", updateFitnessLevelText);
  });

document.addEventListener("click", () => {
  if (profileAffiliationMenu) {
    profileAffiliationMenu.hidden = true;
  }

  if (customerFitnessLevelMenu) {
    customerFitnessLevelMenu.hidden = true;
  }
});

/* =========================
   SUGGESTIONS
========================= */

setupSuggestions(
  profileRoleInput,
  roleSuggestionsBox,
  roleSuggestions
);

setupSuggestions(
  customerLikesInput,
  customerLikesSuggestionsBox,
  customerLikeSuggestions
);

/* =========================
   SERVICES MODAL
========================= */

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

/* =========================
   WINDOW RESIZE
========================= */

window.addEventListener("resize", () => {
  requestAnimationFrame(() => {
    autoGrowProfileBioInput();
    autoFitProfileName();
    autoFitNavTitle();
  });
});
