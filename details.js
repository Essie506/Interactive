const detailsModalOpen =
  document.getElementById("detailsModalOpen");

const detailsModalOverlay =
  document.getElementById("detailsModalOverlay");

const accountOnlineNameInput =
  document.getElementById("accountOnlineNameInput");

const detailsSaveBtn =
  document.getElementById("detailsSaveBtn");




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

    detailsModalOverlay.classList.add(
      "open"
    );
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
