document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.querySelector(".menu");
  const menuOverlay = document.getElementById("menuOverlay");
  const submenuParents = document.querySelectorAll(".has-submenu");
  const navbar = document.querySelector(".navbar");

  if (!menuToggle || !menu || !menuOverlay) return;

  function openMenu() {
    menu.classList.add("open");
    menuOverlay.classList.add("open");
    menuToggle.classList.add("active");
    navbar?.classList.remove("hide-top");
  }

  function closeMenu() {
    menu.classList.remove("open");
    menuOverlay.classList.remove("open");
    menuToggle.classList.remove("active");

    submenuParents.forEach((item) => {
      item.classList.remove("open");
    });
  }

  function toggleMenu() {
    if (menu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuToggle.addEventListener("click", toggleMenu);
  menuOverlay.addEventListener("click", closeMenu);

  submenuParents.forEach((item) => {
    const trigger = item.querySelector(":scope > a");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      item.classList.toggle("open");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
});
