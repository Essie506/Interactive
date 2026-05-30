import {
  auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "./firebase-config.js";


const detailsModalOpen =
  document.getElementById("detailsModalOpen");

const detailsModalOverlay =
  document.getElementById("detailsModalOverlay");

const navTitleInput =
  document.getElementById("navTitleInput");

const profileNameInput =
  document.getElementById("profileNameInput");

const accountOnlineNameInput =
  document.getElementById("accountOnlineNameInput");

const detailsSaveBtn =
  document.getElementById("detailsSaveBtn");

const changePasswordBtn =
  document.getElementById("changePasswordBtn");

const passwordChangePanel =
  document.getElementById("passwordChangePanel");

const currentPasswordInput =
  document.getElementById("currentPasswordInput");

const newPasswordInput =
  document.getElementById("newPasswordInput");

const passwordSaveBtn =
  document.getElementById("passwordSaveBtn");

const verificationFormBtn =
  document.getElementById("verificationFormBtn");

const verificationPanel =
  document.getElementById("verificationPanel");

const verificationSaveBtn =
  document.getElementById("verificationSaveBtn");

const menuProfileName =
  document.querySelector(".menu-profile-name");



function syncDisplayName(name) {
  const displayName =
    name.trim() || "Profile";

  if (profileNameInput) {
    profileNameInput.value = displayName;
  }

  if (navTitleInput) {
    navTitleInput.value = displayName;
  }

  if (accountOnlineNameInput) {
    accountOnlineNameInput.value = displayName;
  }

  if (menuProfileName) {
    menuProfileName.textContent = displayName;
  }

  localStorage.setItem(
    "profileNameInput",
    displayName
  );

  localStorage.setItem(
    "accountOnlineName",
    displayName
  );

 if (typeof autoFitProfileName === "function") {
  autoFitProfileName();
}
}



function openDetailsModal() {
  detailsModalOverlay?.classList.add("open");
}

function closeDetailsModal() {
  detailsModalOverlay?.classList.remove("open");
}


detailsModalOpen?.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    console.log("details clicked");
    openDetailsModal();
  }
);




detailsSaveBtn?.addEventListener(
  "click",
  () => {

    const onlineName =
      accountOnlineNameInput?.value.trim()
      || "Profile";

    syncDisplayName(onlineName);

    closeDetailsModal();

  }
);




detailsModalOverlay?.addEventListener(
  "click",
  (e) => {
    if (e.target === detailsModalOverlay) {
      closeDetailsModal();
    }
  }
);

changePasswordBtn?.addEventListener(
  "click",
  () => {

    passwordChangePanel.hidden =
      !passwordChangePanel.hidden;

    changePasswordBtn.classList.toggle(
      "open"
    );

  }
);


verificationFormBtn?.addEventListener(
  "click",
  () => {
    if (!verificationPanel) return;

    verificationPanel.hidden =
      !verificationPanel.hidden;

    verificationFormBtn.classList.toggle(
      "open"
    );
  }
);

verificationSaveBtn?.addEventListener(
  "click",
  () => {
    console.log("Submit verification later");

    verificationPanel.hidden = true;

    verificationFormBtn?.classList.remove(
      "open"
    );

    alert("Verification submitted for review.");
  }
);



passwordSaveBtn?.addEventListener(
  "click",
  async () => {
    const user = auth.currentUser;

    const currentPassword =
      currentPasswordInput?.value.trim();

    const newPassword =
      newPasswordInput?.value.trim();

    if (!user || !user.email) {
      alert("Please log in again.");
      return;
    }

    if (!currentPassword || !newPassword) {
      alert("Please complete both password fields.");
      return;
    }

    try {
      const credential =
        EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(
        user,
        newPassword
      );

      currentPasswordInput.value = "";
      newPasswordInput.value = "";

      passwordChangePanel.hidden = true;

      alert("Password updated successfully.");
    } catch (error) {
      console.error("Password update error:", error);
      alert(error.message);
    }
  }
);
