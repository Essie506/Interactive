document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "interactiveFitnessMessages_v1";

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

  const defaultUsers = {
    Jason: {
      status: "online",
      unread: 0,
      draft: "",
      messages: [
        {
          id: crypto.randomUUID(),
          type: "incoming",
          text: "Hey, are you around later?",
          createdAt: Date.now() - 2 * 60 * 1000
        },
        {
          id: crypto.randomUUID(),
          type: "outgoing",
          text: "Yes, I should be.",
          createdAt: Date.now() - 1 * 60 * 1000
        }
      ]
    },
    Alex: {
      status: "away",
      unread: 1,
      draft: "",
      messages: [
        {
          id: crypto.randomUUID(),
          type: "incoming",
          text: "Nice work on your run 🔥",
          createdAt: Date.now() - 60 * 60 * 1000
        },
        {
          id: crypto.randomUUID(),
          type: "outgoing",
          text: "Thank you! It felt good today.",
          createdAt: Date.now() - 55 * 60 * 1000
        }
      ]
    }
  };

  const fakeReplies = {
    Jason: [
      "Yeah, I should be around later.",
      "Give me a little bit and I’ll reply properly.",
      "That sounds good to me 😊",
      "I’m just finishing something off."
    ],
    Alex: [
      "You smashed it 🔥",
      "That’s such a good effort.",
      "Nice one — keep going.",
      "Love that for you."
    ]
  };

  const feed = document.getElementById("feed");

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
  const messagesList = document.querySelector(".messages-list");
  const messagesSearchInput =
    document.getElementById("messagesSearchInput") ||
    document.querySelector(".messages-search input");

  const messagesListView = document.getElementById("messagesListView");
  const messagesChatView = document.getElementById("messagesChatView");
  const messagesBack = document.getElementById("messagesBack");
  const splitToggle = document.getElementById("splitToggle");
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

  let users = loadUsers();
  let activeChatUser = getInitialActiveChatUser();
  let currentThreadFilter = "";
  const pendingReplyTimeouts = new Map();

  renderFeed();
  renderThreads();
  ensureUserExists(activeChatUser);
  restoreDraftForActiveUser();
  renderActiveChat();
  updateMessagesHeader(false, "Messages");
  updateComposerState();
  updateMessagesState();

  function renderFeed() {
    if (!feed) return;
    feed.innerHTML = "";

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "post";

      card.innerHTML = `
        <div class="post-header">
          <div class="avatar">
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="post-info">
            <span class="username">${escapeHtml(post.user)}</span>
            <span class="time">${escapeHtml(post.time)}</span>
          </div>
        </div>

        <div class="post-text">${escapeHtml(post.text)}</div>

        <img class="post-img" src="${escapeAttribute(post.image)}" alt="${escapeAttribute(post.user)} post image">

        <div class="post-actions">
          <span><i class="fa-solid fa-heart"></i> 12</span>
          <span><i class="fa-solid fa-comment"></i> 3</span>
          <span><i class="fa-solid fa-bookmark"></i></span>
        </div>
      `;

      feed.appendChild(card);
    });
  }

  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultUsers);

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return structuredClone(defaultUsers);
      }

      return mergeWithDefaults(parsed);
    } catch {
      return structuredClone(defaultUsers);
    }
  }

  function mergeWithDefaults(saved) {
    const merged = structuredClone(defaultUsers);

    Object.entries(saved).forEach(([userName, data]) => {
      merged[userName] = {
        status: typeof data.status === "string" ? data.status : "offline",
        unread: Number.isFinite(data.unread) ? data.unread : 0,
        draft: typeof data.draft === "string" ? data.draft : "",
        messages: Array.isArray(data.messages) ? data.messages : []
      };
    });

    return merged;
  }

  function saveUsers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore storage errors
    }
  }

  function getInitialActiveChatUser() {
    const firstUser = Object.keys(users)[0];
    return firstUser || "Jason";
  }

  function ensureUserExists(userName) {
    if (!users[userName]) {
      users[userName] = {
        status: "offline",
        unread: 0,
        draft: "",
        messages: []
      };
    }
  }

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    const composerOpen = composerModal?.classList.contains("open");
    const messagesOpen = messagesModal?.classList.contains("open");

    if (!composerOpen && !messagesOpen) {
      document.body.style.overflow = "";
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function escapeAttribute(text) {
    return String(text ?? "").replace(/"/g, "&quot;");
  }

  function autoResizeTextarea(textarea, maxHeight = 260) {
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  function getUserMessages(userName) {
    ensureUserExists(userName);
    return users[userName].messages;
  }

  function getLastMessage(userName) {
    const messages = getUserMessages(userName);
    return messages.length ? messages[messages.length - 1] : null;
  }

  function getLastMessageTime(userName) {
    const lastMessage = getLastMessage(userName);
    return lastMessage?.createdAt ?? 0;
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) return "";

    const diffMs = Date.now() - timestamp;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "now";
    if (diffMin < 60) return `${diffMin}m`;

    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h`;

    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return "1d";

    return `${diffDay}d`;
  }

  function getPreviewText(message) {
    if (!message) return "No messages yet";

    if (message.text && message.text.trim()) {
      return message.text.trim();
    }

    if (message.media?.type === "image") return "📷 Photo";
    if (message.media?.type === "video") return "🎥 Video";

    return "Sent a message";
  }

  function isUserOnline(status) {
    return status === "online";
  }

  function sortedUserNames() {
    return Object.keys(users).sort((a, b) => getLastMessageTime(b) - getLastMessageTime(a));
  }

  function renderThreads() {
    if (!messagesList) return;

    const names = sortedUserNames().filter((userName) => {
      if (!currentThreadFilter) return true;
      return userName.toLowerCase().includes(currentThreadFilter.toLowerCase());
    });

    messagesList.innerHTML = "";

    names.forEach((userName) => {
      ensureUserExists(userName);
      const user = users[userName];
      const lastMessage = getLastMessage(userName);
      const previewText = getPreviewText(lastMessage);
      const timeText = formatRelativeTime(lastMessage?.createdAt);

      const thread = document.createElement("button");
      thread.type = "button";
      thread.className = "message-thread";
      thread.dataset.user = userName;

      if (userName === activeChatUser) {
        thread.classList.add("active");
      }

      thread.innerHTML = `
        <div class="message-thread-avatar">
          <i class="fa-solid fa-user"></i>
        </div>

        <div class="message-thread-content">
          <div class="message-thread-top">
            <div class="message-thread-name-row">
              ${isUserOnline(user.status) ? '<span class="message-status-dot" aria-hidden="true"></span>' : ""}
              <span class="message-thread-name">${escapeHtml(userName)}</span>
              ${user.unread > 0 ? `<span class="message-unread-badge">${user.unread}</span>` : ""}
            </div>

            <span class="message-thread-time">${escapeHtml(timeText)}</span>
          </div>

          <div class="message-thread-preview">${escapeHtml(previewText)}</div>
        </div>
      `;

      thread.addEventListener("click", () => {
        openThread(userName);
      });

      messagesList.appendChild(thread);
    });
  }

  function openThread(userName) {
    activeChatUser = userName;
    ensureUserExists(activeChatUser);

    users[activeChatUser].unread = 0;
    saveUsers();

    renderThreads();
    renderActiveChat();
    restoreDraftForActiveUser();
    showMessagesChatView(activeChatUser);

    if (messagesInput) {
      setTimeout(() => messagesInput.focus(), 100);
    }
  }

  function renderActiveChat() {
    if (!messageChat) return;

    const messages = getUserMessages(activeChatUser);
    messageChat.innerHTML = "";

    messages.forEach((message) => {
      const bubble = document.createElement("div");
      bubble.className = `message-bubble ${message.type}`;

      if (message.media) {
        if (message.media.type === "image") {
          const img = document.createElement("img");
          img.src = message.media.src;
          img.alt = message.media.alt || "Shared image";
          bubble.appendChild(img);
        } else if (message.media.type === "video") {
          const video = document.createElement("video");
          video.src = message.media.src;
          video.controls = true;
          bubble.appendChild(video);
        }
      }

      if (message.text) {
        const textWrap = document.createElement("div");
        textWrap.innerHTML = escapeHtml(message.text).replace(/\n/g, "<br>");
        bubble.appendChild(textWrap);
      }

      messageChat.appendChild(bubble);
    });

    messageChat.scrollTop = messageChat.scrollHeight;
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
    messagesListView?.classList.add("active");
    messagesChatView?.classList.remove("active");
    updateMessagesHeader(false, "Messages");
  }

  function showMessagesChatView(selectedName = "Chat") {
    messagesListView?.classList.remove("active");
    messagesChatView?.classList.add("active");
    updateMessagesHeader(true, selectedName);
  }

  function closeComposer() {
    if (!composerOverlay || !composerModal) return;
    composerOverlay.classList.remove("open");
    composerModal.classList.remove("open");
    composerModal.setAttribute("aria-hidden", "true");

    if (composerInput) {
      composerInput.style.height = "";
      composerInput.style.overflowY = "hidden";
    }

    unlockBodyScroll();
  }

  function openComposer() {
    if (!composerOverlay || !composerModal) return;

    closeMessages();
    composerOverlay.classList.add("open");
    composerModal.classList.add("open");
    composerModal.setAttribute("aria-hidden", "false");
    lockBodyScroll();

    if (composerInput) {
      composerInput.focus();
      autoResizeTextarea(composerInput, 260);
    }
  }

  function closeMessages() {
    if (!messagesOverlay || !messagesModal) return;

    saveDraftForActiveUser();

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
    renderThreads();
    lockBodyScroll();
  }

  function updateComposerState() {
    if (!composerInput || !composerSubmit) return;

    const hasText = composerInput.value.trim().length > 0;
    const hasMedia = composerPreview && composerPreview.children.length > 0;

    composerSubmit.classList.toggle("ready", hasText || hasMedia);
  }

  function updateMessagesState() {
    if (!messagesInput || !messagesSend) return;

    const hasText = messagesInput.value.trim().length > 0;
    const hasMedia = messagesPreview && messagesPreview.children.length > 0;

    messagesSend.classList.toggle("ready", hasText || hasMedia);
  }

  function saveDraftForActiveUser() {
    if (!messagesInput || !activeChatUser) return;
    ensureUserExists(activeChatUser);
    users[activeChatUser].draft = messagesInput.value;
    saveUsers();
  }

  function restoreDraftForActiveUser() {
    if (!messagesInput || !activeChatUser) return;
    ensureUserExists(activeChatUser);
    messagesInput.value = users[activeChatUser].draft || "";
    autoResizeTextarea(messagesInput, 180);
    updateMessagesState();
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

  function createMessage({ type, text = "", media = null }) {
    return {
      id: crypto.randomUUID(),
      type,
      text,
      media,
      createdAt: Date.now()
    };
  }

  function queueFakeReply(userName) {
    const replyPool = fakeReplies[userName];
    if (!replyPool?.length) return;

    if (pendingReplyTimeouts.has(userName)) {
      clearTimeout(pendingReplyTimeouts.get(userName));
    }

    const timeoutId = window.setTimeout(() => {
      ensureUserExists(userName);

      const text = replyPool[Math.floor(Math.random() * replyPool.length)];
      users[userName].messages.push(createMessage({ type: "incoming", text }));

      if (activeChatUser === userName && messagesModal?.classList.contains("open")) {
        users[userName].unread = 0;
        renderActiveChat();
      } else {
        users[userName].unread += 1;
      }

      if (userName === "Jason") {
        users[userName].status = "online";
      }

      saveUsers();
      renderThreads();

      pendingReplyTimeouts.delete(userName);
    }, 2500 + Math.floor(Math.random() * 2500));

    pendingReplyTimeouts.set(userName, timeoutId);
  }

  function handleSendMessage() {
    const messageText = messagesInput?.value.trim() || "";
    const hasMedia = messagesPreview && messagesPreview.children.length > 0;

    if (!messageText && !hasMedia) return;
    if (!activeChatUser) return;

    ensureUserExists(activeChatUser);

    if (messageText) {
      users[activeChatUser].messages.push(
        createMessage({
          type: "outgoing",
          text: messageText
        })
      );
    }

    if (hasMedia) {
      Array.from(messagesPreview.children).forEach((node) => {
        if (node.tagName === "IMG") {
          users[activeChatUser].messages.push(
            createMessage({
              type: "outgoing",
              media: {
                type: "image",
                src: node.src,
                alt: node.alt || "Shared image"
              }
            })
          );
        } else if (node.tagName === "VIDEO") {
          users[activeChatUser].messages.push(
            createMessage({
              type: "outgoing",
              media: {
                type: "video",
                src: node.src
              }
            })
          );
        }
      });
    }

    users[activeChatUser].draft = "";
    users[activeChatUser].unread = 0;

    if (messagesInput) {
      messagesInput.value = "";
      autoResizeTextarea(messagesInput, 180);
    }

    if (messagesPreview) {
      messagesPreview.innerHTML = "";
      messagesPreview.classList.remove("has-media");
    }

    updateMessagesState();
    saveUsers();
    renderThreads();
    renderActiveChat();

    messagesInput?.focus();

    queueFakeReply(activeChatUser);
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
    messagesBack.addEventListener("click", showMessagesListView);
  }

  if (splitToggle && messagesModal) {
    splitToggle.addEventListener("click", () => {
      messagesModal.classList.toggle("split-mode");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeComposer();
      closeMessages();
    }
  });

  if (composerInput) {
    composerInput.addEventListener("input", () => {
      autoResizeTextarea(composerInput, 260);
      updateComposerState();
    });
  }

  if (messagesInput) {
    messagesInput.addEventListener("input", () => {
      saveDraftForActiveUser();
      autoResizeTextarea(messagesInput, 180);
      updateMessagesState();
    });

    messagesInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }

  if (messagesSend) {
    messagesSend.addEventListener("click", handleSendMessage);
  }

  if (messagesSearchInput) {
    messagesSearchInput.addEventListener("input", (e) => {
      currentThreadFilter = e.target.value.trim();
      renderThreads();
    });
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

      composerPreview.classList.toggle("has-media", composerPreview.children.length > 0);
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

      messagesPreview.classList.toggle("has-media", messagesPreview.children.length > 0);
      updateMessagesState();
    });
  }

  if (emojiBtn && composerInput) {
    emojiBtn.addEventListener("click", () => {
      composerInput.value += " 😊";
      composerInput.focus();
      autoResizeTextarea(composerInput, 260);
      updateComposerState();
    });
  }

  if (tagBtn && composerInput) {
    tagBtn.addEventListener("click", () => {
      composerInput.value += " @";
      composerInput.focus();
      autoResizeTextarea(composerInput, 260);
      updateComposerState();
    });
  }

  if (gifBtn && composerInput) {
    gifBtn.addEventListener("click", () => {
      composerInput.value += " [GIF] ";
      composerInput.focus();
      autoResizeTextarea(composerInput, 260);
      updateComposerState();
    });
  }

  if (locationBtn && composerInput) {
    locationBtn.addEventListener("click", () => {
      composerInput.value += " 📍";
      composerInput.focus();
      autoResizeTextarea(composerInput, 260);
      updateComposerState();
    });
  }

  if (messagesEmojiBtn && messagesInput) {
    messagesEmojiBtn.addEventListener("click", () => {
      messagesInput.value += " 😊";
      messagesInput.focus();
      autoResizeTextarea(messagesInput, 180);
      saveDraftForActiveUser();
      updateMessagesState();
    });
  }

  if (messagesGifBtn && messagesInput) {
    messagesGifBtn.addEventListener("click", () => {
      messagesInput.value += " [GIF] ";
      messagesInput.focus();
      autoResizeTextarea(messagesInput, 180);
      saveDraftForActiveUser();
      updateMessagesState();
    });
  }

  if (messagesLocationBtn && messagesInput) {
    messagesLocationBtn.addEventListener("click", () => {
      messagesInput.value += " 📍";
      messagesInput.focus();
      autoResizeTextarea(messagesInput, 180);
      saveDraftForActiveUser();
      updateMessagesState();
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
    const composerOpen = composerModal?.classList.contains("open");
    const messagesOpen = messagesModal?.classList.contains("open");

    if (composerOpen || messagesOpen) return;

    if (currentScrollY <= 10) {
      navbar?.classList.remove("hide-top");
      bottomNav?.classList.remove("hide-bottom");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY) {
      navbar?.classList.add("hide-top");
      bottomNav?.classList.add("hide-bottom");
    } else {
      navbar?.classList.remove("hide-top");
      bottomNav?.classList.remove("hide-bottom");
    }

    lastScrollY = currentScrollY;
  });

  setInterval(() => {
    renderThreads();
    if (messagesHeaderTitle?.textContent && messagesHeaderTitle.textContent !== "Messages" && activeChatUser) {
      updateMessagesHeader(true, activeChatUser);
    }
  }, 60000);
});
