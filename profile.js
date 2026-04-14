document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".profile-tab");
  const panels = document.querySelectorAll(".profile-panel");

  const profilePage = document.querySelector(".profile-page");
  const profileNameEl = document.querySelector(".profile-main-info h1");
  const profileHandleEl = document.querySelector(".profile-handle");

  const profileUser = {
    id: profilePage?.dataset.userId || null,
    name: profileNameEl ? profileNameEl.textContent.trim() : "Profile",
    handle: profileHandleEl ? profileHandleEl.textContent.trim() : ""
  };

  const followBtn = document.getElementById("followBtn");
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
  const profilePhotoInput = document.getElementById("profilePhotoInput");

  const shareProfileBtn = document.getElementById("shareProfileBtn");
  const messageProfileBtn = document.getElementById("messageProfileBtn");

  const profileChevronBtn = document.getElementById("profileChevronBtn");
  const profileCornerMenu = document.getElementById("profileCornerMenu");

  const profileBlockMenuBtn = document.getElementById("profileBlockMenuBtn");
  const blockUserModal = document.getElementById("blockUserModal");
  const blockCloseBtn = document.getElementById("blockCloseBtn");
  const cancelBlockBtn = document.getElementById("cancelBlockBtn");
  const confirmBlockBtn = document.getElementById("confirmBlockBtn");

  function setActiveProfileTab(tabName) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle("active", isActive);
    });

    panels.forEach((panel) => {
      const isActive = panel.id === `profile-panel-${tabName}`;
      panel.classList.toggle("active", isActive);
    });
  }

  function openBlockModal() {
    if (!blockUserModal) return;

    blockUserModal.hidden = false;

    requestAnimationFrame(() => {
      blockUserModal.classList.add("open");
    });

    document.body.classList.add("modal-open");

    if (profileCornerMenu) {
      profileCornerMenu.classList.remove("open");
    }

    if (profileChevronBtn) {
      profileChevronBtn.classList.remove("open");
    }
  }

  function closeBlockModal() {
    if (!blockUserModal) return;

    blockUserModal.classList.remove("open");
    document.body.classList.remove("modal-open");

    window.setTimeout(() => {
      blockUserModal.hidden = true;
    }, 220);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      const tabName = tab.dataset.tab;
      if (!tabName) return;
      setActiveProfileTab(tabName);
    });
  });

  setActiveProfileTab("services");

  if (followBtn) {
    followBtn.addEventListener("click", () => {
      const isConnected = followBtn.classList.toggle("is-connected");

      if (isConnected) {
        followBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setActiveProfileTab("posts");
      } else {
        followBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i>';
        setActiveProfileTab("services");
      }
    });
  }

  if (uploadPhotoBtn && profilePhotoInput) {
    uploadPhotoBtn.addEventListener("click", () => {
      profilePhotoInput.click();
    });

    profilePhotoInput.addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      console.log("Selected profile image:", file.name);
    });
  }

  if (messageProfileBtn) {
    messageProfileBtn.addEventListener("click", () => {
      const messagesModal = document.getElementById("messagesModal");
      const messagesOverlay = document.getElementById("messagesOverlay");
      const messagesHeaderTitle = document.getElementById("messagesHeaderTitle");
      const messagesListView = document.getElementById("messagesListView");
      const messagesChatView = document.getElementById("messagesChatView");

      if (messagesModal) {
        messagesModal.classList.add("open");
        messagesModal.setAttribute("aria-hidden", "false");
      }

      if (messagesOverlay) {
        messagesOverlay.classList.add("open");
      }

      document.body.classList.add("messages-open");

      if (messagesHeaderTitle) {
        messagesHeaderTitle.textContent = profileUser.name;
      }

      if (messagesListView) {
        messagesListView.classList.remove("active");
      }

      if (messagesChatView) {
        messagesChatView.classList.add("active");
      }

      console.log("Open chat for:", profileUser);
    });
  }

  if (shareProfileBtn) {
    shareProfileBtn.addEventListener("click", async () => {
      const shareData = {
        title: "Interactive Fitness Profile",
        text: "Check out this profile on Interactive Fitness",
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          alert("Profile link copied");
        }
      } catch (error) {
        console.log("Share cancelled or failed", error);
      }
    });
  }

  if (profileChevronBtn && profileCornerMenu) {
    profileChevronBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      profileCornerMenu.classList.toggle("open");
      profileChevronBtn.classList.toggle("open");
    });

    profileCornerMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", () => {
      profileCornerMenu.classList.remove("open");
      profileChevronBtn.classList.remove("open");
    });
  }

  if (profileBlockMenuBtn) {
    profileBlockMenuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      openBlockModal();
    });
  }

  if (blockCloseBtn) {
    blockCloseBtn.addEventListener("click", () => {
      closeBlockModal();
    });
  }

  if (cancelBlockBtn) {
    cancelBlockBtn.addEventListener("click", () => {
      closeBlockModal();
    });
  }

  if (blockUserModal) {
    blockUserModal.addEventListener("click", (event) => {
      if (event.target === blockUserModal) {
        closeBlockModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && blockUserModal && !blockUserModal.hidden) {
      closeBlockModal();
    }
  });

  if (confirmBlockBtn) {
    confirmBlockBtn.addEventListener("click", () => {
      console.log("User blocked");
      closeBlockModal();
    });
  }
});
