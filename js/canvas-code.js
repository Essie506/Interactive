
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

const activePointers = new Map();

// =========================
// AVATAR EDITOR
// =========================

const avatarEditorOverlay =
  document.querySelector(
    ".avatar-editor-overlay"
  );

const avatarEditorImage =
  document.getElementById(
    "avatarEditorImage"
  );

const avatarSaveBtn =
  document.querySelector(
    ".avatar-editor-btn-save"
  );

const avatarCancelBtn =
  document.querySelector(
    ".avatar-editor-btn-cancel"
  );


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

let lastPinchDistance = 0;

// =========================
// AVATAR EDITOR STATE
// =========================

let avatarX = 0;
let avatarY = 0;

let avatarZoom = 1;

let isAvatarDragging = false;

let avatarStartX = 0;
let avatarStartY = 0;


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

   isRepositioning = false;

  hasPassedDragThreshold = false;

    activePointers.clear();

  profileHeroMedia.classList.remove(
    "repositioning"
  );

  coverPositionDone.classList.remove(
    "show"
  );

}

function applyAvatarTransform() {

  avatarEditorImage.style.transform =
    `
    translate(
      calc(-50% + ${avatarX}px),
      calc(-50% + ${avatarY}px)
    )
    scale(${avatarZoom})
    `;

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

     if (
      event.target.closest(
        ".hero-controls"
      )
    ) return;

    if (!isRepositioning) return;

    isDragging = true;

    hasPassedDragThreshold = false;

    startX = event.clientX;
startY = event.clientY;

    profileHeroMedia.setPointerCapture(
      event.pointerId
    );

    activePointers.set(event.pointerId, {
  x: event.clientX,
  y: event.clientY
      
});

  }
);


// -------------------------
// DRAG MOVE
// -------------------------


profileHeroMedia.addEventListener(
  "pointermove",
  event => {

    if (!isRepositioning) return;

    activePointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

if (activePointers.size === 2) {

  const pointers =
    Array.from(activePointers.values());

  const dx =
    pointers[1].x - pointers[0].x;

  const dy =
    pointers[1].y - pointers[0].y;

  const distance =
    Math.hypot(dx, dy);

  if (lastPinchDistance > 0) {

    const delta =
      distance - lastPinchDistance;

    currentZoom += delta * 0.002;

    currentZoom = Math.max(
      1,
      Math.min(1.5, currentZoom)
    );

    applyCoverTransform();

  }

  lastPinchDistance = distance;

} else if (isDragging) {


      const deltaX =
        event.clientX - startX;

      const deltaY =
        event.clientY - startY;

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

  }
);
// -------------------------
// DRAG END
// -------------------------

profileHeroMedia.addEventListener(
  "pointerup",
  event => {

    activePointers.delete(
      event.pointerId
    );

    if (activePointers.size < 2) {
  lastPinchDistance = 0;
}

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

    const file =
      event.target.files?.[0];

    if (!file) return;


    // VALIDATION

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please upload an image file."
      );

      return;

    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      alert(
        "Image must be under 5MB."
      );

      return;

    }


    // CLEAN OLD OBJECT URL

    if (currentObjectURL) {

      URL.revokeObjectURL(
        currentObjectURL
      );

    }


    // CREATE TEMP IMAGE URL

    const imageURL =
      URL.createObjectURL(file);

    currentObjectURL =
      imageURL;


    // OPEN EDITOR

    avatarEditorImage.src =
      imageURL;

    avatarX = 0;
    avatarY = 0;

    avatarZoom = 0.5;

    applyAvatarTransform();

    avatarEditorOverlay.classList.add(
      "open"
    );

    profilePhotoInput.value = "";

  }
);


// -------------------------
// COVER IMAGE UPLOAD
// -------------------------

coverInput.addEventListener(
  "change",
  event => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    resetInteractionState();

    const reader =
      new FileReader();

    reader.addEventListener(
      "load",
      () => {

        const imageData =
          reader.result;

        currentY = 50;

        coverImage.onload = () => {

          applyCoverTransform();

          coverPositionDone.classList.add(
            "show"
          );

        };


        // TEMP ONLY
        // Firebase later

        // localStorage.setItem(
        //   "interactiveProfileCover",
        //   imageData
        // );


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


        coverImage.src =
          imageData;


        requestAnimationFrame(() => {

          coverInput.value = "";

        });

      }
    );

    reader.readAsDataURL(file);

  }
);


// -------------------------
// ZOOM
// -------------------------

profileHeroMedia.addEventListener(
  "wheel",
  event => {

    if (!isRepositioning)
      return;

    event.preventDefault();

    currentZoom +=
      event.deltaY * -0.001;

    currentZoom = Math.max(
      1,
      Math.min(1.5, currentZoom)
    );

    applyCoverTransform();

  },
  { passive: false }
);


// =========================
// AVATAR DRAG
// =========================

avatarEditorImage.addEventListener(
  "pointerdown",
  event => {

    isAvatarDragging = true;

    avatarStartX =
      event.clientX;

    avatarStartY =
      event.clientY;

    avatarEditorImage.setPointerCapture(
      event.pointerId
    );

  }
);


avatarEditorImage.addEventListener(
  "pointermove",
  event => {

    if (!isAvatarDragging)
      return;

    const deltaX =
      event.clientX -
      avatarStartX;

    const deltaY =
      event.clientY -
      avatarStartY;

    avatarX += deltaX;
    avatarY += deltaY;

    applyAvatarTransform();

    avatarStartX =
      event.clientX;

    avatarStartY =
      event.clientY;

  }
);


avatarEditorImage.addEventListener(
  "pointerup",
  () => {

    isAvatarDragging = false;

  }
);


// =========================
// AVATAR ZOOM
// =========================

avatarEditorImage.addEventListener(
  "wheel",
  event => {

    event.preventDefault();

    avatarZoom +=
      event.deltaY * -0.001;

    avatarZoom = Math.max(
      0.25,
      Math.min(3, avatarZoom)
    );

    applyAvatarTransform();

  },
  { passive: false }
);


// =========================
// SAVE AVATAR
// =========================

if (avatarSaveBtn) {

  avatarSaveBtn.addEventListener(
    "click",
    () => {

      updateAvatar(
        avatarEditorImage.src
      );

      localStorage.setItem(
        "interactiveProfileAvatar",
        avatarEditorImage.src
      );

      avatarEditorOverlay.classList.remove(
        "open"
      );

    }
  );

}


// =========================
// CANCEL AVATAR
// =========================

if (avatarCancelBtn) {

  avatarCancelBtn.addEventListener(
    "click",
    () => {

      avatarEditorOverlay.classList.remove(
        "open"
      );

    }
  );

}
  
