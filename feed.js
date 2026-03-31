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

  const messagesToggle = document.getElementById("messagesToggle");
  const messagesOverlay = document.getElementById("messagesOverlay");
  const messagesModal = document.getElementById("messagesModal");
  const messagesClose = document.getElementById("messagesClose");
  const messagesInput = document.getElementById("messagesInput");
  const messagesSend = document.getElementById("messagesSend");
  const messagesPreview = document.getElementById("messagesPreview");
  const messagesMediaUpload = document.getElementById("messagesMediaUpload");
  const messageChat = document.getElementById("messageChat");

  const messagesListView = document.getElementById("messagesListView");
  const messagesChatView = document.getElementById("messagesChatView");
  const messagesBack = document.getElementById("messagesBack");
  const splitToggle = document.getElementById("splitToggle");
  const messageThreads = document.querySelectorAll(".message-thread");
  const messagesHeaderTitle = document.getElementById("messagesHeaderTitle");

  const topSearchToggle = document.getElementById("searchToggle");
  const bottomSearchToggle = document.getElementById("bottomSearchToggle");
  const menuSearchInput = document.getElementById("menuSearchInput");

  const emojiBtn = document.querySelector(".composer-tools .emoji-btn");
  const tagBtn = document.querySelector(".composer-tools .tag-btn");
  const gifBtn = document.querySelector(".composer-tools .gif-btn");
  const locationBtn = document.querySelector(".composer-tools .location-btn");

  const messagesEmojiBtn = document.querySelector(".messages-emoji-btn");
  const messagesGifBtn = document.querySelector(".messages-gif-btn");
  const messagesLocationBtn = document.querySelector(".messages-location-btn");

  const menu = document.querySelector(".menu");
  const menuOverlay = document.getElementById("menuOverlay");

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    const composerOpen = composerModal && composerModal.classList.contains("open");
    const messagesOpen = messagesModal && messagesModal.classList.contains("open");

    if (!composerOpen && !messagesOpen) {
      document.body.style.overflow = "";
    }
  }

  function updateMessagesHeader(isChatView, title = "Messages") {
    if (messagesHeaderTitle) {
      messagesHeaderTitle.textContent = title;
    }

    if (messagesBack) {
      messagesBack.style.display = isChatView ? "flex" : "none";
    }

    if (splitToggle) {
      splitToggle.style.display = isChatView ? "flex" : "none";
    }
  }

  function showMessagesListView() {
    if (messagesListView) messagesListView.classList.add("active");
    if (messagesChatView) messagesChatView.classList.remove("active");
    updateMessagesHeader(false, "Messages");
  }

  function showMessagesChatView(selectedName = "Chat") {
    if (messagesListView) messagesListView.classList.remove("active");
    if (messagesChatView) messagesChatView.classList.add("active");
    updateMessagesHeader(true, selectedName);
  }

  function closeComposer() {
    if (!composerOverlay || !composerModal) return;
    composerOverlay.classList.remove("open");
    composerModal.classList.remove("open");
    composerModal.setAttribute("aria-hidden", "true");
    unlockBodyScroll();
  }

  function openComposer() {
    if (!composerOverlay || !composerModal) return;
    closeMessages();
    composerOverlay.classList.add("open");
    composerModal.classList.add("open");
    composerModal.setAttribute("aria-hidden", "false");
    lockBodyScroll();
    if (composerInput) composerInput.focus();
  }

  function closeMessages() {
    if (!messagesOverlay || !messagesModal) return;
    messagesOverlay.classList.remove("open");
    messagesModal.classList.remove("open");
    messagesModal.setAttribute("aria-hidden", "true");
    messagesModal.classList.remove("split-mode");
    showMessagesListView();
    unlockBodyScroll();
  }

  function openMessages() {
    if (!messagesOverlay || !messagesModal) return;
    closeComposer();
    messagesOverlay.classList.add("open");
    messagesModal.classList.add("open");
    messagesModal.setAttribute("aria-hidden", "false");
    showMessagesListView();
    lockBodyScroll();
  }

  function updateComposerState() {
    if (!composerInput || !composerSubmit) return;

    const hasText = composerInput.value.trim().length > 0;
    const hasMedia = composerPreview && composerPreview.children.length > 0;

    if (hasText || hasMedia) {
      composerSubmit.classList.add("ready");
    } else {
      composerSubmit.classList.remove("ready");
    }
  }

  function updateMessagesState() {
    if (!messagesInput || !messagesSend) return;

    const hasText = messagesInput.value.trim().length > 0;
    const hasMedia = messagesPreview && messagesPreview.children.length > 0;

    if (hasText || hasMedia) {
      messagesSend.classList.add("ready");
    } else {
      messagesSend.classList.remove("ready");
    }
  }

  function openMenuSearch() {
    if (menu && menuOverlay) {
      menu.classList.add("open");
      menuOverlay.classList.add("open");
    }

    if (menuSearchInput) {
      setTimeout(() => {
        menuSearchInput.focus();
        menuSearchInput.select();
      }, 180);
    }
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

  if (messagesToggle) {
    messagesToggle.addEventListener("click", openMessages);
  }

  if (messagesClose) {
    messagesClose.addEventListener("click", closeMessages);
  }

  if (messagesOverlay) {
    messagesOverlay.addEventListener("click", closeMessages);
  }

  if (messagesBack) {
    messagesBack.addEventListener("click", () => {
      showMessagesListView();
    });
  }

  if (splitToggle && messagesModal) {
    splitToggle.addEventListener("click", () => {
      messagesModal.classList.toggle("split-mode");
    });
  }

  if (messageThreads.length) {
    messageThreads.forEach((thread) => {
      thread.addEventListener("click", () => {
        const selectedName =
          thread.querySelector(".message-thread-name")?.textContent?.trim() || "Chat";

        messageThreads.forEach((item) => item.classList.remove("active"));
        thread.classList.add("active");

        showMessagesChatView(selectedName);

        if (messagesInput) {
          setTimeout(() => messagesInput.focus(), 100);
        }
      });
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeComposer();
      closeMessages();
    }
  });

  if (composerInput) {
    composerInput.addEventListener("input", updateComposerState);
  }

  if (messagesInput) {
    messagesInput.addEventListener("input", updateMessagesState);
  }

  if (composerMediaUpload && composerPreview) {
    composerMediaUpload.addEventListener("change", function () {
      composerPreview.innerHTML = "";

      Array.from(this.files).forEach((file) => {
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

      if (composerPreview.children.length > 0) {
        composerPreview.classList.add("has-media");
      } else {
        composerPreview.classList.remove("has-media");
      }

      updateComposerState();
    });
  }

  if (messagesMediaUpload && messagesPreview) {
    messagesMediaUpload.addEventListener("change", function () {
      messagesPreview.innerHTML = "";

      Array.from(this.files).forEach((file) => {
        const fileURL = URL.createObjectURL(file);

        if (file.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = fileURL;
          img.alt = file.name;
          messagesPreview.appendChild(img);
        } else if (file.type.startsWith("video/")) {
          const video = document.createElement("video");
          video.src = fileURL;
          video.controls = true;
          messagesPreview.appendChild(video);
        }
      });

      if (messagesPreview.children.length > 0) {
        messagesPreview.classList.add("has-media");
      } else {
        messagesPreview.classList.remove("has-media");
      }

      updateMessagesState();
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

  if (messagesEmojiBtn && messagesInput) {
    messagesEmojiBtn.addEventListener("click", () => {
      messagesInput.value += " 😊";
      messagesInput.focus();
      updateMessagesState();
    });
  }

  if (messagesGifBtn && messagesInput) {
    messagesGifBtn.addEventListener("click", () => {
      messagesInput.value += " [GIF] ";
      messagesInput.focus();
      updateMessagesState();
    });
  }

  if (messagesLocationBtn && messagesInput) {
    messagesLocationBtn.addEventListener("click", () => {
      messagesInput.value += " 📍";
      messagesInput.focus();
      updateMessagesState();
    });
  }

  if (messagesSend && messagesInput) {
    messagesSend.addEventListener("click", () => {
      const messageText = messagesInput.value.trim();
      const hasMedia = messagesPreview && messagesPreview.children.length > 0;

      if (!messageText && !hasMedia) return;
      if (!messageChat) return;

      if (messageText) {
        const newBubble = document.createElement("div");
        newBubble.className = "message-bubble outgoing";
        newBubble.textContent = messageText;
        messageChat.appendChild(newBubble);
      }

      if (hasMedia) {
        Array.from(messagesPreview.children).forEach((node) => {
          const mediaBubble = document.createElement("div");
          mediaBubble.className = "message-bubble outgoing";

          const clone = node.cloneNode(true);
          mediaBubble.appendChild(clone);

          messageChat.appendChild(mediaBubble);
        });
      }

      messagesInput.value = "";

      if (messagesPreview) {
        messagesPreview.innerHTML = "";
        messagesPreview.classList.remove("has-media");
      }

      updateMessagesState();
      messageChat.scrollTop = messageChat.scrollHeight;
      messagesInput.focus();
    });
  }

  if (messagesInput) {
    messagesInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (messagesSend) {
          messagesSend.click();
        }
      }
    });
  }

  if (topSearchToggle) {
    topSearchToggle.addEventListener("click", openMenuSearch);
  }

  if (bottomSearchToggle) {
    bottomSearchToggle.addEventListener("click", openMenuSearch);
  }

  if (menuSearchInput) {
    menuSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = menuSearchInput.value.trim();
        if (!query) return;
        alert(`Search for: ${query}`);
      }
    });
  }

  let lastScrollY = window.scrollY;
  const navbar = document.querySelector(".navbar");
  const bottomNav = document.querySelector(".bottom-nav");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const composerOpen = composerModal && composerModal.classList.contains("open");
    const messagesOpen = messagesModal && messagesModal.classList.contains("open");

    if (composerOpen || messagesOpen) return;

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

  updateMessagesHeader(false, "Messages");
});
