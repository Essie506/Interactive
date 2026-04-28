document.addEventListener("DOMContentLoaded", () => {
  const composerToggle = document.getElementById("composerToggle");
  const composerOverlay = document.getElementById("composerOverlay");
  const composerModal = document.getElementById("composerModal");
  const composerClose = document.getElementById("composerClose");
  const composerInput = document.getElementById("composerInput");
  const composerPreview = document.getElementById("composerPreview");
  const composerMediaUpload = document.getElementById("composerMediaUpload");
  const composerSubmit = document.getElementById("composerSubmit");

  const topSearchToggle = document.getElementById("searchToggle");
  const bottomSearchToggle = document.getElementById("bottomSearchToggle");
  const menuSearchInput = document.getElementById("menuSearchInput");

  const emojiBtn = document.querySelector(".composer-tools .emoji-btn");
  const tagBtn = document.querySelector(".composer-tools .tag-btn");
  const gifBtn = document.querySelector(".composer-tools .gif-btn");
  const locationBtn = document.querySelector(".composer-tools .location-btn");

  const menu = document.querySelector(".menu");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuToggle = document.getElementById("menuToggle");

  const navbar = document.querySelector(".navbar");
  const bottomNav = document.querySelector(".bottom-nav");

  let lastScrollY = window.scrollY;

  function resetTextareaLayout(textarea) {
    if (!textarea) return;
    textarea.style.removeProperty("height");
    textarea.style.overflowY = "auto";
  }

  function updateComposerState() {
    if (!composerInput || !composerSubmit) return;

    const hasText = composerInput.value.trim().length > 0;
    const hasMedia = composerPreview && composerPreview.children.length > 0;

    composerSubmit.classList.toggle("ready", hasText || hasMedia);
    composerSubmit.classList.toggle("active", hasText || hasMedia);
  }

  function unlockBodyScroll() {
    const messagesOpen =
      document.getElementById("messagesModal")?.classList.contains("open") ||
      document.getElementById("messagesPopup")?.classList.contains("open") ||
      document.getElementById("messagesPopout")?.classList.contains("open");

    if (!messagesOpen) {
      document.body.style.overflow = "";
    }
  }

  function closeComposer() {
    if (!composerOverlay || !composerModal) return;

    composerOverlay.classList.remove("open");
    composerModal.classList.remove("open");
    composerModal.setAttribute("aria-hidden", "true");

    resetTextareaLayout(composerInput);
    unlockBodyScroll();
  }

  function openComposer() {
    if (!composerOverlay || !composerModal) return;

    window.interactiveMessages?.closeAll?.();

    composerOverlay.classList.add("open");
    composerModal.classList.add("open");
    composerModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    resetTextareaLayout(composerInput);
    updateComposerState();
  }

  function openMenuSearch() {
    if (menu && menuOverlay) {
      menu.classList.add("open");
      menuOverlay.classList.add("open");
      menuToggle?.classList.add("active");
    }

    if (menuSearchInput) {
      setTimeout(() => {
        menuSearchInput.focus();
        menuSearchInput.select();
      }, 180);
    }
  }

  composerToggle?.addEventListener("click", openComposer);
  composerClose?.addEventListener("click", closeComposer);

  composerOverlay?.addEventListener("click", closeComposer);

  composerInput?.addEventListener("input", () => {
    resetTextareaLayout(composerInput);
    updateComposerState();
  });

  composerMediaUpload?.addEventListener("change", function () {
    if (!composerPreview) return;

    composerPreview.innerHTML = "";

    Array.from(this.files).forEach((file) => {
      const fileURL = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = fileURL;
        img.alt = file.name;
        composerPreview.appendChild(img);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = fileURL;
        video.controls = true;
        composerPreview.appendChild(video);
      }
    });

    composerPreview.classList.toggle("has-media", composerPreview.children.length > 0);
    updateComposerState();
  });

  emojiBtn?.addEventListener("click", () => {
    if (!composerInput) return;
    composerInput.value += " 😊";
    composerInput.focus();
    resetTextareaLayout(composerInput);
    updateComposerState();
  });

  tagBtn?.addEventListener("click", () => {
    if (!composerInput) return;
    composerInput.value += " @";
    composerInput.focus();
    resetTextareaLayout(composerInput);
    updateComposerState();
  });

  gifBtn?.addEventListener("click", () => {
    if (!composerInput) return;
    composerInput.value += " [GIF] ";
    composerInput.focus();
    resetTextareaLayout(composerInput);
    updateComposerState();
  });

  locationBtn?.addEventListener("click", () => {
    if (!composerInput) return;
    composerInput.value += " 📍";
    composerInput.focus();
    resetTextareaLayout(composerInput);
    updateComposerState();
  });

  topSearchToggle?.addEventListener("click", openMenuSearch);
  bottomSearchToggle?.addEventListener("click", openMenuSearch);

  menuSearchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = menuSearchInput.value.trim();
      if (!query) return;
      alert(`Search for: ${query}`);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeComposer();
    }
  });

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    const composerOpen = composerModal?.classList.contains("open");
    const drawerOpen = document.getElementById("messagesModal")?.classList.contains("open");
    const popupOpen = document.getElementById("messagesPopup")?.classList.contains("open");
    const popoutOpen = document.getElementById("messagesPopout")?.classList.contains("open");
    const menuOpen = document.body.classList.contains("menu-open");

    if (composerOpen || drawerOpen || popupOpen || popoutOpen || menuOpen) return;

    if (currentScrollY <= 10) {
      navbar?.classList.remove("hide-top");
      bottomNav?.classList.remove("hide-bottom");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY) {
      navbar?.classList.add("hide-top");
      bottomNav?.classList.add("hide-bottom");
    } else {
      navbar?.classList.remove("hide-top");
      bottomNav?.classList.remove("hide-bottom");
    }

    lastScrollY = currentScrollY;
  });

  window.interactiveUI = {
    closeComposer,
    openComposer,
    openMenuSearch
  };

  resetTextareaLayout(composerInput);
  updateComposerState();
});
