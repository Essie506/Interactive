document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "interactiveFitnessMessages_v3";

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

  function createId() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function cloneData(value) {
    if (window.structuredClone) return window.structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  const defaultUsers = {
    Jason: {
      status: "online",
      unread: 0,
      draft: "",
      messages: [
        {
          id: createId(),
          type: "incoming",
          text: "Hey, are you around later?",
          createdAt: Date.now() - 2 * 60 * 1000
        },
        {
          id: createId(),
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
          id: createId(),
          type: "incoming",
          text: "Nice work on your run 🔥",
          createdAt: Date.now() - 60 * 60 * 1000
        },
        {
          id: createId(),
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

  const drawerMediumBtn = document.getElementById("drawerMediumBtn");
  const drawerPopoutBtn = document.getElementById("drawerPopoutBtn");
  const drawerMinimizeBtn = document.getElementById("drawerMinimizeBtn");

  const messagesPopup = document.getElementById("messagesPopup");
  const popupMessageChat = document.getElementById("popupMessageChat");
  const popupHeaderTitle = document.getElementById("popupHeaderTitle");
  const popupMessagesInput = document.getElementById("popupMessagesInput");
  const popupMessagesSend = document.getElementById("popupMessagesSend");
  const popupMinimizeBtn = document.getElementById("popupMinimizeBtn");
  const popupDrawerBtn = document.getElementById("popupDrawerBtn");
  const popupPopoutBtn = document.getElementById("popupPopoutBtn");
  const popupCloseBtn = document.getElementById("popupCloseBtn");

  const messagesMinimized = document.getElementById("messagesMinimized");
  const minimizedLabel = document.getElementById("minimizedLabel");

  const messagesPopout = document.getElementById("messagesPopout");
  const popoutMessageChat = document.getElementById("popoutMessageChat");
  const popoutHeaderTitle = document.getElementById("popoutHeaderTitle");
  const popoutMessagesInput = document.getElementById("popoutMessagesInput");
  const popoutMessagesSend = document.getElementById("popoutMessagesSend");
  const popoutMinimizeBtn = document.getElementById("popoutMinimizeBtn");
  const popoutDrawerBtn = document.getElementById("popoutDrawerBtn");
  const popoutFullscreenBtn = document.getElementById("popoutFullscreenBtn");
  const popoutCloseBtn = document.getElementById("popoutCloseBtn");

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

  const navbar = document.querySelector(".navbar");
  const bottomNav = document.querySelector(".bottom-nav");

  let users = loadUsers();
  let currentThreadFilter = "";
  let lastScrollY = window.scrollY;
  const pendingReplyTimeouts = new Map();

  const messagingState = {
    mode: "closed", // closed | drawer | popup | minimized | popout | fullscreen
    drawerView: "thread-list", // thread-list | thread-chat
    activeThreadId: getInitialActiveChatUser()
  };

  renderFeed();
  ensureUserExists(messagingState.activeThreadId);
  renderThreads();
  restoreDraftAcrossInputs();
  renderMessagingUI();
  updateComposerState();
  updateAllMessageSendStates();

  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneData(defaultUsers);

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return cloneData(defaultUsers);
      }

      return mergeWithDefaults(parsed);
    } catch {
      return cloneData(defaultUsers);
    }
  }

  function mergeWithDefaults(saved) {
    const merged = cloneData(defaultUsers);

    Object.entries(saved).forEach(([userName, data]) => {
      merged[userName] = {
        status: typeof data?.status === "string" ? data.status : "offline",
        unread: Number.isFinite(data?.unread) ? data.unread : 0,
        draft: typeof data?.draft === "string" ? data.draft : "",
        messages: Array.isArray(data?.messages) ? data.messages : []
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
    if (!userName) return;

    if (!users[userName]) {
      users[userName] = {
        status: "offline",
        unread: 0,
        draft: "",
        messages: []
      };
    }
  }

  function getActiveChatUser() {
    const userName = messagingState.activeThreadId || "Jason";
    ensureUserExists(userName);
    return userName;
  }

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    const composerOpen = composerModal?.classList.contains("open");
    const drawerOpen = messagesModal?.classList.contains("open");

    if (!composerOpen && !drawerOpen) {
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
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
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
    return getLastMessage(userName)?.createdAt ?? 0;
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
    return diffDay === 1 ? "1d" : `${diffDay}d`;
  }

  function getPreviewText(message) {
    if (!message) return "No messages yet";
    if (message.text && message.text.trim()) return message.text.trim();
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

  function renderThreads() {
    if (!messagesList) return;

    const activeUser = getActiveChatUser();
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

      if (userName === activeUser) {
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
        openThread(userName, "drawer");
      });

      messagesList.appendChild(thread);
    });
  }

  function createMessage({ type, text = "", media = null }) {
    return {
      id: createId(),
      type,
      text,
      media,
      createdAt: Date.now()
    };
  }

  function createMessageBubble(message) {
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

    return bubble;
  }

  function renderChatBody(container, userName) {
    if (!container || !userName) return;

    const messages = getUserMessages(userName);
    container.innerHTML = "";

    messages.forEach((message) => {
      container.appendChild(createMessageBubble(message));
    });

    container.scrollTop = container.scrollHeight;
  }

  function renderAllChatBodies() {
    const activeUser = getActiveChatUser();
    renderChatBody(messageChat, activeUser);
    renderChatBody(popupMessageChat, activeUser);
    renderChatBody(popoutMessageChat, activeUser);
  }

  function updateMessagesHeader(isChatView, title = "Messages") {
    if (messagesHeaderTitle) {
      messagesHeaderTitle.textContent = title;
    }

    if (messagesBack) {
      messagesBack.style.display = isChatView ? "flex" : "none";
    }

    if (splitToggle) {
      splitToggle.style.display = "flex";
    }

    if (drawerMediumBtn) {
      drawerMediumBtn.style.display = "flex";
    }

    if (drawerPopoutBtn) {
      drawerPopoutBtn.style.display = "flex";
    }

    if (drawerMinimizeBtn) {
      drawerMinimizeBtn.style.display = "flex";
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

  function setAllMessageInputsValue(value) {
    [messagesInput, popupMessagesInput, popoutMessagesInput].forEach((input) => {
      if (!input) return;
      input.value = value;
      autoResizeTextarea(input, 180);
    });
  }

  function clearAllMessageInputs() {
    setAllMessageInputsValue("");
  }

  function restoreDraftAcrossInputs() {
    const activeUser = getActiveChatUser();
    const draft = users[activeUser]?.draft || "";
    setAllMessageInputsValue(draft);
    updateAllMessageSendStates();
  }

  function saveDraftForActiveUser(value) {
    const activeUser = getActiveChatUser();
    ensureUserExists(activeUser);
    users[activeUser].draft = value;
    saveUsers();
  }

  function syncDraftFromInput(sourceInput) {
    const value = sourceInput?.value || "";
    setAllMessageInputsValue(value);
    saveDraftForActiveUser(value);
    updateAllMessageSendStates();
  }

  function updateComposerState() {
    if (!composerInput || !composerSubmit) return;

    const hasText = composerInput.value.trim().length > 0;
    const hasMedia = composerPreview && composerPreview.children.length > 0;
    composerSubmit.classList.toggle("ready", hasText || hasMedia);
  }

  function updateSendButtonState(inputEl, previewEl, sendBtn) {
    if (!inputEl || !sendBtn) return;

    const hasText = inputEl.value.trim().length > 0;
    const hasMedia = previewEl && previewEl.children.length > 0;
    sendBtn.classList.toggle("ready", hasText || hasMedia);
  }

  function updateAllMessageSendStates() {
    updateSendButtonState(messagesInput, messagesPreview, messagesSend);
    updateSendButtonState(popupMessagesInput, null, popupMessagesSend);
    updateSendButtonState(popoutMessagesInput, null, popoutMessagesSend);
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

  function focusActiveMessagingInput() {
    let targetInput = null;

    if (messagingState.mode === "drawer") targetInput = messagesInput;
    if (messagingState.mode === "popup") targetInput = popupMessagesInput;
    if (messagingState.mode === "popout" || messagingState.mode === "fullscreen") {
      targetInput = popoutMessagesInput;
    }

    if (targetInput) {
      setTimeout(() => targetInput.focus(), 80);
    }
  }

  function hideAllMessagingModes() {
    messagesOverlay?.classList.remove("open");

    if (messagesModal) {
      messagesModal.classList.remove("open");
      messagesModal.setAttribute("aria-hidden", "true");
    }

    if (messagesPopup) {
      messagesPopup.classList.remove("open");
      messagesPopup.setAttribute("aria-hidden", "true");
    }

    if (messagesMinimized) {
      messagesMinimized.classList.remove("open");
      messagesMinimized.setAttribute("aria-hidden", "true");
    }

    if (messagesPopout) {
      messagesPopout.classList.remove("open");
      messagesPopout.classList.remove("fullscreen");
      messagesPopout.setAttribute("aria-hidden", "true");
    }
  }

  function renderMessagingTitles() {
    const activeUser = getActiveChatUser();

    if (popupHeaderTitle) popupHeaderTitle.textContent = activeUser;
    if (popoutHeaderTitle) popoutHeaderTitle.textContent = activeUser;
    if (minimizedLabel) minimizedLabel.textContent = activeUser;
  }

  function renderMessagingUI() {
    const activeUser = getActiveChatUser();

    renderThreads();
    renderMessagingTitles();
    restoreDraftAcrossInputs();
    renderAllChatBodies();
    hideAllMessagingModes();

    switch (messagingState.mode) {
      case "drawer":
        messagesOverlay?.classList.add("open");
        messagesModal?.classList.add("open");
        messagesModal?.setAttribute("aria-hidden", "false");

        if (messagingState.drawerView === "thread-chat") {
          showMessagesChatView(activeUser);
        } else {
          showMessagesListView();
        }

        lockBodyScroll();
        focusActiveMessagingInput();
        break;

      case "popup":
        messagesPopup?.classList.add("open");
        messagesPopup?.setAttribute("aria-hidden", "false");
        unlockBodyScroll();
        focusActiveMessagingInput();
        break;

      case "minimized":
        messagesMinimized?.classList.add("open");
        messagesMinimized?.setAttribute("aria-hidden", "false");
        unlockBodyScroll();
        break;

      case "popout":
        messagesPopout?.classList.add("open");
        messagesPopout?.setAttribute("aria-hidden", "false");
        unlockBodyScroll();
        focusActiveMessagingInput();
        break;

      case "fullscreen":
        messagesPopout?.classList.add("open");
        messagesPopout?.classList.add("fullscreen");
        messagesPopout?.setAttribute("aria-hidden", "false");
        unlockBodyScroll();
        focusActiveMessagingInput();
        break;

      default:
        unlockBodyScroll();
        break;
    }

    updateAllMessageSendStates();
  }

  function setMessagingMode(mode, options = {}) {
    if (typeof options.threadId === "string" && options.threadId.trim()) {
      messagingState.activeThreadId = options.threadId;
      ensureUserExists(messagingState.activeThreadId);
      users[messagingState.activeThreadId].unread = 0;
      saveUsers();
    }

    if (typeof options.drawerView === "string") {
      messagingState.drawerView = options.drawerView;
    }

    messagingState.mode = mode;
    renderMessagingUI();
  }

  function openDrawer(view = "thread-list", threadId = getActiveChatUser()) {
    closeComposer();
    setMessagingMode("drawer", {
      drawerView: view,
      threadId
    });
  }

  function openPopup(threadId = getActiveChatUser()) {
    setMessagingMode("popup", { threadId });
  }

  function openPopout(threadId = getActiveChatUser()) {
    setMessagingMode("popout", { threadId });
  }

  function openFullscreen(threadId = getActiveChatUser()) {
    setMessagingMode("fullscreen", { threadId });
  }

  function minimizeMessages() {
    setMessagingMode("minimized", {
      threadId: getActiveChatUser()
    });
  }

  function closeMessagesEverywhere() {
    const activeInput = getPreferredInputForCurrentMode();
    if (activeInput) {
      saveDraftForActiveUser(activeInput.value);
    }
    setMessagingMode("closed");
  }

  function closeMessages() {
    closeMessagesEverywhere();
  }

  function openMessages() {
    const activeUser = getActiveChatUser();

    if (messagingState.mode === "minimized") {
      openPopup(activeUser);
      return;
    }

    if (messagingState.mode === "popup") {
      openPopup(activeUser);
      return;
    }

    if (messagingState.mode === "popout" || messagingState.mode === "fullscreen") {
      openPopout(activeUser);
      return;
    }

    openDrawer("thread-list", activeUser);
  }

  function openThread(userName, source = "drawer") {
    ensureUserExists(userName);
    users[userName].unread = 0;
    saveUsers();

    if (source === "popup") {
      openPopup(userName);
      return;
    }

    if (source === "popout") {
      openPopout(userName);
      return;
    }

    openDrawer("thread-chat", userName);
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

    closeMessagesEverywhere();
    composerOverlay.classList.add("open");
    composerModal.classList.add("open");
    composerModal.setAttribute("aria-hidden", "false");
    lockBodyScroll();

    if (composerInput) {
      composerInput.focus();
      autoResizeTextarea(composerInput, 260);
    }
  }

  function getPreferredInputForCurrentMode() {
    if (messagingState.mode === "popup") return popupMessagesInput;
    if (messagingState.mode === "popout" || messagingState.mode === "fullscreen") {
      return popoutMessagesInput;
    }
    return messagesInput;
  }

  function collectMediaFromPreview(previewEl) {
    if (!previewEl) return [];

    return Array.from(previewEl.children)
      .map((node) => {
        if (node.tagName === "IMG") {
          return {
            type: "image",
            src: node.src,
            alt: node.alt || "Shared image"
          };
        }

        if (node.tagName === "VIDEO") {
          return {
            type: "video",
            src: node.src
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  function clearDrawerMediaPreview() {
    if (!messagesPreview) return;
    messagesPreview.innerHTML = "";
    messagesPreview.classList.remove("has-media");
    updateAllMessageSendStates();
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
      users[userName].messages.push(
        createMessage({
          type: "incoming",
          text
        })
      );

      const isViewingSameUser = getActiveChatUser() === userName;
      const isConversationOpen = ["drawer", "popup", "popout", "fullscreen"].includes(messagingState.mode);

      if (isViewingSameUser && isConversationOpen) {
        users[userName].unread = 0;
      } else {
        users[userName].unread += 1;
      }

      if (userName === "Jason") {
        users[userName].status = "online";
      }

      saveUsers();
      renderMessagingUI();
      pendingReplyTimeouts.delete(userName);
    }, 2500 + Math.floor(Math.random() * 2500));

    pendingReplyTimeouts.set(userName, timeoutId);
  }

  function handleSendMessage(source = "drawer") {
    const activeUser = getActiveChatUser();

    const inputEl =
      source === "popup"
        ? popupMessagesInput
        : source === "popout"
          ? popoutMessagesInput
          : messagesInput;

    const previewEl = source === "drawer" ? messagesPreview : null;

    const messageText = inputEl?.value.trim() || "";
    const mediaItems = collectMediaFromPreview(previewEl);
    const hasMedia = mediaItems.length > 0;

    if (!messageText && !hasMedia) return;

    ensureUserExists(activeUser);

    if (messageText) {
      users[activeUser].messages.push(
        createMessage({
          type: "outgoing",
          text: messageText
        })
      );
    }

    mediaItems.forEach((media) => {
      users[activeUser].messages.push(
        createMessage({
          type: "outgoing",
          media
        })
      );
    });

    users[activeUser].draft = "";
    users[activeUser].unread = 0;

    clearAllMessageInputs();
    clearDrawerMediaPreview();
    saveUsers();
    renderMessagingUI();
    focusActiveMessagingInput();
    queueFakeReply(activeUser);
  }

  function addTextToMessageDraft(textToAppend) {
    const activeInput = getPreferredInputForCurrentMode();
    if (!activeInput) return;

    activeInput.value += textToAppend;
    autoResizeTextarea(activeInput, 180);
    syncDraftFromInput(activeInput);
    activeInput.focus();
  }

  function bindMessageInput(inputEl, sourceName) {
    if (!inputEl) return;

    inputEl.addEventListener("input", () => {
      autoResizeTextarea(inputEl, 180);
      syncDraftFromInput(inputEl);
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(sourceName);
      }
    });
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
    messagesClose.addEventListener("click", closeMessagesEverywhere);
  }

  if (messagesOverlay) {
    messagesOverlay.addEventListener("click", closeMessagesEverywhere);
  }

  if (messagesBack) {
    messagesBack.addEventListener("click", () => {
      messagingState.drawerView = "thread-list";
      renderMessagingUI();
    });
  }

  if (splitToggle && messagesModal) {
    splitToggle.addEventListener("click", () => {
      messagesModal.classList.toggle("split-mode");
    });
  }

  if (drawerMediumBtn) {
    drawerMediumBtn.addEventListener("click", () => {
      openPopup(getActiveChatUser());
    });
  }

  if (drawerPopoutBtn) {
    drawerPopoutBtn.addEventListener("click", () => {
      openPopout(getActiveChatUser());
    });
  }

  if (drawerMinimizeBtn) {
    drawerMinimizeBtn.addEventListener("click", () => {
      minimizeMessages();
    });
  }

  if (popupMinimizeBtn) {
    popupMinimizeBtn.addEventListener("click", () => {
      minimizeMessages();
    });
  }

  if (popupDrawerBtn) {
    popupDrawerBtn.addEventListener("click", () => {
      openDrawer("thread-chat", getActiveChatUser());
    });
  }

  if (popupPopoutBtn) {
    popupPopoutBtn.addEventListener("click", () => {
      openPopout(getActiveChatUser());
    });
  }

  if (popupCloseBtn) {
    popupCloseBtn.addEventListener("click", () => {
      closeMessagesEverywhere();
    });
  }

  if (messagesMinimized) {
    messagesMinimized.addEventListener("click", () => {
      openPopup(getActiveChatUser());
    });
  }

  if (popoutMinimizeBtn) {
    popoutMinimizeBtn.addEventListener("click", () => {
      minimizeMessages();
    });
  }

  if (popoutDrawerBtn) {
    popoutDrawerBtn.addEventListener("click", () => {
      openDrawer("thread-chat", getActiveChatUser());
    });
  }

  if (popoutFullscreenBtn) {
    popoutFullscreenBtn.addEventListener("click", () => {
      if (messagingState.mode === "fullscreen") {
        openPopout(getActiveChatUser());
      } else {
        openFullscreen(getActiveChatUser());
      }
    });
  }

  if (popoutCloseBtn) {
    popoutCloseBtn.addEventListener("click", () => {
      closeMessagesEverywhere();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeComposer();
      closeMessagesEverywhere();
    }
  });

  if (composerInput) {
    composerInput.addEventListener("input", () => {
      autoResizeTextarea(composerInput, 260);
      updateComposerState();
    });
  }

  bindMessageInput(messagesInput, "drawer");
  bindMessageInput(popupMessagesInput, "popup");
  bindMessageInput(popoutMessagesInput, "popout");

  if (messagesSend) {
    messagesSend.addEventListener("click", () => handleSendMessage("drawer"));
  }

  if (popupMessagesSend) {
    popupMessagesSend.addEventListener("click", () => handleSendMessage("popup"));
  }

  if (popoutMessagesSend) {
    popoutMessagesSend.addEventListener("click", () => handleSendMessage("popout"));
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
      updateAllMessageSendStates();
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

  if (messagesEmojiBtn) {
    messagesEmojiBtn.addEventListener("click", () => addTextToMessageDraft(" 😊"));
  }

  if (messagesGifBtn) {
    messagesGifBtn.addEventListener("click", () => addTextToMessageDraft(" [GIF] "));
  }

  if (messagesLocationBtn) {
    messagesLocationBtn.addEventListener("click", () => addTextToMessageDraft(" 📍"));
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

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const composerOpen = composerModal?.classList.contains("open");
    const drawerOpen = messagesModal?.classList.contains("open");

    if (composerOpen || drawerOpen) return;

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

  window.setInterval(() => {
    renderThreads();

    if (messagingState.mode === "drawer" && messagingState.drawerView === "thread-chat") {
      updateMessagesHeader(true, getActiveChatUser());
    }
  }, 60000);
});
