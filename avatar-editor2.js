const avatarEditorOverlay =
  document.querySelector(
    ".avatar-editor-overlay"
  );

const avatarEditorImage =
  document.querySelector(
    ".avatar-editor-image"
  );

const uploadButtons =
  document.querySelectorAll(
    ".upload-photo-btn"
  );

uploadButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      avatarEditorOverlay.classList.add(
        "open"
      );

    }
  );

});

saveAvatarBtn.addEventListener(
  "click",
  () => {

    updateAvatar(
      avatarEditorImage.src
    );

    avatarEditorOverlay.classList.remove(
      "open"
    );

  }
);

