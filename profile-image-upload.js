// =========================
// PROFILE IMAGE UPLOAD
// =========================

const profilePhotoInput = document.getElementById("profilePhotoInput");

const uploadButtons = document.querySelectorAll(".upload-photo-btn");

const avatarTargets = document.querySelectorAll(".profile-avatar");

const coverInput = document.getElementById("profileCoverInput");

const coverButtons = document.querySelectorAll(".upload-cover-btn");

const coverImage = document.querySelector(".profile-hero-media img");

const profileHeroMedia = document.getElementById("profileHeroMedia");
const profileCoverImage = document.getElementById("profileCoverImage");
const coverPositionBtn = document.getElementById("coverPositionBtn");

let currentObjectURL = null;
let isRepositioning = false;
let isDragging = false;
let startY = 0;
let currentPosition = 50;


// =========================
// OPEN FILE PICKER
// =========================

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


/* =========================
   APPLY POSITION
========================= */

function applyCoverPosition(position) {
  profileCoverImage.style.objectPosition = `center ${position}%`;
}



// =========================
// HANDLE IMAGE SELECTION
// =========================

profilePhotoInput.addEventListener("change", event => {
  const file = event.target.files?.[0];

  if (!file) return;


/* =========================
   LOAD SAVED POSITION
========================= */

const savedPosition = localStorage.getItem("profileCoverPosition");

if (savedPosition) {
  currentPosition = parseFloat(savedPosition);
  applyCoverPosition(currentPosition);
}


/* =========================
   TOGGLE REPOSITION MODE
========================= */

if (coverPositionBtn) {
  coverPositionBtn.addEventListener("click", () => {
    isRepositioning = !isRepositioning;

    profileHeroMedia.classList.toggle(
      "repositioning",
      isRepositioning
    );
  });
}


/* =========================
   START DRAG
========================= */

profileHeroMedia.addEventListener("pointerdown", (event) => {
  if (!isRepositioning) return;

  isDragging = true;
  startY = event.clientY;

  profileHeroMedia.setPointerCapture(event.pointerId);
});


/* =========================
   DRAG MOVE
========================= */

profileHeroMedia.addEventListener("pointermove", (event) => {
  if (!isDragging || !isRepositioning) return;

  const delta = event.clientY - startY;

  currentPosition += delta * 0.08;

  currentPosition = Math.max(0, Math.min(100, currentPosition));

  applyCoverPosition(currentPosition);

  startY = event.clientY;
});


/* =========================
   END DRAG
========================= */

profileHeroMedia.addEventListener("pointerup", () => {
  if (!isDragging) return;

  isDragging = false;

  localStorage.setItem(
    "profileCoverPosition",
    currentPosition
  );
});




  // =========================
  // VALIDATION
  // =========================

  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file.");
    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    alert("Image must be under 5MB.");
    return;
  }

  // =========================
  // CLEAN OLD OBJECT URL
  // =========================

  if (currentObjectURL) {
    URL.revokeObjectURL(currentObjectURL);
  }

  // =========================
  // CREATE TEMP IMAGE URL
  // =========================

  const imageURL = URL.createObjectURL(file);

  currentObjectURL = imageURL;

  // =========================
  // UPDATE ALL AVATARS
  // =========================

  avatarTargets.forEach(avatar => {
    avatar.innerHTML = "";

    const img = document.createElement("img");

    img.src = imageURL;
    img.alt = "Profile picture";

    img.classList.add("profile-avatar-image");

    avatar.appendChild(img);
  });

  // =========================
  // TEMP PERSISTENCE
  // =========================

  const reader = new FileReader();

  reader.onload = () => {
    localStorage.setItem("interactiveProfileAvatar", reader.result);
  };

  reader.readAsDataURL(file);
});


// =========================
// RESTORE SAVED IMAGE
// =========================

window.addEventListener("DOMContentLoaded", () => {
  const savedImage = localStorage.getItem("interactiveProfileAvatar");

  if (!savedImage) return;

  avatarTargets.forEach(avatar => {
    avatar.innerHTML = "";

    const img = document.createElement("img");

    img.src = savedImage;
    img.alt = "Profile picture";

    img.classList.add("profile-avatar-image");

    avatar.appendChild(img);
  });
});

// =========================
// HANDLE COVER SELECTION
// =========================

coverInput.addEventListener("change", event => {
  const file = event.target.files?.[0];

  if (!file) return;

  const imageURL = URL.createObjectURL(file);

  coverImage.src = imageURL;

  // save cover temporarily
  const reader = new FileReader();

  reader.onload = () => {
    localStorage.setItem(
      "interactiveProfileCover",
      reader.result
    );
  };

  reader.readAsDataURL(file);
});

// =========================
// RESTORE SAVED COVER
// =========================

window.addEventListener("DOMContentLoaded", () => {
  const savedCover =
    localStorage.getItem("interactiveProfileCover");

  if (!savedCover) return;

  coverImage.src = savedCover;
});
