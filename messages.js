document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     ELEMENTS
  ========================= */

  const messagesToggle = document.getElementById("messagesToggle");
  const messagesOverlay = document.getElementById("messagesOverlay");
  const messagesModal = document.getElementById("messagesModal");

  const messagesBack = document.getElementById("messagesBack");
  const splitToggle = document.getElementById("splitToggle");
  const drawerMediumBtn = document.getElementById("drawerMediumBtn");
  const drawerMinimizeBtn = document.getElementById("drawerMinimizeBtn");
  const drawerPopoutBtn = document.getElementById("drawerPopoutBtn");

  const messagesHeaderTitle = document.getElementById("messagesHeaderTitle");
  const messagesListView = document.getElementById("messagesListView");
  const messagesChatView = document.getElementById("messagesChatView");
  const messageChat = document.getElementById("messageChat");
  const messagesInput = document.getElementById("messagesInput");
  const messagesSend = document.getElementById("messagesSend");
  const messagesMediaUpload = document.getElementById("messagesMediaUpload");
  const messagesPreview = document.getElementById("messagesPreview");
  const messagesSearchInput = document.getElementById("messagesSearchInput");
  const messagesList = document.getElementById("messagesList");

  const drawerChevronBtn = document.getElementById("drawerChevronBtn");
  const drawerCornerMenu = document.getElementById("drawerCornerMenu");

  const messagesPopup = document.getElementById("messagesPopup");
  const messagesPopupHeader = messagesPopup?.querySelector(".messages-popup-header");
  const popupBack = document.getElementById("popupBack");
  const popupHeaderTitle = document.getElementById("popupHeaderTitle");
  const popupMessageChat = document.getElementById("popupMessageChat");
  const popupMessagesInput = document.getElementById("popupMessagesInput");
  const popupMessagesSend = document.getElementById("popupMessagesSend");
  const popupMinimizeBtn = document.getElementById("popupMinimizeBtn");
  const popupCloseBtn = document.getElementById("popupCloseBtn");
  const popupSplitBtn = document.getElementById("popupSplitBtn");
  const popupPopoutBtn = document.getElementById("popupPopoutBtn");
  const popupListView = document.getElementById("popupListView");
  const popupChatView = document.getElementById("popupChatView");
  const popupMessagesList = document.getElementById("popupMessagesList");
  const popupMessagesSearchInput = document.getElementById("popupMessagesSearchInput");
  const popupChevronBtn = document.getElementById("popupChevronBtn");
  const popupCornerMenu = document.getElementById("popupCornerMenu");

  const messagesMinimized = document.getElementById("messagesMinimized");
  const minimizedLabel = document.getElementById("minimizedLabel");

  const messagesPopout = document.getElementById("messagesPopout");
  const messagesPopoutHeader = messagesPopout?.querySelector(".messages-popout-header");
  const popoutBack = document.getElementById("popoutBack");
  const popoutHeaderTitle = document.getElementById("popoutHeaderTitle");
  const popoutMessageChat = document.getElementById("popoutMessageChat");
  const popoutMessagesInput = document.getElementById("popoutMessagesInput");
  const popoutMessagesSend = document.getElementById("popoutMessagesSend");
  const popoutMinimizeBtn = document.getElementById("popoutMinimizeBtn");
  const popoutFullscreenBtn = document.getElementById("popoutFullscreenBtn");
  const popoutCloseBtn = document.getElementById("popoutCloseBtn");
  const popoutChevronBtn = document.getElementById("popoutChevronBtn");
  const popoutCornerMenu = document.getElementById("popoutCornerMenu");

  const drawerResizeHandle = document.getElementById("drawerResizeHandle");
  const popupResizeHandle = document.getElementById("popupResizeHandle");
  const popoutResizeHandle = document.getElementById("popoutResizeHandle");

  const gifBtn = document.querySelector(".messages-gif-btn");
  const emojiBtn = document.querySelector(".messages-emoji-btn");
  const locationBtn = document.querySelector(".messages-location-btn");

  const popupGifBtn = document.querySelector(".popup-gif-btn");
  const popupEmojiBtn = document.querySelector(".popup-emoji-btn");
  const popupLocationBtn = document.querySelector(".popup-location-btn");

  if (!messagesModal) return;

  /* =========================
     DATA
  ========================= */

  let threadButtons = Array.from(document.querySelectorAll("#messagesList .message-thread"));

  const messageStore = {
    Jason: [
      { type: "incoming", text: "Hey, are you around later?" },
      { type: "outgoing", text: "Yes, I should be." }
    ],
    Alex: [{ type: "incoming", text: "Nice work on your run 🔥" }]
  };

  const state = {
    currentUser: "Jason",
    mode: "closed", // closed | drawer | popup | popout | minimized
    split: false,
    popupSplit: false,
    popupMode: "chat", // list | chat
    popoutFullscreen: false,
    lastOpenMode: "drawer",
    lastDrawerView: "list", // list | chat
    lastFocusedPane: "list", // list | chat
    drawerWidth: null,
    popupSize: null,
    popoutSize: null
  };

  /* =========================
     HELPERS
  ========================= */

  function autoResizeTextarea(textarea, maxHeight = 180) {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function ensureThread(user) {
    if (!messageStore[user]) {
      messageStore[user] = [];
    }
  }

  function setBodyLock() {
    const anythingOpen =
      state.mode === "drawer" ||
      state.mode === "popup" ||
      state.mode === "popout";

    document.body.style.overflow = anythingOpen ? "hidden" : "";
  }

  function refreshThreadButtons() {
    threadButtons = Array.from(document.querySelectorAll("#messagesList .message-thread"));
  }

  function moveThreadToTop(user) {
    if (!messagesList) return;

    refreshThreadButtons();
    const thread = threadButtons.find((btn) => btn.dataset.user === user);
    if (!thread) return;

    messagesList.prepend(thread);
    refreshThreadButtons();
  }

  function updateThreadPreview(user, text, time = "now") {
    refreshThreadButtons();
    const thread = threadButtons.find((btn) => btn.dataset.user === user);
    if (!thread) return;

    const preview = thread.querySelector(".message-thread-preview");
    const timeEl = thread.querySelector(".message-thread-time");

    if (preview) preview.textContent = text;
    if (timeEl) timeEl.textContent = time;
  }

  function updateSendButtonState(input, button) {
    if (!input || !button) return;
    button.classList.toggle("ready", input.value.trim().length > 0);
  }

  function updateThreadActiveState() {
    refreshThreadButtons();

    threadButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.user === state.currentUser);
    });

    Array.from(popupMessagesList?.querySelectorAll(".message-thread") || []).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.user === state.currentUser);
    });
  }

  function getThreadPreview(user) {
    ensureThread(user);
    const messages = messageStore[user];
    const lastMessage = messages[messages.length - 1];

    return {
      text: lastMessage ? lastMessage.text : "No messages yet",
      time: "now"
    };
  }

  /* =========================
     CORNER MENUS
  ========================= */

  function closeCornerMenus() {
    [
      [drawerChevronBtn, drawerCornerMenu],
      [popupChevronBtn, popupCornerMenu],
      [popoutChevronBtn, popoutCornerMenu]
    ].forEach(([btn, menu]) => {
      btn?.classList.remove("open");
      menu?.classList.remove("open");
    });
  }

  function toggleCornerMenu(btn, menu) {
    if (!btn || !menu) return;

    const willOpen = !menu.classList.contains("open");
    closeCornerMenus();

    if (willOpen) {
      btn.classList.add("open");
      menu.classList.add("open");
    }
  }

  /* =========================
     VISIBILITY / MODES
  ========================= */

  function hideAllContainers() {
    closeCornerMenus();

    messagesOverlay?.classList.remove("open");
    messagesModal?.classList.remove("open");
    messagesPopup?.classList.remove("open");
    messagesPopout?.classList.remove("open");
    messagesMinimized?.classList.remove("open");

    messagesModal?.setAttribute("aria-hidden", "true");
    messagesPopup?.setAttribute("aria-hidden", "true");
    messagesPopout?.setAttribute("aria-hidden", "true");
    messagesMinimized?.setAttribute("aria-hidden", "true");
  }

  function rememberDrawerState() {
    if (state.mode !== "drawer") return;

    if (state.split) {
      state.lastDrawerView = "chat";
      return;
    }

    if (messagesChatView?.classList.contains("active")) {
      state.lastDrawerView = "chat";
    } else {
      state.lastDrawerView = "list";
    }
  }

  function rememberCurrentStateBeforeMinimize() {
    if (state.mode === "drawer" || state.mode === "popup" || state.mode === "popout") {
      state.lastOpenMode = state.mode;
    }

    if (state.mode === "drawer") {
      rememberDrawerState();
    }
  }

  function syncTitles() {
    if (messagesHeaderTitle) {
      if (state.mode === "drawer" && state.split) {
        messagesHeaderTitle.textContent = state.currentUser;
      } else if (
        state.mode === "drawer" &&
        messagesChatView?.classList.contains("active") &&
        !state.split
      ) {
        messagesHeaderTitle.textContent = state.currentUser;
      } else {
        messagesHeaderTitle.textContent = "Messages";
      }
    }

    if (popupHeaderTitle) {
      if (state.popupSplit) {
        popupHeaderTitle.textContent =
          state.lastFocusedPane === "chat" ? state.currentUser : "Messages";
      } else {
        popupHeaderTitle.textContent =
          state.popupMode === "chat" ? state.currentUser : "Messages";
      }
    }

    if (popoutHeaderTitle) {
      popoutHeaderTitle.textContent = state.currentUser;
    }

    if (minimizedLabel) {
      minimizedLabel.textContent = state.currentUser;
    }
  }

  function showDrawerList() {
    messagesListView?.classList.add("active");
    messagesChatView?.classList.remove("active");

    if (messagesBack) {
      messagesBack.style.visibility = "visible";
      messagesBack.setAttribute("aria-label", "Close messages");
    }

    state.lastDrawerView = "list";
    syncTitles();
  }

  function showDrawerChat() {
    messagesListView?.classList.remove("active");
    messagesChatView?.classList.add("active");

    if (messagesBack) {
      messagesBack.style.visibility = "visible";
      messagesBack.setAttribute("aria-label", "Back to conversations");
    }

    state.lastDrawerView = "chat";
    syncTitles();
  }

  function updateDrawerLayout() {
    messagesModal?.classList.toggle("split-mode", state.split);

    if (state.split) {
      messagesListView?.classList.add("active");
      messagesChatView?.classList.add("active");

      if (messagesBack) {
        messagesBack.style.visibility = "visible";
        messagesBack.setAttribute("aria-label", "Close messages");
      }

      state.lastDrawerView = "chat";
      syncTitles();
      return;
    }

    if (state.lastDrawerView === "chat") {
      showDrawerChat();
    } else {
      showDrawerList();
    }
  }

  function updatePopupLayout() {
    messagesPopup?.classList.toggle("split-mode", state.popupSplit);

    if (state.popupSplit) {
      if (popupListView) popupListView.style.display = "flex";
      if (popupChatView) popupChatView.style.display = "flex";
      syncTitles();
      return;
    }

    if (state.popupMode === "list") {
      if (popupListView) popupListView.style.display = "flex";
      if (popupChatView) popupChatView.style.display = "none";
    } else {
      if (popupListView) popupListView.style.display = "none";
      if (popupChatView) popupChatView.style.display = "flex";
    }

    syncTitles();
  }

  function openDrawer() {
    state.mode = "drawer";
    state.lastOpenMode = "drawer";

    hideAllContainers();

    messagesOverlay?.classList.add("open");
    messagesModal?.classList.add("open");
    messagesModal?.setAttribute("aria-hidden", "false");

    if (state.drawerWidth) {
      messagesModal.style.width = `${state.drawerWidth}px`;
    } else {
      messagesModal.style.width = "";
    }

    updateDrawerLayout();
    syncAllChats();
    setBodyLock();
  }

  function openDrawerFromPreviousState() {
    openDrawer();

    if (state.split) {
      updateDrawerLayout();
      syncAllChats();
      return;
    }

    if (state.lastDrawerView === "chat") {
      showDrawerChat();
    } else {
      showDrawerList();
    }

    syncAllChats();
  }

  function openPopup() {
    rememberDrawerState();

    state.mode = "popup";
    state.lastOpenMode = "popup";

    hideAllContainers();

    messagesPopup?.classList.add("open");
    messagesPopup?.setAttribute("aria-hidden", "false");

    if (state.popupSize) {
      messagesPopup.style.width = `${state.popupSize.width}px`;
      messagesPopup.style.height = `${state.popupSize.height}px`;
    } else {
      messagesPopup.style.width = "";
      messagesPopup.style.height = "";
    }

    updatePopupLayout();
    syncAllChats();
    setBodyLock();
  }

  function openPopout() {
    rememberDrawerState();

    state.mode = "popout";
    state.lastOpenMode = "popout";

    hideAllContainers();

    messagesPopout?.classList.add("open");
    messagesPopout?.setAttribute("aria-hidden", "false");

    if (state.popoutSize) {
      messagesPopout.style.width = `${state.popoutSize.width}px`;
      messagesPopout.style.height = `${state.popoutSize.height}px`;
    } else {
      messagesPopout.style.width = "";
      messagesPopout.style.height = "";
    }

    messagesPopout?.classList.toggle("fullscreen", state.popoutFullscreen);

    syncAllChats();
    setBodyLock();
  }

  function openMinimized() {
    rememberCurrentStateBeforeMinimize();

    state.mode = "minimized";
    hideAllContainers();
    messagesMinimized?.classList.add("open");
    messagesMinimized?.setAttribute("aria-hidden", "false");
    syncTitles();
    setBodyLock();
  }

  function restoreFromMinimized() {
    if (state.lastOpenMode === "popup") {
      openPopup();
      return;
    }

    if (state.lastOpenMode === "popout") {
      openPopout();
      return;
    }

    openDrawerFromPreviousState();
  }

  function closeAll() {
    state.mode = "closed";
    state.popoutFullscreen = false;
    hideAllContainers();
    setBodyLock();
  }

  /* =========================
     CHAT RENDERING
  ========================= */

  function renderChat(container, user) {
    if (!container) return;
    ensureThread(user);

    container.innerHTML = messageStore[user]
      .map(
        (msg) => `
          <div class="message-bubble ${msg.type}">
            ${escapeHtml(msg.text)}
          </div>
        `
      )
      .join("");

    container.scrollTop = container.scrollHeight;
  }

  function renderPopupThreadList() {
    if (!popupMessagesList) return;

    refreshThreadButtons();
    popupMessagesList.innerHTML = "";

    threadButtons.forEach((btn) => {
      const user = btn.dataset.user;
      const preview = getThreadPreview(user);

      const thread = document.createElement("button");
      thread.type = "button";
      thread.className = `message-thread ${user === state.currentUser ? "active" : ""}`;
      thread.dataset.user = user;

      thread.innerHTML = `
        <div class="message-thread-avatar">
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="message-thread-content">
          <div class="message-thread-top">
            <div class="message-thread-name-row">
              <span class="message-thread-name">${escapeHtml(user)}</span>
            </div>
            <span class="message-thread-time">${preview.time}</span>
          </div>
          <div class="message-thread-preview">${escapeHtml(preview.text)}</div>
        </div>
      `;

      thread.addEventListener("click", (e) => {
        e.stopPropagation();
        state.lastFocusedPane = "list";
        selectThread(user);
      });

      popupMessagesList.appendChild(thread);
    });
  }

  function syncAllChats() {
    renderChat(messageChat, state.currentUser);
    renderChat(popupMessageChat, state.currentUser);
    renderChat(popoutMessageChat, state.currentUser);
    renderPopupThreadList();
    updateThreadActiveState();
    syncTitles();
  }

  /* =========================
     MESSAGE ACTIONS
  ========================= */

  function selectThread(user) {
    state.currentUser = user;
    moveThreadToTop(user);
    syncAllChats();

    if (state.mode === "drawer") {
      if (state.split) return;
      showDrawerChat();
      return;
    }

    if (state.mode === "popup") {
      state.popupMode = "chat";
      state.lastFocusedPane = "chat";
      updatePopupLayout();
      return;
    }

    if (state.mode === "popout") {
      return;
    }

    openDrawer();
    showDrawerChat();
  }

  function sendMessage(text) {
    const clean = text.trim();
    if (!clean) return false;

    ensureThread(state.currentUser);

    messageStore[state.currentUser].push({
      type: "outgoing",
      text: clean
    });

    updateThreadPreview(state.currentUser, clean, "now");
    moveThreadToTop(state.currentUser);
    syncAllChats();
    return true;
  }

  function clearDrawerInput() {
    if (messagesInput) {
      messagesInput.value = "";
      messagesInput.style.height = "";
      messagesInput.style.overflowY = "hidden";
    }

    if (messagesPreview) {
      messagesPreview.innerHTML = "";
      messagesPreview.classList.remove("has-media");
    }

    if (messagesMediaUpload) {
      messagesMediaUpload.value = "";
    }
  }

  function clearPopupInput() {
    if (popupMessagesInput) {
      popupMessagesInput.value = "";
      popupMessagesInput.style.height = "";
      popupMessagesInput.style.overflowY = "hidden";
    }
  }

  function clearPopoutInput() {
    if (popoutMessagesInput) {
      popoutMessagesInput.value = "";
      popoutMessagesInput.style.height = "";
      popoutMessagesInput.style.overflowY = "hidden";
    }
  }

  function bindToolInsert(button, targetInput, textToInsert) {
    if (!button || !targetInput) return;

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      targetInput.value += textToInsert;
      targetInput.focus();
      autoResizeTextarea(targetInput);

      updateSendButtonState(
        targetInput,
        targetInput === messagesInput
          ? messagesSend
          : targetInput === popupMessagesInput
          ? popupMessagesSend
          : popoutMessagesSend
      );
    });
  }

  function bindThreadButtons() {
    refreshThreadButtons();

    threadButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.lastFocusedPane = "list";
        selectThread(btn.dataset.user);
      });
    });
  }

  /* =========================
     DRAGGING
  ========================= */

  function makeDraggable(windowEl, headerEl) {
    if (!windowEl || !headerEl) return;

    let isDragging = false;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    headerEl.style.touchAction = "none";

    headerEl.addEventListener("pointerdown", (e) => {
      const blocked = e.target.closest("button, input, textarea, label");
      if (blocked) return;

      if (windowEl.classList.contains("fullscreen")) return;
      if (windowEl === messagesModal) return;

      isDragging = true;
      pointerId = e.pointerId;

      const rect = windowEl.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      windowEl.style.left = `${rect.left}px`;
      windowEl.style.top = `${rect.top}px`;
      windowEl.style.right = "auto";
      windowEl.style.bottom = "auto";

      headerEl.setPointerCapture(pointerId);
      document.body.style.userSelect = "none";
    });

    headerEl.addEventListener("pointermove", (e) => {
      if (!isDragging || e.pointerId !== pointerId) return;

      const nextLeft = startLeft + (e.clientX - startX);
      const nextTop = startTop + (e.clientY - startY);

      const maxLeft = Math.max(0, window.innerWidth - windowEl.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - windowEl.offsetHeight);

      windowEl.style.left = `${Math.max(0, Math.min(nextLeft, maxLeft))}px`;
      windowEl.style.top = `${Math.max(0, Math.min(nextTop, maxTop))}px`;
    });

    function stopDragging(e) {
      if (!isDragging) return;
      if (e.pointerId !== pointerId) return;

      isDragging = false;

      try {
        headerEl.releasePointerCapture(pointerId);
      } catch (_) {}

      pointerId = null;
      document.body.style.userSelect = "";
    }

    headerEl.addEventListener("pointerup", stopDragging);
    headerEl.addEventListener("pointercancel", stopDragging);
  }

  /* =========================
     RESIZING
  ========================= */

  function makeDrawerResizable(drawerEl, handleEl) {
    if (!drawerEl || !handleEl) return;

    let isResizing = false;
    let pointerId = null;
    let startX = 0;
    let startWidth = 0;

    handleEl.style.touchAction = "none";

    handleEl.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startWidth = drawerEl.getBoundingClientRect().width;

      handleEl.setPointerCapture(pointerId);
      document.body.style.userSelect = "none";
    });

    handleEl.addEventListener("pointermove", (e) => {
      if (!isResizing || e.pointerId !== pointerId) return;

      const delta = e.clientX - startX;
      const nextWidth = startWidth + delta;
      const clampedWidth = Math.max(320, Math.min(nextWidth, window.innerWidth * 0.9));

      drawerEl.style.width = `${clampedWidth}px`;
      state.drawerWidth = clampedWidth;
    });

    function stopResizing(e) {
      if (!isResizing) return;
      if (e.pointerId !== pointerId) return;

      isResizing = false;

      try {
        handleEl.releasePointerCapture(pointerId);
      } catch (_) {}

      pointerId = null;
      document.body.style.userSelect = "";
    }

    handleEl.addEventListener("pointerup", stopResizing);
    handleEl.addEventListener("pointercancel", stopResizing);
  }

  function makeCornerResizable(windowEl, handleEl, type) {
    if (!windowEl || !handleEl) return;

    let isResizing = false;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    const minWidth = type === "popup" ? 300 : 340;
    const minHeight = type === "popup" ? 320 : 360;

    handleEl.style.touchAction = "none";

    handleEl.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (windowEl.classList.contains("fullscreen")) return;

      isResizing = true;
      pointerId = e.pointerId;

      const rect = windowEl.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = rect.width;
      startHeight = rect.height;

      windowEl.style.width = `${rect.width}px`;
      windowEl.style.height = `${rect.height}px`;

      handleEl.setPointerCapture(pointerId);
      document.body.style.userSelect = "none";
    });

    handleEl.addEventListener("pointermove", (e) => {
      if (!isResizing || e.pointerId !== pointerId) return;

      const nextWidth = startWidth + (e.clientX - startX);
      const nextHeight = startHeight + (e.clientY - startY);

      const clampedWidth = Math.max(minWidth, Math.min(nextWidth, window.innerWidth - 12));
      const clampedHeight = Math.max(minHeight, Math.min(nextHeight, window.innerHeight - 12));

      windowEl.style.width = `${clampedWidth}px`;
      windowEl.style.height = `${clampedHeight}px`;

      if (type === "popup") {
        state.popupSize = { width: clampedWidth, height: clampedHeight };
      } else {
        state.popoutSize = { width: clampedWidth, height: clampedHeight };
      }
    });

    function stopResizing(e) {
      if (!isResizing) return;
      if (e.pointerId !== pointerId) return;

      isResizing = false;

      try {
        handleEl.releasePointerCapture(pointerId);
      } catch (_) {}

      pointerId = null;
      document.body.style.userSelect = "";
    }

    handleEl.addEventListener("pointerup", stopResizing);
    handleEl.addEventListener("pointercancel", stopResizing);
  }

  function resetDrawerSize() {
    state.drawerWidth = null;
    if (messagesModal) {
      messagesModal.style.width = "";
    }
  }

  function resetPopoutSize() {
    state.popoutSize = null;
    if (messagesPopout) {
      messagesPopout.style.width = "";
      messagesPopout.style.height = "";
      messagesPopout.style.left = "";
      messagesPopout.style.top = "";
      messagesPopout.style.right = "";
      messagesPopout.style.bottom = "";
    }
  }

  function resetPopupSize() {
    state.popupSize = null;
    if (messagesPopup) {
      messagesPopup.style.width = "";
      messagesPopup.style.height = "";
      messagesPopup.style.left = "";
      messagesPopup.style.top = "";
      messagesPopup.style.right = "";
      messagesPopup.style.bottom = "";
    }
  }

  /* =========================
     EVENT BINDING
  ========================= */

  bindThreadButtons();

  if (messagesInput) {
    messagesInput.addEventListener("focus", () => {
      state.lastFocusedPane = "chat";
    });
  }

  if (messagesChatView) {
    messagesChatView.addEventListener("click", (e) => {
      const clickedInsideControls = e.target.closest(
        ".messages-footer, textarea, button, label, input"
      );
      if (clickedInsideControls) return;
      state.lastFocusedPane = "chat";
    });
  }

  if (popupListView) {
    popupListView.addEventListener("click", () => {
      state.lastFocusedPane = "list";
      syncTitles();
    });
  }

  if (popupChatView) {
    popupChatView.addEventListener("click", () => {
      state.lastFocusedPane = "chat";
      syncTitles();
    });
  }

  if (popupMessagesInput) {
    popupMessagesInput.addEventListener("focus", () => {
      state.lastFocusedPane = "chat";
      syncTitles();
    });
  }

  if (messagesToggle) {
    messagesToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (messagesOverlay) {
    messagesOverlay.addEventListener("click", closeAll);
  }

  if (messagesBack) {
    messagesBack.addEventListener("click", (e) => {
      e.stopPropagation();

      if (state.mode !== "drawer") return;

      if (state.split) {
        state.split = false;
        state.lastDrawerView = state.lastFocusedPane === "chat" ? "chat" : "list";
        updateDrawerLayout();
        syncAllChats();
        return;
      }

      const isChatView = messagesChatView?.classList.contains("active");

      if (isChatView) {
        showDrawerList();
      } else {
        closeAll();
      }
    });
  }

  if (splitToggle) {
    splitToggle.addEventListener("click", (e) => {
      e.stopPropagation();

      if (state.mode !== "drawer") {
        openDrawer();
      }

      const wasSplit = state.split;
      state.split = !state.split;

      if (wasSplit && !state.split) {
        state.lastDrawerView = state.lastFocusedPane === "chat" ? "chat" : "list";
      }

      updateDrawerLayout();
      syncAllChats();
    });
  }

  if (drawerMediumBtn) {
    drawerMediumBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetPopupSize();

      if (state.split) {
        state.popupSplit = true;
        state.popupMode = state.lastFocusedPane === "list" ? "list" : "chat";
      } else {
        state.popupSplit = false;
        state.popupMode = state.lastDrawerView === "chat" ? "chat" : "list";
      }

      openPopup();
    });
  }

  if (drawerMinimizeBtn) {
    drawerMinimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (drawerPopoutBtn) {
    drawerPopoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetPopoutSize();
      openPopout();
    });
  }

  if (popupBack) {
    popupBack.addEventListener("click", (e) => {
      e.stopPropagation();

      if (state.mode !== "popup") return;

      if (state.popupSplit) {
        state.split = true;
        state.lastDrawerView = "chat";
        state.lastFocusedPane = state.lastFocusedPane === "chat" ? "chat" : "list";
        openDrawer();
        return;
      }

      state.split = false;
      state.lastDrawerView = state.popupMode === "chat" ? "chat" : "list";
      state.lastFocusedPane = state.popupMode === "chat" ? "chat" : "list";
      openDrawerFromPreviousState();
    });
  }

  if (popupMinimizeBtn) {
    popupMinimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (popupCloseBtn) {
    popupCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAll();
    });
  }

  if (popupSplitBtn) {
    popupSplitBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      state.popupSplit = !state.popupSplit;

      if (state.popupSplit) {
        state.lastFocusedPane = state.popupMode === "list" ? "list" : "chat";
      } else {
        state.popupMode = state.lastFocusedPane === "list" ? "list" : "chat";
      }

      updatePopupLayout();
      syncAllChats();
    });
  }

  if (popupPopoutBtn) {
    popupPopoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetPopoutSize();
      openPopout();
    });
  }

  if (popoutBack) {
    popoutBack.addEventListener("click", (e) => {
      e.stopPropagation();
      resetDrawerSize();

      state.mode = "drawer";
      state.lastOpenMode = "drawer";
      state.split = false;
      state.lastDrawerView = "chat";

      openDrawer();
    });
  }

  if (popoutMinimizeBtn) {
    popoutMinimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (popoutCloseBtn) {
    popoutCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAll();
    });
  }

  if (popoutFullscreenBtn) {
    popoutFullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const wasFullscreen = state.popoutFullscreen;
      state.popoutFullscreen = !state.popoutFullscreen;

      if (wasFullscreen) {
        resetPopoutSize();
      }

      messagesPopout?.classList.toggle("fullscreen", state.popoutFullscreen);
    });
  }

  if (drawerChevronBtn && drawerCornerMenu) {
    drawerChevronBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCornerMenu(drawerChevronBtn, drawerCornerMenu);
    });
  }

  if (popupChevronBtn && popupCornerMenu) {
    popupChevronBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCornerMenu(popupChevronBtn, popupCornerMenu);
    });
  }

  if (popoutChevronBtn && popoutCornerMenu) {
    popoutChevronBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCornerMenu(popoutChevronBtn, popoutCornerMenu);
    });
  }

  document.addEventListener("click", (e) => {
    const clickedInsideCornerMenu = e.target.closest(
      "#drawerChevronBtn, #drawerCornerMenu, #popupChevronBtn, #popupCornerMenu, #popoutChevronBtn, #popoutCornerMenu"
    );

    if (!clickedInsideCornerMenu) {
      closeCornerMenus();
    }
  });

  if (messagesMinimized) {
    messagesMinimized.addEventListener("click", (e) => {
      e.stopPropagation();
      restoreFromMinimized();
    });
  }

  if (messagesInput && messagesSend) {
    messagesInput.addEventListener("input", () => {
      autoResizeTextarea(messagesInput);
      updateSendButtonState(messagesInput, messagesSend);
    });

    messagesSend.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sendMessage(messagesInput.value)) {
        clearDrawerInput();
        updateSendButtonState(messagesInput, messagesSend);
      }
    });
  }

  if (popupMessagesInput && popupMessagesSend) {
    popupMessagesInput.addEventListener("input", () => {
      autoResizeTextarea(popupMessagesInput);
      updateSendButtonState(popupMessagesInput, popupMessagesSend);
    });

    popupMessagesSend.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sendMessage(popupMessagesInput.value)) {
        clearPopupInput();
        updateSendButtonState(popupMessagesInput, popupMessagesSend);
      }
    });
  }

  if (popoutMessagesInput && popoutMessagesSend) {
    popoutMessagesInput.addEventListener("input", () => {
      autoResizeTextarea(popoutMessagesInput);
      updateSendButtonState(popoutMessagesInput, popoutMessagesSend);
    });

    popoutMessagesSend.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sendMessage(popoutMessagesInput.value)) {
        clearPopoutInput();
        updateSendButtonState(popoutMessagesInput, popoutMessagesSend);
      }
    });
  }

  [messagesInput, popupMessagesInput, popoutMessagesInput].forEach((input) => {
    if (!input) return;

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        if (input === messagesInput) {
          if (sendMessage(messagesInput.value)) {
            clearDrawerInput();
            updateSendButtonState(messagesInput, messagesSend);
          }
        } else if (input === popupMessagesInput) {
          if (sendMessage(popupMessagesInput.value)) {
            clearPopupInput();
            updateSendButtonState(popupMessagesInput, popupMessagesSend);
          }
        } else if (input === popoutMessagesInput) {
          if (sendMessage(popoutMessagesInput.value)) {
            clearPopoutInput();
            updateSendButtonState(popoutMessagesInput, popoutMessagesSend);
          }
        }
      }
    });
  });

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
    });
  }

  bindToolInsert(emojiBtn, messagesInput, " 😊");
  bindToolInsert(gifBtn, messagesInput, " [GIF] ");
  bindToolInsert(locationBtn, messagesInput, " 📍");

  bindToolInsert(popupEmojiBtn, popupMessagesInput, " 😊");
  bindToolInsert(popupGifBtn, popupMessagesInput, " [GIF] ");
  bindToolInsert(popupLocationBtn, popupMessagesInput, " 📍");

  if (messagesSearchInput) {
    messagesSearchInput.addEventListener("input", () => {
      const query = messagesSearchInput.value.trim().toLowerCase();

      refreshThreadButtons();
      threadButtons.forEach((btn) => {
        const name = (btn.dataset.user || "").toLowerCase();
        const preview = (btn.textContent || "").toLowerCase();
        const show = !query || name.includes(query) || preview.includes(query);
        btn.style.display = show ? "" : "none";
      });
    });
  }

  if (popupMessagesSearchInput) {
    popupMessagesSearchInput.addEventListener("input", () => {
      const query = popupMessagesSearchInput.value.trim().toLowerCase();

      Array.from(popupMessagesList?.querySelectorAll(".message-thread") || []).forEach((btn) => {
        const name = (btn.dataset.user || "").toLowerCase();
        const preview = (btn.textContent || "").toLowerCase();
        const show = !query || name.includes(query) || preview.includes(query);
        btn.style.display = show ? "" : "none";
      });
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCornerMenus();
      closeAll();
    }
  });

  window.addEventListener("resize", () => {
    if (state.mode === "drawer") {
      updateDrawerLayout();
    }

    if (state.mode === "popup") {
      updatePopupLayout();
    }
  });

  /* =========================
     INIT DRAG / RESIZE
  ========================= */

  makeDraggable(messagesPopup, messagesPopupHeader);
  makeDraggable(messagesPopout, messagesPopoutHeader);

  makeDrawerResizable(messagesModal, drawerResizeHandle);
  makeCornerResizable(messagesPopup, popupResizeHandle, "popup");
  makeCornerResizable(messagesPopout, popoutResizeHandle, "popout");

  /* =========================
     INIT
  ========================= */

  moveThreadToTop(state.currentUser);
  syncAllChats();
  updateDrawerLayout();
  updatePopupLayout();
  updateSendButtonState(messagesInput, messagesSend);
  updateSendButtonState(popupMessagesInput, popupMessagesSend);
  updateSendButtonState(popoutMessagesInput, popoutMessagesSend);

  window.interactiveMessages = {
    openDrawer,
    openPopup,
    openPopout,
    openMinimized,
    closeAll,
    selectThread
  };
});
