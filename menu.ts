document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle") as HTMLButtonElement | null;
  const menu = document.querySelector(".menu") as HTMLElement | null;
  const menuOverlay = document.getElementById("menuOverlay") as HTMLElement | null;
  const submenuParents = document.querySelectorAll<HTMLElement>(".has-submenu");
  const navbar = document.querySelector(".navbar") as HTMLElement | null;

  if (!menuToggle || !menu || !menuOverlay) return;

  const openMenu = (): void => {
    menu.classList.add("open");
    menuOverlay.classList.add("open");
    menuToggle.classList.add("active");
    navbar?.classList.remove("hide-top");
  };

  const closeMenu = (): void => {
    menu.classList.remove("open");
    menuOverlay.classList.remove("open");
    menuToggle.classList.remove("active");

    submenuParents.forEach((item) => {
      item.classList.remove("open");
    });
  };

  const toggleMenu = (): void => {
    menu.classList.contains("open") ? closeMenu() : openMenu();
  };

  menuToggle.addEventListener("click", toggleMenu);
  menuOverlay.addEventListener("click", closeMenu);

  submenuParents.forEach((item) => {
    const trigger = item.querySelector<HTMLAnchorElement>(":scope > a");
    if (!trigger) return;

    trigger.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      item.classList.toggle("open");
    });
  });

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") closeMenu();
  });
});
