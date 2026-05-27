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

const navTitle =
  document.getElementById("navTitle");

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
      accountOnlineNameInput?.value.trim() || "Profile";

    if (navTitle) {
      navTitle.textContent = onlineName;
    }

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

    verificationPanel.hidden =
      !verificationPanel.hidden;

    verificationFormBtn.classList.toggle(
      "open"
    );

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
