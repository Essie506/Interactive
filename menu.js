document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "interactiveFitnessMessages_v4";

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
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
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
  const messagesBack = document.getElementById("messagesBack");
  const splitToggle = document.getElementById("splitToggle");
  const drawerMediumBtn = document.getElementById("drawerMediumBtn");
  const drawerPopoutBtn = document.getElementById("drawerPopoutBtn");
  const drawerMinimizeBtn = document.getElementById("drawerMinimizeBtn");
  const messagesHeaderTitle = document.getElementById("messagesHeaderTitle");

  const messagesListView = document.getElementById("messagesListView");
  const messagesChatView = document.getElementById("messagesChatView");
  const messagesList = document.getElementById("messagesList");
  const messagesSearchInput = document.getElementById("messagesSearchInput");
  const messageChat = document.getElementById("messageChat");
  const messagesInput = document.getElementById("messagesInput");
  const messagesSend = document.getElementById("messagesSend");
  const messagesPreview = document.getElementById("messagesPreview");
  const messagesMediaUpload = document.getElementById("messagesMediaUpload");

  const messagesMedium = document.getElementById("messagesMedium");
  const mediumBack = document.getElementById("mediumBack");
  const mediumHeaderTitle = document.getElementById("mediumHeaderTitle");
  const mediumSplitToggle = document.getElementById("mediumSplitToggle");
  const mediumMaxBtn = document.getElementById("mediumMaxBtn");
  const mediumPopoutBtn = document.getElementById("mediumPopoutBtn");
  const mediumMinimizeBtn = document.getElementById("mediumMinimizeBtn");
  const mediumCloseBtn = document.getElementById("mediumCloseBtn");
  const mediumListView = document.getElementById("mediumListView");
  const mediumChatView = document.getElementById("mediumChatView");
  const mediumMessagesList = document.getElementById("mediumMessagesList");
  const mediumSearchInput = document.getElementById("mediumSearchInput");
  const mediumMessageChat = document.getElementById("mediumMessageChat");
  const mediumMessagesInput = document.getElementById("mediumMessagesInput");
  const mediumMessagesSend = document.getElementById("mediumMessagesSend");

  const messagesMinimizedBar = document.getElementById("messagesMinimizedBar");
  const minimizedLabel = document.getElementById("minimizedLabel");

  const messagesPopout = document.getElementById("messagesPopout");
  const popoutBack = document.getElementById("popoutBack");
  const popoutHeaderTitle = document.getElementById("popoutHeaderTitle");
  const popoutSplitToggle = document.getElementById("popoutSplitToggle");
  const popoutDrawerBtn = document.getElementById("popoutDrawerBtn");
  const popoutFullscreenBtn = document.getElementById("popoutFullscreenBtn");
  const popoutMinimizeBtn = document.getElementById("popoutMinimizeBtn");
  const popoutCloseBtn = document.getElementById("popoutCloseBtn");
  const popoutListView = document.getElementById("popoutListView");
  const popoutChatView = document.getElementById("popoutChatView");
  const popoutMessagesList = document.getElementById("popoutMessagesList");
  const popoutSearchInput = document.getElementById("popoutSearchInput");
  const popoutMessageChat = document.getElementById("popoutMessageChat");
  const popoutMessagesInput = document.getElementById("popoutMessagesInput");
  const popoutMessagesSend = document.getElementById("popoutMessagesSend");

  const topSearchToggle = document.getElementById("searchToggle");
  const bottomSearchToggle = document.getElementById("bottomSearchToggle");
  const menuSearchInput = document.getElementById("menuSearchInput");
  const menu = document.querySelector(".menu");
  const menuOverlay = document.getElementById("menuOverlay");
  const navbar = document.querySelector(".navbar");
  const bottomNav = document.querySelector(".bottom-nav");

  const emojiBtn = document.querySelector(".composer-tools .emoji-btn");
  const tagBtn = document.querySelector(".composer-tools .tag-btn");
  const gifBtn = document.querySelector(".composer-tools .gif-btn");
  const locationBtn = document.querySelector(".composer-tools .location-btn");

  const messagesEmojiBtn = document.querySelector(".messages-emoji-btn");
  const messagesGifBtn = document.querySelector(".messages-gif-btn");
  const messagesLocationBtn = document.querySelector(".messages-location-btn");

  const mediumEmojiBtn = document.querySelector(".medium-emoji-btn");
  const mediumGifBtn = document.querySelector(".medium-gif-btn");
  const mediumLocationBtn = document.querySelector(".medium-location-btn");

  const popoutEmojiBtn = document.querySelector(".popout-emoji-btn");
  const popoutGifBtn = document.querySelector(".popout-gif-btn");
  const popoutLocationBtn = document.querySelector(".popout-location-btn");

  let users = loadUsers();
  let currentThreadFilter = "";
  let lastScrollY = window.scrollY;
  const pendingReplyTimeouts = new Map();

  const messagingState = {
    mode: "closed", // closed | drawer | medium | popout | fullscreen | minimized
    lastOpenMode: "drawer",
    layout: "list", // list | chat | split
    activeThreadId: getInitialActiveChatUser()
  };

  renderFeed();
  ensureUserExists(messagingState.activeThreadId);
  renderMessagingUI();
  updateComposerState();
  updateAllMessageSendStates();

  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneData(defaultUsers);
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return cloneData(defaultUsers);
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

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function escapeAttribute(text) {
    return String(text ?? "").replace(/"/g, "&quot;");
  }

  function lockBodyScroll() {
    if (messagingState.mode === "drawer") {
      document.body.style.overflow = "hidden";
    }
  }

  function unlockBodyScroll() {
    if (!composerModal?.classList.contains("open") && messagingState.mode !== "drawer") {
      document.body.style.overflow = "";
    }
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

  function renderThreadList(container, sourceName) {
    if (!container) return;

    const activeUser = getActiveChatUser();
    const names = sortedUserNames().filter((userName) => {
      if (!currentThreadFilter) return true;
      return userName.toLowerCase().includes(currentThreadFilter.toLowerCase());
    });

    container.innerHTML = "";

    names.forEach((userName) => {
      ensureUserExists(userName);
      const user = users[userName];
      const lastMessage = getLastMessage(userName);

      const thread = document.createElement("button");
      thread.type = "button";
      thread.className = "message-thread";
      thread.dataset.user = userName;

      if (userName === activeUser && messagingState.layout !== "list") {
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

            <span class="message-thread-time">${escapeHtml(formatRelativeTime(lastMessage?.createdAt))}</span>
          </div>

          <div class="message-thread-preview">${escapeHtml(getPreviewText(lastMessage))}</div>
        </div>
      `;

      thread.addEventListener("click", () => {
        openThread(userName, sourceName);
      });

      container.appendChild(thread);
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
    container.innerHTML = "";

    const messages = getUserMessages(userName);
    messages.forEach((message) => {
      container.appendChild(createMessageBubble(message));
    });

    container.scrollTop = container.scrollHeight;
  }

  function renderAllChatBodies() {
    const activeUser = getActiveChatUser();
    renderChatBody(messageChat, activeUser);
    renderChatBody(mediumMessageChat, activeUser);
    renderChatBody(popoutMessageChat, activeUser);
  }

  function updateHeaderTitles() {
    const activeUser = getActiveChatUser();
    const title = messagingState.layout === "list" ? "Messages" : activeUser;

    if (messagesHeaderTitle) messagesHeaderTitle.textContent = title;
    if (mediumHeaderTitle) mediumHeaderTitle.textContent = title;
    if (popoutHeaderTitle) popoutHeaderTitle.textContent = title;
    if (minimizedLabel) minimizedLabel.textContent = messagingState.layout === "list" ? "Messages" : activeUser;
  }

  function setViewState(listView, chatView, layout) {
    if (!listView || !chatView) return;

    listView.classList.remove("active");
    chatView.classList.remove("active");

    if (layout === "split") {
      listView.classList.add("active");
      chatView.classList.add("active");
    } else if (layout === "chat") {
      chatView.classList.add("active");
    } else {
      listView.classList.add("active");
    }
  }

  function applySplitClasses() {
    messagesModal?.classList.toggle("split-mode", messagingState.layout === "split");
    messagesMedium?.classList.toggle("split-mode", messagingState.layout === "split");
    messagesPopout?.classList.toggle("split-mode", messagingState.layout === "split");
  }

  function updateBackButtons() {
    const shouldShowBack = messagingState.layout === "chat" || messagingState.layout === "split";

    [messagesBack, mediumBack, popoutBack].forEach((btn) => {
      if (!btn) return;
      btn.style.display = shouldShowBack ? "flex" : "none";
    });
  }

  function setAllMessageInputsValue(value) {
    [messagesInput, mediumMessagesInput, popoutMessagesInput].forEach((input) => {
      if (!input) return;
      input.value = value;
      autoResizeTextarea(input, 180);
    });
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
    updateSendButtonState(mediumMessagesInput, null, mediumMessagesSend);
    updateSendButtonState(popoutMessagesInput, null, popoutMessagesSend);
  }

  function getPreferredInputForCurrentMode() {
    if (messagingState.mode === "medium") return mediumMessagesInput;
    if (messagingState.mode === "popout" || messagingState.mode === "fullscreen") return popoutMessagesInput;
    return messagesInput;
  }

  function focusActiveMessagingInput() {
    const input = getPreferredInputForCurrentMode();
    if (!input) return;
    if (messagingState.layout === "list") return;
    setTimeout(() => input.focus(), 80);
  }

  function hideAllMessagingModes() {
    messagesOverlay?.classList.remove("open");

    messagesModal?.classList.remove("open");
    messagesModal?.setAttribute("aria-hidden", "true");

    messagesMedium?.classList.remove("open");
    messagesMedium?.setAttribute("aria-hidden", "true");

    messagesPopout?.classList.remove("open");
    messagesPopout?.classList.remove("fullscreen");
    messagesPopout?.setAttribute("aria-hidden", "true");

    messagesMinimizedBar?.classList.remove("open");
    messagesMinimizedBar?.setAttribute("aria-hidden", "true");
  }

  function renderMessagingUI() {
    renderThreadList(messagesList, "drawer");
    renderThreadList(mediumMessagesList, "medium");
    renderThreadList(popoutMessagesList, "popout");

    renderAllChatBodies();
    updateHeaderTitles();
    updateBackButtons();
    restoreDraftAcrossInputs();
    applySplitClasses();

    setViewState(messagesListView, messagesChatView, messagingState.layout);
    setViewState(mediumListView, mediumChatView, messagingState.layout);
    setViewState(popoutListView, popoutChatView, messagingState.layout);

    hideAllMessagingModes();

    switch (messagingState.mode) {
      case "drawer":
        messagesOverlay?.classList.add("open");
        messagesModal?.classList.add("open");
        messagesModal?.setAttribute("aria-hidden", "false");
        lockBodyScroll();
        break;

      case "medium":
        messagesMedium?.classList.add("open");
        messagesMedium?.setAttribute("aria-hidden", "false");
        unlockBodyScroll();
        break;

      case "popout":
        messagesPopout?.classList.add("open");
        messagesPopout?.setAttribute("aria-hidden", "false");
        unlockBodyScroll();
        break;

      case "fullscreen":
        messagesPopout?.classList.add("open");
        messagesPopout?.classList.add("fullscreen");
        messagesPopout?.setAttribute("aria-hidden", "false");
        unlockBodyScroll();
        break;

      case "minimized":
        messagesMinimizedBar?.classList.add("open");
        messagesMinimizedBar?.setAttribute("aria-hidden", "false");
        unlockBodyScroll();
        break;

      default:
        unlockBodyScroll();
        break;
    }

    updateAllMessageSendStates();
    focusActiveMessagingInput();
  }

  function setMessagingMode(mode, options = {}) {
    if (typeof options.threadId === "string" && options.threadId.trim()) {
      messagingState.activeThreadId = options.threadId;
      ensureUserExists(messagingState.activeThreadId);
      users[messagingState.activeThreadId].unread = 0;
      saveUsers();
    }

    if (typeof options.layout === "string") {
      messagingState.layout = options.layout;
    }

    if (mode !== "closed" && mode !== "minimized") {
      messagingState.lastOpenMode = mode;
    }

    messagingState.mode = mode;
    renderMessagingUI();
  }

  function openDrawer(layout = "list", threadId = getActiveChatUser()) {
    closeComposer();
    setMessagingMode("drawer", { layout, threadId });
  }

  function openMedium(layout = "list", threadId = getActiveChatUser()) {
    setMessagingMode("medium", { layout, threadId });
  }

  function openPopout(layout = "list", threadId = getActiveChatUser()) {
    setMessagingMode("popout", { layout, threadId });
  }

  function openFullscreen(layout = "list", threadId = getActiveChatUser()) {
    setMessagingMode("fullscreen", { layout, threadId });
  }

  function minimizeMessages() {
    const preferredMode =
      messagingState.mode === "closed" ? "drawer" : messagingState.mode;

    if (preferredMode !== "minimized") {
      messagingState.lastOpenMode = preferredMode;
    }

    setMessagingMode("minimized", {
      layout: messagingState.layout,
      threadId: getActiveChatUser()
    });
  }

  function restoreFromMinimized() {
    const mode = messagingState.lastOpenMode || "drawer";
    const layout = messagingState.layout || "list";
    const threadId = getActiveChatUser();

    if (mode === "medium") {
      openMedium(layout, threadId);
    } else if (mode === "popout") {
      openPopout(layout, threadId);
    } else if (mode === "fullscreen") {
      openFullscreen(layout, threadId);
    } else {
      openDrawer(layout, threadId);
    }
  }

  function closeMessagesEverywhere() {
    const activeInput = getPreferredInputForCurrentMode();
    if (activeInput) saveDraftForActiveUser(activeInput.value);
    setMessagingMode("closed");
  }

  function openMessages() {
    const activeUser = getActiveChatUser();

    if (messagingState.mode === "minimized") {
      restoreFromMinimized();
      return;
    }

    openDrawer("list", activeUser);
  }

  function openThread(userName, source = "drawer") {
    ensureUserExists(userName);
    users[userName].unread = 0;
    saveUsers();

    if (source === "medium") {
      openMedium("chat", userName);
      return;
    }

    if (source === "popout") {
      openPopout("chat", userName);
      return;
    }

    openDrawer("chat", userName);
  }

  function goBackToInbox() {
    const activeUser = getActiveChatUser();

    if (messagingState.mode === "medium") {
      openMedium("list", activeUser);
      return;
    }

    if (messagingState.mode === "popout") {
      openPopout("list", activeUser);
      return;
    }

    if (messagingState.mode === "fullscreen") {
      openFullscreen("list", activeUser);
      return;
    }

    openDrawer("list", activeUser);
  }

  function toggleSplitCurrentMode() {
    const nextLayout = messagingState.layout === "split" ? "list" : "split";
    const activeUser = getActiveChatUser();

    if (messagingState.mode === "medium") {
      openMedium(nextLayout, activeUser);
      return;
    }

    if (messagingState.mode === "popout") {
      openPopout(nextLayout, activeUser);
      return;
    }

    if (messagingState.mode === "fullscreen") {
      openFullscreen(nextLayout, activeUser);
      return;
    }

    openDrawer(nextLayout, activeUser);
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
    document.body.style.overflow = "hidden";

    if (composerInput) {
      composerInput.focus();
      autoResizeTextarea(composerInput, 260);
    }
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

      const isViewingSameUser =
        getActiveChatUser() === userName &&
        (messagingState.layout === "chat" || messagingState.layout === "split");

      const isConversationOpen =
        ["drawer", "medium", "popout", "fullscreen"].includes(messagingState.mode);

      if (isViewingSameUser && isConversationOpen) {
        users[userName].unread = 0;
      } else {
        users[userName].unread += 1;
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
      source === "medium"
        ? mediumMessagesInput
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

    setAllMessageInputsValue("");
    clearDrawerMediaPreview();
    saveUsers();
    renderMessagingUI();
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

  function bindSearchInput(inputEl) {
    if (!inputEl) return;

    inputEl.addEventListener("input", (e) => {
      currentThreadFilter = e.target.value.trim();

      [messagesSearchInput, mediumSearchInput, popoutSearchInput].forEach((input) => {
        if (input && input !== e.target) input.value = currentThreadFilter;
      });

      renderMessagingUI();
    });
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

  if (composerToggle) composerToggle.addEventListener("click", openComposer);
  if (composerClose) composerClose.addEventListener("click", closeComposer);
  if (composerOverlay) composerOverlay.addEventListener("click", closeComposer);

  if (messagesToggle) messagesToggle.addEventListener("click", openMessages);
  if (messagesClose) messagesClose.addEventListener("click", closeMessagesEverywhere);
  if (messagesOverlay) messagesOverlay.addEventListener("click", closeMessagesEverywhere);

  if (messagesBack) messagesBack.addEventListener("click", goBackToInbox);
  if (mediumBack) mediumBack.addEventListener("click", goBackToInbox);
  if (popoutBack) popoutBack.addEventListener("click", goBackToInbox);

  if (splitToggle) splitToggle.addEventListener("click", toggleSplitCurrentMode);
  if (mediumSplitToggle) mediumSplitToggle.addEventListener("click", toggleSplitCurrentMode);
  if (popoutSplitToggle) popoutSplitToggle.addEventListener("click", toggleSplitCurrentMode);

  if (drawerMediumBtn) {
    drawerMediumBtn.addEventListener("click", () => {
      openMedium(messagingState.layout, getActiveChatUser());
    });
  }

  if (mediumMaxBtn) {
    mediumMaxBtn.addEventListener("click", () => {
      openDrawer(messagingState.layout, getActiveChatUser());
    });
  }

  if (drawerPopoutBtn) {
    drawerPopoutBtn.addEventListener("click", () => {
      openPopout(messagingState.layout, getActiveChatUser());
    });
  }

  if (mediumPopoutBtn) {
    mediumPopoutBtn.addEventListener("click", () => {
      openPopout(messagingState.layout, getActiveChatUser());
    });
  }

  if (popoutDrawerBtn) {
    popoutDrawerBtn.addEventListener("click", () => {
      openDrawer(messagingState.layout, getActiveChatUser());
    });
  }

  if (drawerMinimizeBtn) drawerMinimizeBtn.addEventListener("click", minimizeMessages);
  if (mediumMinimizeBtn) mediumMinimizeBtn.addEventListener("click", minimizeMessages);
  if (popoutMinimizeBtn) popoutMinimizeBtn.addEventListener("click", minimizeMessages);

  if (mediumCloseBtn) mediumCloseBtn.addEventListener("click", closeMessagesEverywhere);
  if (popoutCloseBtn) popoutCloseBtn.addEventListener("click", closeMessagesEverywhere);

  if (messagesMinimizedBar) {
    messagesMinimizedBar.addEventListener("click", restoreFromMinimized);
  }

  if (popoutFullscreenBtn) {
    popoutFullscreenBtn.addEventListener("click", () => {
      if (messagingState.mode === "fullscreen") {
        openPopout(messagingState.layout, getActiveChatUser());
      } else {
        openFullscreen(messagingState.layout, getActiveChatUser());
      }
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
  bindMessageInput(mediumMessagesInput, "medium");
  bindMessageInput(popoutMessagesInput, "popout");

  bindSearchInput(messagesSearchInput);
  bindSearchInput(mediumSearchInput);
  bindSearchInput(popoutSearchInput);

  if (messagesSend) messagesSend.addEventListener("click", () => handleSendMessage("drawer"));
  if (mediumMessagesSend) mediumMessagesSend.addEventListener("click", () => handleSendMessage("medium"));
  if (popoutMessagesSend) popoutMessagesSend.addEventListener("click", () => handleSendMessage("popout"));

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

  if (messagesEmojiBtn) messagesEmojiBtn.addEventListener("click", () => addTextToMessageDraft(" 😊"));
  if (messagesGifBtn) messagesGifBtn.addEventListener("click", () => addTextToMessageDraft(" [GIF] "));
  if (messagesLocationBtn) messagesLocationBtn.addEventListener("click", () => addTextToMessageDraft(" 📍"));

  if (mediumEmojiBtn) mediumEmojiBtn.addEventListener("click", () => addTextToMessageDraft(" 😊"));
  if (mediumGifBtn) mediumGifBtn.addEventListener("click", () => addTextToMessageDraft(" [GIF] "));
  if (mediumLocationBtn) mediumLocationBtn.addEventListener("click", () => addTextToMessageDraft(" 📍"));

  if (popoutEmojiBtn) popoutEmojiBtn.addEventListener("click", () => addTextToMessageDraft(" 😊"));
  if (popoutGifBtn) popoutGifBtn.addEventListener("click", () => addTextToMessageDraft(" [GIF] "));
  if (popoutLocationBtn) popoutLocationBtn.addEventListener("click", () => addTextToMessageDraft(" 📍"));

  if (topSearchToggle) topSearchToggle.addEventListener("click", openMenuSearch);
  if (bottomSearchToggle) bottomSearchToggle.addEventListener("click", openMenuSearch);

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
    const drawerOpen = messagingState.mode === "drawer";

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
    renderMessagingUI();
  }, 60000);
});
