
<script src="feed.js"></script>

  <script>
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (!menuToggle || !menu) return;

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    menu.classList.toggle("open");
  });

  const parentLinks = document.querySelectorAll(".has-submenu > a");

  parentLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const parent = link.parentElement;
      const isOpen = parent.classList.contains("open");

      document
        .querySelectorAll(".has-submenu")
        .forEach(p => p.classList.remove("open"));

      if (!isOpen) {
        parent.classList.add("open");
      }
    });
  });
});
</script>
