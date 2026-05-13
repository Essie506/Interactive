// =========================
// PROFILE IMAGE UPLOAD
// =========================

const profilePhotoInput = document.getElementById("profilePhotoInput");

const uploadButtons = document.querySelectorAll(".upload-photo-btn");

const avatarTargets = document.querySelectorAll(".profile-avatar");

const coverInput = document.getElementById("profileCoverInput");

const coverButtons = document.querySelectorAll(".upload-cover-btn");

const coverImage = document.querySelector(".profile-hero-media img");

let currentObjectURL = null;


// =========================
// OPEN FILE PICKER
// =========================

uploadButtons.forEach(button => {
  button.addEventListener("click", () => {
    profilePhotoInput.click();
  });
});


// =========================
// HANDLE IMAGE SELECTION
// =========================

profilePhotoInput.addEventListener("change", event => {
  const file = event.target.files?.[0];

  if (!file) return;



coverInput.addEventListener("change", event => {
  const file = event.target.files?.[0];

  if (!file) return;

  const imageURL = URL.createObjectURL(file);

  coverImage.src = imageURL;
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
});
