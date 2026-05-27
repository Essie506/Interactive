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
    document.body.classList.add("menu-open");
    navbar?.classList.remove("hide-top");
  }

  function closeMenu() {
    menu.classList.remove("open");
    menuOverlay.classList.remove("open");
    menuToggle.classList.remove("active");
    document.body.classList.remove("menu-open");
   submenuParents.forEach((item) => {
  item.classList.remove(
    "open",
    "suppress-hover"
  );
});

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

    const wasOpen = item.classList.contains("open");

    item.classList.toggle("open");

    if (wasOpen && window.innerWidth > 900) {
      item.classList.add("suppress-hover");
      trigger.blur();
    }
  });

  item.addEventListener("mouseleave", () => {
    item.classList.remove("suppress-hover");
  });
});

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
});
