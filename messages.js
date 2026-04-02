document.addEventListener("DOMContentLoaded", () => {
  const messagesToggle = document.getElementById("messagesToggle");
  const messagesOverlay = document.getElementById("messagesOverlay");
  const messagesModal = document.getElementById("messagesModal");

  const messagesBack = document.getElementById("messagesBack");
  const messagesClose = document.getElementById("messagesClose");
  const splitToggle = document.getElementById("splitToggle");
  const drawerMediumBtn = document.getElementById("drawerMediumBtn");
  const drawerPopoutBtn = document.getElementById("drawerPopoutBtn");
  const drawerMinimizeBtn = document.getElementById("drawerMinimizeBtn");

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

  const messagesPopup = document.getElementById("messagesPopup");
  const popupHeaderTitle = document.getElementById("popupHeaderTitle");
  const popupMessageChat = document.getElementById("popupMessageChat");
  const popupMessagesInput = document.getElementById("popupMessagesInput");
  const popupMessagesSend = document.getElementById("popupMessagesSend");
  const popupMinimizeBtn = document.getElementById("popupMinimizeBtn");
  const popupDrawerBtn = document.getElementById("popupDrawerBtn");
  const popupPopoutBtn = document.getElementById("popupPopoutBtn");
  const popupCloseBtn = document.getElementById("popupCloseBtn");

  const popupSplitBtn = document.getElementById("popupSplitBtn");
  const popupListView = document.getElementById("popupListView");
  const popupChatView = document.getElementById("popupChatView");
  const popupMessagesList = document.getElementById("popupMessagesList");
  const popupMessagesSearchInput = document.getElementById("popupMessagesSearchInput");

  const messagesMinimized = document.getElementById("messagesMinimized");
  const minimizedLabel = document.getElementById("minimizedLabel");

  const messagesPopout = document.getElementById("messagesPopout");
  const popoutHeaderTitle = document.getElementById("popoutHeaderTitle");
  const popoutMessageChat = document.getElementById("popoutMessageChat");
  const popoutMessagesInput = document.getElementById("popoutMessagesInput");
  const popoutMessagesSend = document.getElementById("popoutMessagesSend");
  const popoutMinimizeBtn = document.getElementById("popoutMinimizeBtn");
  const popoutDrawerBtn = document.getElementById("popoutDrawerBtn");
  const popoutFullscreenBtn = document.getElementById("popoutFullscreenBtn");
  const popoutCloseBtn = document.getElementById("popoutCloseBtn");

  const gifBtn = document.querySelector(".messages-gif-btn");
  const emojiBtn = document.querySelector(".messages-emoji-btn");
  const locationBtn = document.querySelector(".messages-location-btn");

  const popupGifBtn = document.querySelector(".popup-gif-btn");
  const popupEmojiBtn = document.querySelector(".popup-emoji-btn");
  const popupLocationBtn = document.querySelector(".popup-location-btn");

  if (!messagesModal) return;

  let threadButtons = Array.from(document.querySelectorAll("#messagesList .message-thread"));

  const messageStore = {
    Jason: [
      { type: "incoming", text: "Hey, are you around later?" },
      { type: "outgoing", text: "Yes, I should be." }
    ],
    Alex: [
      { type: "incoming", text: "Nice work on your run 🔥" }
    ]
  };

  const state = {
    currentUser: "Jason",
    mode: "closed", // closed | drawer | popup | popout | minimized
    split: false,
    popupSplit: false,
    popoutFullscreen: false,
    lastOpenMode: "drawer", // drawer | popup | popout
    lastDrawerView: "list", // list | chat
    lastFocusedPane: "list" // list | chat
  };

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

  function hideAllContainers() {
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
      popupHeaderTitle.textContent = state.currentUser;
    }

    if (popoutHeaderTitle) popoutHeaderTitle.textContent = state.currentUser;
    if (minimizedLabel) minimizedLabel.textContent = state.currentUser;
  }

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

  function getThreadPreview(user) {
    ensureThread(user);
    const messages = messageStore[user];
    const lastMessage = messages[messages.length - 1];

    return {
      text: lastMessage ? lastMessage.text : "No messages yet",
      time: "now"
    };
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
        state.currentUser = user;
        syncAllChats();
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

  if (popupListView) {
    popupListView.style.display = state.popupSplit ? "flex" : "none";
  }

  if (popupChatView) {
    popupChatView.style.display = "flex";
  }

  // 👇 NEW TITLE LOGIC
  if (popupHeaderTitle) {
  popupHeaderTitle.textContent = state.currentUser;
}
  }

  function rememberCurrentStateBeforeMinimize() {
    if (state.mode === "drawer" || state.mode === "popup" || state.mode === "popout") {
      state.lastOpenMode = state.mode;
    }

    if (state.mode === "drawer") {
      if (state.split) {
        state.lastDrawerView = "chat";
      } else if (messagesChatView?.classList.contains("active")) {
        state.lastDrawerView = "chat";
      } else {
        state.lastDrawerView = "list";
      }
    }
  }

  function openDrawer() {
    state.mode = "drawer";
    state.lastOpenMode = "drawer";
    hideAllContainers();
    messagesOverlay?.classList.add("open");
    messagesModal?.classList.add("open");
    messagesModal?.setAttribute("aria-hidden", "false");
    updateDrawerLayout();
    syncAllChats();
    setBodyLock();
  }

  function openPopup() {
    state.mode = "popup";
    state.lastOpenMode = "popup";
    hideAllContainers();
    messagesPopup?.classList.add("open");
    messagesPopup?.setAttribute("aria-hidden", "false");
    updatePopupLayout();
    syncAllChats();
    setBodyLock();
  }

  function openPopout() {
    state.mode = "popout";
    state.lastOpenMode = "popout";
    hideAllContainers();
    messagesPopout?.classList.add("open");
    messagesPopout?.setAttribute("aria-hidden", "false");
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

    openDrawer();

    if (state.split) return;

    if (state.lastDrawerView === "chat") {
      showDrawerChat();
    } else {
      showDrawerList();
    }
  }

  function closeAll() {
    state.mode = "closed";
    state.popoutFullscreen = false;
    hideAllContainers();
    setBodyLock();
  }

  function selectThread(user) {
    state.currentUser = user;
    moveThreadToTop(user);
    syncAllChats();

    if (state.mode === "drawer") {
      if (state.split) return;
      showDrawerChat();
      return;
    }

    if (state.mode === "popup") return;
    if (state.mode === "popout") return;

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

  if (messagesToggle) {
    messagesToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (messagesOverlay) {
    messagesOverlay.addEventListener("click", closeAll);
  }

  if (messagesClose) {
    messagesClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAll();
    });
  }

  if (drawerMinimizeBtn) {
    drawerMinimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (drawerMediumBtn) {
    drawerMediumBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openPopup();
    });
  }

  if (drawerPopoutBtn) {
    drawerPopoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openPopout();
    });
  }

 if (messagesBack) {
  messagesBack.addEventListener("click", (e) => {
    e.stopPropagation();

    if (state.mode !== "drawer") return;

    // ✅ FIRST: handle split mode properly
    if (state.split) {
      state.split = false;

      // decide what view to return to
      state.lastDrawerView = state.lastFocusedPane === "chat" ? "chat" : "list";

      updateDrawerLayout();
      syncAllChats();
      return;
    }

    // ✅ NORMAL behaviour
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

  if (popupSplitBtn) {
    popupSplitBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.popupSplit = !state.popupSplit;
      updatePopupLayout();
      syncAllChats();
    });
  }

  if (messagesMinimized) {
    messagesMinimized.addEventListener("click", (e) => {
      e.stopPropagation();
      restoreFromMinimized();
    });
  }

  if (popupMinimizeBtn) {
    popupMinimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (popupDrawerBtn) {
    popupDrawerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDrawer();

      if (state.split) return;
      showDrawerChat();
    });
  }

  if (popupPopoutBtn) {
    popupPopoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openPopout();
    });
  }

  if (popupCloseBtn) {
    popupCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAll();
    });
  }

  if (popoutMinimizeBtn) {
    popoutMinimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (popoutDrawerBtn) {
    popoutDrawerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDrawer();

      if (state.split) return;
      showDrawerChat();
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
      state.popoutFullscreen = !state.popoutFullscreen;
      messagesPopout?.classList.toggle("fullscreen", state.popoutFullscreen);
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
    if (e.key === "Escape") closeAll();
  });

  window.addEventListener("resize", () => {
    if (state.mode === "drawer") {
      updateDrawerLayout();
    }

    if (state.mode === "popup") {
      updatePopupLayout();
    }
  });

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
