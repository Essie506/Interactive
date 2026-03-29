document.addEventListener("DOMContentLoaded", () => {
  const posts = [
    {
      user: "Esther",
      time: "2 min ago",
      text: "Finished HIIT session 🔥",
      image: "logo2.png"
    },
    {
      user: "Alex",
      time: "10 min ago",
      text: "5K run done",
      image: "logo2.png"
    },
    {
      user: "Jason",
      time: "1 hr ago",
      text: "I have man-flu! :(",
      image: "logo2.png"
    }
  ];

  const feed = document.getElementById("feed");

  if (feed) {
    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "post";

      card.innerHTML = `
        <div class="post-header">
          <div class="avatar">
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="post-info">
            <span class="username">${post.user}</span>
            <span class="time">${post.time}</span>
          </div>
        </div>

        <div class="post-text">${post.text}</div>

        <img class="post-img" src="${post.image}" alt="${post.user} post image">

        <div class="post-actions">
          <span><i class="fa-solid fa-heart"></i> 12</span>
          <span><i class="fa-solid fa-comment"></i> 3</span>
          <span><i class="fa-solid fa-bookmark"></i></span>
        </div>
      `;

      feed.appendChild(card);
    });
  }

  const composerToggle = document.getElementById("composerToggle");
  const composerOverlay = document.getElementById("composerOverlay");
  const composerModal = document.getElementById("composerModal");
  const composerClose = document.getElementById("composerClose");
  const composerInput = document.getElementById("composerInput");
  const composerPreview = document.getElementById("composerPreview");
  const composerMediaUpload = document.getElementById("composerMediaUpload");
  const composerSubmit = document.getElementById("composerSubmit");

  const emojiBtn = document.querySelector(".composer-tools .emoji-btn");
  const tagBtn = document.querySelector(".composer-tools .tag-btn");
  const gifBtn = document.querySelector(".composer-tools .gif-btn");
  const locationBtn = document.querySelector(".composer-tools .location-btn");

  const navbar = document.querySelector(".navbar");
  const bottomNav = document.querySelector(".bottom-nav");

  function openComposer() {
    if (!composerOverlay || !composerModal) return;

    composerOverlay.classList.add("open");
    composerModal.classList.add("open");
    composerModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (composerInput) {
      composerInput.focus();
    }
  }

  function closeComposer() {
    if (!composerOverlay || !composerModal) return;

    composerOverlay.classList.remove("open");
    composerModal.classList.remove("open");
    composerModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateComposerState() {
    if (!composerInput || !composerSubmit || !composerPreview) return;

    const hasText = composerInput.value.trim().length > 0;
    const hasMedia = composerPreview.children.length > 0;

    if (hasText || hasMedia) {
      composerSubmit.classList.add("ready");
      composerSubmit.disabled = false;
    } else {
      composerSubmit.classList.remove("ready");
      composerSubmit.disabled = true;
    }
  }

  function renderMediaPreview(files) {
    if (!composerPreview) return;

    composerPreview.innerHTML = "";

    Array.from(files).forEach((file) => {
      const fileURL = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = fileURL;
        img.alt = file.name;
        composerPreview.appendChild(img);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = fileURL;
        video.controls = true;
        composerPreview.appendChild(video);
      }
    });

    composerPreview.classList.toggle("has-media", composerPreview.children.length > 0);
    updateComposerState();
  }

  function resetComposer() {
    if (composerInput) {
      composerInput.value = "";
    }

    if (composerPreview) {
      composerPreview.innerHTML = "";
      composerPreview.classList.remove("has-media");
    }

    if (composerMediaUpload) {
      composerMediaUpload.value = "";
    }

    updateComposerState();
  }

  if (composerToggle) {
    composerToggle.addEventListener("click", openComposer);
  }

  if (composerClose) {
    composerClose.addEventListener("click", closeComposer);
  }

  if (composerOverlay) {
    composerOverlay.addEventListener("click", closeComposer);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && composerModal?.classList.contains("open")) {
      closeComposer();
    }
  });

  if (composerInput) {
    composerInput.addEventListener("input", updateComposerState);
  }

  if (composerMediaUpload) {
    composerMediaUpload.addEventListener("change", function () {
      renderMediaPreview(this.files);
    });
  }

  if (emojiBtn && composerInput) {
    emojiBtn.addEventListener("click", () => {
      composerInput.value += " 😊";
      composerInput.focus();
      updateComposerState();
    });
  }

  if (tagBtn && composerInput) {
    tagBtn.addEventListener("click", () => {
      composerInput.value += " @";
      composerInput.focus();
      updateComposerState();
    });
  }

  if (gifBtn && composerInput) {
    gifBtn.addEventListener("click", () => {
      composerInput.value += " [GIF] ";
      composerInput.focus();
      updateComposerState();
    });
  }

  if (locationBtn && composerInput) {
    locationBtn.addEventListener("click", () => {
      composerInput.value += " 📍";
      composerInput.focus();
      updateComposerState();
    });
  }

  if (composerSubmit) {
    composerSubmit.addEventListener("click", () => {
      if (!composerSubmit.classList.contains("ready") || !feed || !composerInput || !composerPreview) {
        return;
      }

      const text = composerInput.value.trim();
      const firstMedia = composerPreview.querySelector("img, video");

      const card = document.createElement("div");
      card.className = "post";

      card.innerHTML = `
        <div class="post-header">
          <div class="avatar">
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="post-info">
            <span class="username">Esther</span>
            <span class="time">Just now</span>
          </div>
        </div>

        ${text ? `<div class="post-text">${text}</div>` : ""}

        ${
          firstMedia
            ? firstMedia.tagName === "IMG"
              ? `<img class="post-img" src="${firstMedia.src}" alt="New post image">`
              : `<video class="post-img" src="${firstMedia.src}" controls></video>`
            : ""
        }

        <div class="post-actions">
          <span><i class="fa-solid fa-heart"></i> 0</span>
          <span><i class="fa-solid fa-comment"></i> 0</span>
          <span><i class="fa-solid fa-bookmark"></i></span>
        </div>
      `;

      feed.prepend(card);
      resetComposer();
      closeComposer();
    });
  }

  updateComposerState();

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 10) {
      if (navbar) navbar.classList.remove("hide-top");
      if (bottomNav) bottomNav.classList.remove("hide-bottom");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY) {
      if (navbar) navbar.classList.add("hide-top");
      if (bottomNav) bottomNav.classList.add("hide-bottom");
    } else {
      if (navbar) navbar.classList.remove("hide-top");
      if (bottomNav) bottomNav.classList.remove("hide-bottom");
    }

    lastScrollY = currentScrollY;
  });
});
