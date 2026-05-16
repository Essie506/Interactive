// =========================
// AVATAR EDITOR STATE
// =========================

let avatarX = 0;
let avatarY = 0;

let avatarZoom = 1;

let isAvatarDragging = false;

let avatarStartX = 0;
let avatarStartY = 0;

const avatarPointers = new Map();

let lastAvatarPinchDistance = 0;


// =========================
// AVATAR ELEMENTS
// =========================

const avatarEditor =
  document.getElementById("avatarEditor");

const avatarImage =
  document.getElementById("avatarImage");


// =========================
// APPLY AVATAR TRANSFORM
// =========================

function applyAvatarTransform() {

  avatarImage.style.transform =
    `translate(${avatarX}px, ${avatarY}px)
     scale(${avatarZoom})`;

}


// =========================
// AVATAR DRAG START
// =========================

avatarEditor.addEventListener(
  "pointerdown",
  event => {

    isAvatarDragging = true;

    avatarStartX = event.clientX;
    avatarStartY = event.clientY;

    avatarPointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

  }
);


// =========================
// AVATAR MOVE
// =========================

avatarEditor.addEventListener(
  "pointermove",
  event => {

    avatarPointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    // -------------------------
    // PINCH ZOOM
    // -------------------------

    if (avatarPointers.size === 2) {

      const pointers =
        Array.from(avatarPointers.values());

      const dx =
        pointers[1].x - pointers[0].x;

      const dy =
        pointers[1].y - pointers[0].y;

      const distance =
        Math.hypot(dx, dy);

      if (lastAvatarPinchDistance > 0) {

        const delta =
          distance - lastAvatarPinchDistance;

        avatarZoom += delta * 0.003;

        avatarZoom = Math.max(
          1,
          Math.min(3, avatarZoom)
        );

        applyAvatarTransform();

      }

      lastAvatarPinchDistance =
        distance;

    }

    // -------------------------
    // DRAG
    // -------------------------

    else if (isAvatarDragging) {

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

  }
);


// =========================
// AVATAR DRAG END
// =========================

avatarEditor.addEventListener(
  "pointerup",
  event => {

    avatarPointers.delete(
      event.pointerId
    );

    if (avatarPointers.size < 2) {

      lastAvatarPinchDistance = 0;

    }

    isAvatarDragging = false;

  }
);


// =========================
// DESKTOP WHEEL ZOOM
// =========================

avatarEditor.addEventListener(
  "wheel",
  event => {

    event.preventDefault();

    avatarZoom += event.deltaY * -0.001;

    avatarZoom = Math.max(
      1,
      Math.min(3, avatarZoom)
    );

    applyAvatarTransform();

  },
  { passive: false }
);
