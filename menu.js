document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  const menuOverlay = document.getElementById("menuOverlay");
  const navbar = document.querySelector(".navbar");
  const submenuParents = document.querySelectorAll(".has-submenu");
  const parentLinks = document.querySelectorAll(".has-submenu > a");
  const menuLinks = document.querySelectorAll(".menu a:not(.has-submenu > a)");

  if (!menuToggle || !menu || !menuOverlay || !navbar) return;

  function openMenu() {
    menuToggle.classList.add("active");
    menu.classList.add("open");
    menuOverlay.classList.add("open");
    navbar.classList.add("menu-open");
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    menu.classList.remove("open");
    menuOverlay.classList.remove("open");
    navbar.classList.remove("menu-open");

    submenuParents.forEach((parent) => {
      parent.classList.remove("open");
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

  parentLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const parent = link.parentElement;
      const isOpen = parent.classList.contains("open");

      submenuParents.forEach((item) => {
        item.classList.remove("open");
      });

      if (!isOpen) {
        parent.classList.add("open");
      }
    });
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      closeMenu();
    }
  });
});
