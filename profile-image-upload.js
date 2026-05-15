// =========================
// DOM ELEMENTS
// =========================

const profilePhotoInput =
  document.getElementById("profilePhotoInput");

const uploadButtons =
  document.querySelectorAll(".upload-photo-btn");

const avatarTargets =
  document.querySelectorAll(".profile-avatar");

const coverInput =
  document.getElementById("profileCoverInput");

const coverButtons =
  document.querySelectorAll(".upload-cover-btn");

const coverImage =
  document.querySelector(".profile-hero-media img");

const profileHeroMedia =
  document.getElementById("profileHeroMedia");

const profileCoverImage =
  document.getElementById("profileCoverImage");

const coverPositionBtn =
  document.getElementById("coverPositionBtn");

const coverPositionSaved =
  document.querySelector(".cover-position-saved");


// =========================
// CURRENT STATE
// =========================

let currentObjectURL = null;

let isRepositioning = false;

let isDragging = false;

let startY = 0;

let currentPosition = 50;

let hasPassedDragThreshold = false;


// =========================
// DEFINE HELPERS
// =========================

function applyCoverPosition(position) {
  profileCoverImage.style.objectPosition =
    `center ${position}%`;
}


function updateAvatar(src) {
  avatarTargets.forEach(avatar => {
    avatar.innerHTML = "";

    const img = document.createElement("img");

    img.src = src;
    img.alt = "Profile picture";

    img.classList.add("profile-avatar-image");

    avatar.appendChild(img);
  });
}


// =========================
// RUN ON STARTUP
// =========================

// Restore avatar

const savedAvatar =
  localStorage.getItem("interactiveProfileAvatar");

if (savedAvatar) {
  updateAvatar(savedAvatar);
}


// Restore cover

const savedCover =
  localStorage.getItem("interactiveProfileCover");

if (savedCover) {
  coverImage.src = savedCover;
}


// Restore cover position

const savedPosition =
  localStorage.getItem("profileCoverPosition");

if (savedPosition) {
  currentPosition = parseFloat(savedPosition);

  applyCoverPosition(currentPosition);
}


// =========================
// EVENT LISTENERS
// =========================


// -------------------------
// OPEN FILE PICKERS
// -------------------------

uploadButtons.forEach(button => {
  button.addEventListener("click", () => {
    profilePhotoInput.click();
  });
});


coverButtons.forEach(button => {
  button.addEventListener("click", () => {
    coverInput.click();
  });
});


// -------------------------
// TOGGLE REPOSITION MODE
// -------------------------

if (coverPositionBtn) {
  coverPositionBtn.addEventListener("click", () => {

    isRepositioning = !isRepositioning;

    profileHeroMedia.classList.toggle(
      "repositioning",
      isRepositioning
    );

  });
}


// -------------------------
// DRAG START
// -------------------------

profileHeroMedia.addEventListener(
  "pointerdown",
  event => {

    if (!isRepositioning) return;

    isDragging = true;

    hasPassedDragThreshold = false;

    startY = event.clientY;

    profileHeroMedia.setPointerCapture(
      event.pointerId
    );

  }
);


// -------------------------
// DRAG MOVE
// -------------------------

profileHeroMedia.addEventListener(
  "pointermove",
  event => {

    if (!isDragging || !isRepositioning) return;

    const delta = event.clientY - startY;

    if (!hasPassedDragThreshold) {

      if (Math.abs(delta) < 8) return;

      hasPassedDragThreshold = true;

    }

    currentPosition -= delta * 0.18;

    currentPosition = Math.max(
      0,
      Math.min(100, currentPosition)
    );

    applyCoverPosition(currentPosition);

    startY = event.clientY;

  }
);
// -------------------------
// DRAG END
// -------------------------

profileHeroMedia.addEventListener(
  "pointerup",
  () => {

    if (!isDragging) return;

    isDragging = false;

    localStorage.setItem(
      "profileCoverPosition",
      currentPosition
    );

    isRepositioning = false;

    profileHeroMedia.classList.remove(
      "repositioning"
    );

    coverPositionSaved.classList.add("show");

    setTimeout(() => {

      coverPositionSaved.classList.remove("show");

    }, 900);

  }
);

// -------------------------
// PROFILE IMAGE UPLOAD
// -------------------------

profilePhotoInput.addEventListener(
  "change",
  event => {

    const file = event.target.files?.[0];

    if (!file) return;


    // VALIDATION

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be under 5MB.");
      return;
    }


    // CLEAN OLD OBJECT URL

    if (currentObjectURL) {
      URL.revokeObjectURL(currentObjectURL);
    }


    // CREATE TEMP IMAGE URL

    const imageURL =
      URL.createObjectURL(file);

    currentObjectURL = imageURL;


    // UPDATE UI

    updateAvatar(imageURL);


    // SAVE

    const reader = new FileReader();

    reader.onload = () => {
      localStorage.setItem(
        "interactiveProfileAvatar",
        reader.result
      );
    };

    reader.readAsDataURL(file);

  }
);


// -------------------------
// COVER IMAGE UPLOAD
// -------------------------

coverInput.addEventListener(
  "change",
  event => {

    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {

      const imageData = reader.result;

      currentPosition = 50;

     coverImage.removeAttribute("src");

     const tempImage = new Image();

tempImage.onload = () => {

  coverImage.src = imageData;

      applyCoverPosition(currentPosition);

};

      tempImage.src = imageData;

      localStorage.setItem(
        "interactiveProfileCover",
        imageData
      );

      localStorage.setItem(
        "profileCoverPosition",
        currentPosition
      );

      isRepositioning = true;

      profileHeroMedia.classList.add(
        "repositioning"
      );

    });

    reader.readAsDataURL(file);

  }
);
