// =========================
// PROFILE TYPE
// =========================

const isBusinessProfile =
  document.body.dataset.profileType === "business-profile";

const coverStorageKey =
  isBusinessProfile
    ? "interactiveBusinessCover"
    : "interactiveProfileCover";

const coverPositionStorageKey =
  isBusinessProfile
    ? "businessCoverPosition"
    : "profileCoverPosition";

const avatarStorageKey =
  isBusinessProfile
    ? "interactiveBusinessAvatar"
    : "interactiveProfileAvatar";


// =========================
// DOM ELEMENTS
// =========================

const profilePhotoInput =
  document.getElementById(
    isBusinessProfile
      ? "businessProfilePhotoInput"
      : "profilePhotoInput"
  );

const uploadButtons =
  document.querySelectorAll(
    isBusinessProfile
      ? ".business-upload-photo-btn"
      : ".upload-photo-btn"
  );

const avatarTargets =
  document.querySelectorAll(
    isBusinessProfile
      ? ".business-profile-avatar"
      : ".profile-avatar"
  );

const coverInput =
  document.getElementById(
    isBusinessProfile
      ? "businessCoverInput"
      : "profileCoverInput"
  );

const profileHeroMedia =
  document.getElementById(
    isBusinessProfile
      ? "businessHeroMedia"
      : "profileHeroMedia"
  );

const profileCoverImage =
  document.getElementById(
    isBusinessProfile
      ? "businessCoverImage"
      : "profileCoverImage"
  );

const coverImage = profileCoverImage;

const coverPositionBtn =
  document.getElementById(
    isBusinessProfile
      ? "businessCoverPositionBtn"
      : "coverPositionBtn"
  );

const coverPositionButtons =
  document.querySelectorAll(
    isBusinessProfile
      ? ".business-cover-position-done"
      : ".cover-position-done:not(.profile-editor-save)"
  );

const chooseHeroImageBtn =
  document.getElementById(
    isBusinessProfile
      ? "businessChooseHeroImageBtn"
      : "chooseHeroImageBtn"
  );

const heroPresetBtn =
  document.getElementById(
    isBusinessProfile
      ? "businessHeroPresetBtn"
      : "heroPresetBtn"
  );

const heroPresetMenu =
  document.getElementById(
    isBusinessProfile
      ? "businessHeroPresetMenu"
      : "heroPresetMenu"
  );

const heroPresetOptions =
  document.querySelectorAll(
    isBusinessProfile
      ? ".business-hero-preset-option"
      : ".hero-preset-option"
  );

const activePointers = new Map();


// =========================
// AVATAR EDITOR
// =========================

const avatarEditorOverlay =
  document.querySelector(".avatar-editor-overlay");

const avatarEditorImage =
  document.getElementById("avatarEditorImage");

const avatarSaveBtn =
  document.getElementById("avatarEditorSave");

const avatarCancelBtn =
  document.getElementById("avatarEditorCancel");


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
let avatarZoom = 0.25;

let isAvatarDragging = false;
let avatarStartX = 0;
let avatarStartY = 0;


// =========================
// HELPERS
// =========================

function applyCoverTransform() {
  if (!profileCoverImage) return;

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
  lastPinchDistance = 0;

  activePointers.clear();

  profileHeroMedia?.classList.remove("repositioning");

  coverPositionButtons.forEach(button => {
    button.classList.remove("show");
  });
}


function applyAvatarTransform() {
  if (!avatarEditorImage) return;

  avatarEditorImage.style.transform =
    `
    translate(
      calc(-50% + ${avatarX}px),
      calc(-50% + ${avatarY}px)
    )
    scale(${avatarZoom})
    `;
}


function closeHeroPresetMenu() {
  heroPresetMenu?.classList.remove("open");
  heroPresetBtn?.classList.remove("open");
}


// =========================
// RUN ON STARTUP
// =========================

// Restore avatar

const savedAvatar =
  localStorage.getItem(avatarStorageKey);

if (savedAvatar) {
  updateAvatar(savedAvatar);
}


// Restore cover

const savedCover =
  localStorage.getItem(coverStorageKey);

if (savedCover && coverImage) {
  coverImage.src = savedCover;

  document.body.classList.add("has-cover");
} else {
  document.body.classList.remove("has-cover");

  if (coverImage) {
    coverImage.src = "../covers/logo.png";
  }

  if (profileCoverImage) {
    profileCoverImage.style.objectFit = "cover";
  }

  currentY = 50;
}


// Restore cover position

const savedPosition =
  localStorage.getItem(coverPositionStorageKey);

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
    profilePhotoInput?.click();
  });
});


// -------------------------
// CHOOSE HERO IMAGE
// -------------------------

chooseHeroImageBtn?.addEventListener(
  "click",
  () => {
    coverInput?.click();
    closeHeroPresetMenu();
  }
);


// -------------------------
// TOGGLE REPOSITION MODE
// -------------------------

coverPositionBtn?.addEventListener("click", () => {
  isRepositioning = !isRepositioning;

  profileHeroMedia?.classList.toggle(
    "repositioning",
    isRepositioning
  );
});


// -------------------------
// DRAG START
// -------------------------

profileHeroMedia?.addEventListener(
  "pointerdown",
  event => {
    if (event.target.closest(".hero-controls")) return;
    if (!isRepositioning) return;

    isDragging = true;
    hasPassedDragThreshold = false;

    startX = event.clientX;
    startY = event.clientY;

    profileHeroMedia.setPointerCapture(event.pointerId);

    activePointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });
  }
);


// -------------------------
// DRAG MOVE
// -------------------------

