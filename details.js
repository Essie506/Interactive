const detailsModalOpen =
  document.getElementById("detailsModalOpen");

const detailsModalOverlay =
  document.getElementById("detailsModalOverlay");

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
  openDetailsModal
);

detailsSaveBtn?.addEventListener(
  "click",
  () => {
    console.log("Save account details later");
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
