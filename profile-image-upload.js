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

const coverPositionDone =
  document.querySelector(".cover-position-done");


// =========================
// CURRENT STATE
// =========================

let currentObjectURL = null;

let isRepositioning = false;

let isDragging = false;

let startX = 0;
let startY = 0;

let currentX = 50;
let currentY = 50;

let currentZoom = 1.05;

let hasPassedDragThreshold = false;

let interactionMode = "idle";


// =========================
// DEFINE HELPERS
// =========================


function applyCoverTransform() {

  profileCoverImage.style.objectPosition =
    `${currentX}% ${currentY}%`;

  profileCoverImage.style.transform =
    `scale(${currentZoom})`;

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


function resetInteractionState() {

  isDragging = false;

  hasPassedDragThreshold = false;

  profileHeroMedia.classList.remove(
    "repositioning"
  );

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
  currentY = parseFloat(savedPosition);

  applyCoverTransform();
}


// =========================
// EVENT LISTENERS
// =========================

coverInput.addEventListener(
  "click",
  () => {

    isRepositioning = false;

    profileHeroMedia.classList.remove(
      "repositioning"
    );

  }
);

// -------------------------
// OPEN FILE PICKERS
// -------------------------

uploadButtons.forEach(button => {
  button.addEventListener("click", () => {
    profilePhotoInput.click();
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

    startX = event.clientX;
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

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    currentX -= deltaX * 0.08;
    currentY -= deltaY * 0.18;

    currentX = Math.max(
      0,
      Math.min(100, currentX)
    );

    currentY = Math.max(
      0,
      Math.min(100, currentY)
    );

    applyCoverTransform();

    startX = event.clientX;
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

  }
);

coverPositionDone.addEventListener(
  "click",
  () => {

    localStorage.setItem(
      "profileCoverPosition",
      currentY
    );

  resetInteractionState();

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

    resetInteractionState();

    const reader = new FileReader();
  

    reader.addEventListener("load", () => {

      const imageData = reader.result;

      currentY = 50;

      coverImage.src = imageData;

applyCoverTransform();
 
      localStorage.setItem(
        "interactiveProfileCover",
        imageData
      );

      localStorage.setItem(
        "profileCoverPosition",
        currentY
      );

   setTimeout(() => {

  isRepositioning = true;

  profileHeroMedia.classList.add(
    "repositioning"
  );

}, 50);

     coverPositionDone.classList.add("show");

       coverInput.value = "";


    });

        reader.readAsDataURL(file);

  }
);


// -------------------------
// ZOOM
// -------------------------

profileHeroMedia.addEventListener(
  "wheel",
  event => {

    if (!isRepositioning) return;

    event.preventDefault();

    currentZoom += event.deltaY * -0.001;

    currentZoom = Math.max(
      1,
      Math.min(1.5, currentZoom)
    );

    applyCoverTransform();

  },
  { passive: false }
);



