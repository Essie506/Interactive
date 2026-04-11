document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".profile-tab");
  const panels = document.querySelectorAll(".profile-panel");
  const followBtn = document.getElementById("followBtn");

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
