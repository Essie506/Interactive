document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  const menuOverlay = document.getElementById("menuOverlay");
  const navbar = document.querySelector(".navbar");

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

    document.querySelectorAll(".has-submenu").forEach(p => {
      p.classList.remove("open");
    });
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuOverlay.addEventListener("click", closeMenu);

  const parentLinks = document.querySelectorAll(".has-submenu > a");

  parentLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const parent = link.parentElement;
      const isOpen = parent.classList.contains("open");

      document.querySelectorAll(".has-submenu").forEach(p => {
        p.classList.remove("open");
      });

      if (!isOpen) {
        parent.classList.add("open");
      }
    });
  });
});