profileHeroMedia?.addEventListener(
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

profileHeroMedia?.addEventListener(
  "pointerup",
  event => {
    activePointers.delete(event.pointerId);

    if (activePointers.size < 2) {
      lastPinchDistance = 0;
    }

    if (!isDragging) return;

    isDragging = false;
  }
);


// -------------------------
// SAVE COVER POSITION
// -------------------------

coverPositionButtons.forEach(button => {
  button.addEventListener("click", () => {
    localStorage.setItem(
      coverPositionStorageKey,
      currentY
    );

    closeHeroPresetMenu();
    resetInteractionState();
  });
});


// -------------------------
// PROFILE IMAGE UPLOAD
// -------------------------

profilePhotoInput?.addEventListener(
  "change",
  event => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be under 5MB.");
      return;
    }

    if (currentObjectURL) {
      URL.revokeObjectURL(currentObjectURL);
    }

    const imageURL =
      URL.createObjectURL(file);

    currentObjectURL = imageURL;

    if (!avatarEditorImage || !avatarEditorOverlay) return;

    avatarEditorImage.src = imageURL;

    avatarX = 0;
    avatarY = 0;
    avatarZoom = 0.5;

    applyAvatarTransform();

    avatarEditorOverlay.classList.add("open");

    profilePhotoInput.value = "";
  }
);


// -------------------------
// COVER IMAGE UPLOAD
// -------------------------

coverInput?.addEventListener(
  "change",
  event => {
    const file =
      event.target.files?.[0];

    if (!file || !profileCoverImage) return;

    resetInteractionState();

    const reader =
      new FileReader();

    reader.addEventListener("load", () => {
      const imageData =
        reader.result;

      currentX = 50;
      currentY = 50;
      currentZoom = 1.05;

      profileCoverImage.onload = () => {
        document.body.classList.add("has-cover");

        profileCoverImage.style.objectFit = "cover";

        applyCoverTransform();

        localStorage.setItem(
          coverStorageKey,
          imageData
        );

        localStorage.setItem(
          coverPositionStorageKey,
          currentY
        );

        isRepositioning = true;

        profileHeroMedia?.classList.add("repositioning");

        coverPositionButtons.forEach(button => {
          button.classList.add("show");
        });
      };

      profileCoverImage.src = imageData;

      requestAnimationFrame(() => {
        coverInput.value = "";
      });
    });

    reader.readAsDataURL(file);
  }
);


// -------------------------
// ZOOM
// -------------------------

profileHeroMedia?.addEventListener(
  "wheel",
  event => {
    if (!isRepositioning) return;

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

avatarEditorImage?.addEventListener(
  "pointerdown",
  event => {
    isAvatarDragging = true;

    avatarStartX = event.clientX;
    avatarStartY = event.clientY;

    avatarEditorImage.setPointerCapture(
      event.pointerId
    );
  }
);

avatarEditorImage?.addEventListener(
  "pointermove",
  event => {
    if (!isAvatarDragging) return;

    const deltaX =
      event.clientX - avatarStartX;

    const deltaY =
      event.clientY - avatarStartY;

    avatarX += deltaX;
    avatarY += deltaY;

    applyAvatarTransform();

    avatarStartX = event.clientX;
    avatarStartY = event.clientY;
  }
);

avatarEditorImage?.addEventListener(
  "pointerup",
  () => {
    isAvatarDragging = false;
  }
);


// =========================
// AVATAR ZOOM
// =========================

avatarEditorImage?.addEventListener(
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

avatarSaveBtn?.addEventListener(
  "click",
  () => {
    if (!avatarEditorImage || !avatarEditorOverlay) return;

    updateAvatar(avatarEditorImage.src);

    localStorage.setItem(
      avatarStorageKey,
      avatarEditorImage.src
    );

    avatarEditorOverlay.classList.remove("open");
  }
);


// =========================
// CANCEL AVATAR
// =========================

avatarCancelBtn?.addEventListener(
  "click",
  () => {
    avatarEditorOverlay?.classList.remove("open");
  }
);


// =========================
// HERO PRESET MENU
// =========================

heroPresetBtn?.addEventListener(
  "click",
  event => {
    event.stopPropagation();

    heroPresetBtn.classList.toggle("open");
    heroPresetMenu?.classList.toggle("open");
  }
);

heroPresetOptions.forEach(option => {
  option.addEventListener("click", () => {
    const coverSrc =
      option.dataset.cover;

    if (!coverSrc || !profileCoverImage) return;

    const fit =
      option.dataset.fit || "fill";

    if (coverSrc === "#" || fit === "none") {
      localStorage.removeItem(coverStorageKey);
      localStorage.removeItem(coverPositionStorageKey);

      document.body.classList.remove("has-cover");

      profileCoverImage.src = "#";

      currentX = 50;
      currentY = 50;
      currentZoom = 1.05;

      coverPositionButtons.forEach(button => {
        button.classList.remove("show");
      });

      closeHeroPresetMenu();

      return;
    }

    document.body.classList.add("has-cover");

    profileCoverImage.src = coverSrc;
    profileCoverImage.style.objectFit = fit;

    localStorage.setItem(
      coverStorageKey,
      coverSrc
    );

    currentX = 50;
    currentY = 50;
    currentZoom = 1.05;

    applyCoverTransform();

    coverPositionButtons.forEach(button => {
      button.classList.remove("show");
    });

    closeHeroPresetMenu();
  });
});

document.addEventListener(
  "click",
  event => {
    if (
      heroPresetMenu?.contains(event.target) ||
      heroPresetBtn?.contains(event.target)
    ) return;

    closeHeroPresetMenu();
  }
);
