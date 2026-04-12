document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".profile-tab");
  const panels = document.querySelectorAll(".profile-panel");
  const followBtn = document.getElementById("followBtn");
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const profilePhotoInput = document.getElementById("profilePhotoInput");
  const shareProfileBtn = document.getElementById("shareProfileBtn");

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
      const isFollowing = followBtn.classList.toggle("is-following");

      if (isFollowing) {
        followBtn.innerHTML = '<i class="fa-solid fa-check"></i> Following';
        setActiveProfileTab("posts");
      } else {
        followBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Follow';
        setActiveProfileTab("services");
      }
    });
  }
});

if (uploadPhotoBtn && profilePhotoInput) {
  uploadPhotoBtn.addEventListener("click", () => {
    profilePhotoInput.click();
  });

  profilePhotoInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    console.log("Selected profile image:", file.name);
    // later: preview + upload to storage
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
