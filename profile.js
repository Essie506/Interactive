document.addEventListener("DOMContentLoaded", () => {

  // Actions
   const followBtn = document.getElementById("followBtn"); 
  const shareProfileButtons = document.querySelectorAll(".profile-share-btn");
  const messageProfileBtn = document.getElementById("messageProfileBtn");

  // Menus
  const profileChevronBtn = document.getElementById("profileChevronBtn");
  const profileCornerMenu = document.getElementById("profileCornerMenu");

  // Block modal
  const profileBlockMenuBtn = document.getElementById("profileBlockMenuBtn");
  const blockUserModal = document.getElementById("blockUserModal");
  const blockCloseBtn = document.getElementById("blockCloseBtn");
  const cancelBlockBtn = document.getElementById("cancelBlockBtn");
  const confirmBlockBtn = document.getElementById("confirmBlockBtn");

  const tabs = document.querySelectorAll(".profile-tab");
  const panels = document.querySelectorAll(".profile-panel");
  

  const profilePage = document.querySelector(".profile-page");
const profileNameInput = document.getElementById("profileNameInput");
  const profileHandleInput = document.getElementById("profileHandleInput");
  const navVerifiedBadge = document.getElementById("navVerifiedBadge");
  const profileVerifiedBadge =
  document.querySelector(
    ".profile-verified"
  );
  
  const proofSubmittedStatus =
  document.getElementById("proofSubmittedStatus");
  
  const proofSubmittedDesktop =
  document.getElementById("proofSubmittedDesktop");

const proofSubmittedMobile =
  document.getElementById("proofSubmittedMobile");
  

// temporary until Firestore is read here
   const verificationStatus = "pending"; 

  

const profileUser = {
  id: profilePage?.dataset.userId || null,

  name: profileNameInput
    ? profileNameInput.value.trim()
    : "Profile",

  handle: profileHandleInput
    ? profileHandleInput.value.trim()
    : "",
  proofSubmitted: verificationStatus === "pending",
  verified: verificationStatus === "approved"

};


function updateProfileVerificationUI() {

  if (navVerifiedBadge) {
    navVerifiedBadge.hidden =
      !profileUser.verified;
  }

  if (profileVerifiedBadge) {
    profileVerifiedBadge.hidden =
      !profileUser.verified;
  }

  if (proofSubmittedDesktop) {
    proofSubmittedStatus.hidden =
      !profileUser.proofSubmitted;
  }

    if (proofSubmittedMobile) {
    proofSubmittedMobile.hidden =
      !profileUser.proofSubmitted;

}
}


updateProfileVerificationUI();

document.title =
  `${profileUser.name} - Interactive Fitness`;


  



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




if (messageProfileBtn) {
  messageProfileBtn.addEventListener("click", () => {
    if (!window.interactiveMessages) return;
    window.interactiveMessages.openProfileThread(profileUser.name || "Profile");
  });
}

if (shareProfileButtons.length) {
  shareProfileButtons.forEach(button => {
    button.addEventListener("click", async () => {

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
          alert("Profile link copied!");
        }
      } catch (err) {
        console.error("Share failed:", err);
      }

    });
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




