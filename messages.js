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

  const messagesPopup = document.getElementById("messagesPopup");
  const popupHeaderTitle = document.getElementById("popupHeaderTitle");
  const popupMessageChat = document.getElementById("popupMessageChat");
  const popupMessagesInput = document.getElementById("popupMessagesInput");
  const popupMessagesSend = document.getElementById("popupMessagesSend");
  const popupMinimizeBtn = document.getElementById("popupMinimizeBtn");
  const popupDrawerBtn = document.getElementById("popupDrawerBtn");
  const popupPopoutBtn = document.getElementById("popupPopoutBtn");
  const popupCloseBtn = document.getElementById("popupCloseBtn");

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

  const threadButtons = Array.from(document.querySelectorAll(".message-thread"));

  if (!messagesModal) return;

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
    popoutFullscreen: false
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
    if (!messageStore[user]) messageStore[user] = [];
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

  function syncTitles() {
    if (messagesHeaderTitle) {
      messagesHeaderTitle.textContent = state.split ? state.currentUser : "Messages";
    }

    if (popupHeaderTitle) popupHeaderTitle.textContent = state.currentUser;
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

  function updateThreadActiveState() {
    threadButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.user === state.currentUser);
    });
  }

  function syncAllChats() {
    renderChat(messageChat, state.currentUser);
    renderChat(popupMessageChat, state.currentUser);
    renderChat(popoutMessageChat, state.currentUser);
    syncTitles();
    updateThreadActiveState();
  }

  function updateDrawerLayout() {
    messagesModal.classList.toggle("split-mode", state.split);

    if (state.split) {
      messagesListView?.classList.add("active");
      messagesChatView?.classList.add("active");
      if (messagesBack) messagesBack.style.visibility = "hidden";
      return;
    }

    messagesListView?.classList.add("active");
    messagesChatView?.classList.remove("active");
    if (messagesBack) messagesBack.style.visibility = "hidden";
  }

  function openDrawer() {
    state.mode = "drawer";
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
    hideAllContainers();
    messagesPopup?.classList.add("open");
    messagesPopup?.setAttribute("aria-hidden", "false");
    syncAllChats();
    setBodyLock();
    popupMessagesInput?.focus();
  }

  function openPopout() {
    state.mode = "popout";
    hideAllContainers();
    messagesPopout?.classList.add("open");
    messagesPopout?.setAttribute("aria-hidden", "false");
    messagesPopout?.classList.toggle("fullscreen", state.popoutFullscreen);
    syncAllChats();
    setBodyLock();
    popoutMessagesInput?.focus();
  }

  function openMinimized() {
    state.mode = "minimized";
    hideAllContainers();
    messagesMinimized?.classList.add("open");
    messagesMinimized?.setAttribute("aria-hidden", "false");
    syncTitles();
    setBodyLock();
  }

  function closeAll() {
    state.mode = "closed";
    state.popoutFullscreen = false;
    hideAllContainers();
    setBodyLock();
  }

  function selectThread(user) {
    state.currentUser = user;
    syncAllChats();

    if (state.mode === "drawer" && state.split) {
      updateDrawerLayout();
      messagesInput?.focus();
      return;
    }

    if (state.mode === "popup") {
      popupMessagesInput?.focus();
      return;
    }

    if (state.mode === "popout") {
      popoutMessagesInput?.focus();
      return;
    }

    openPopup();
  }

  function sendMessage(text) {
    const clean = text.trim();
    if (!clean) return false;

    ensureThread(state.currentUser);
    messageStore[state.currentUser].push({
      type: "outgoing",
      text: clean
    });

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
    });
  }

  threadButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectThread(btn.dataset.user);
    });
  });

  if (messagesChatView) {
    messagesChatView.addEventListener("click", (e) => {
      const clickedInsideControls = e.target.closest(
        ".messages-footer, textarea, button, label, input"
      );
      if (clickedInsideControls) return;

      if (state.mode === "drawer" && state.split) {
        openPopup();
      }
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
    });
  }

  if (splitToggle) {
    splitToggle.addEventListener("click", (e) => {
      e.stopPropagation();

      if (state.mode !== "drawer") {
        openDrawer();
      }

      state.split = !state.split;
      updateDrawerLayout();
      syncAllChats();

      if (state.split) {
        messagesInput?.focus();
      }
    });
  }

  if (messagesMinimized) {
    messagesMinimized.addEventListener("click", (e) => {
      e.stopPropagation();
      openPopup();
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
    messagesInput.addEventListener("input", () => autoResizeTextarea(messagesInput));
    messagesSend.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sendMessage(messagesInput.value)) {
        clearDrawerInput();
      }
    });
  }

  if (popupMessagesInput && popupMessagesSend) {
    popupMessagesInput.addEventListener("input", () => autoResizeTextarea(popupMessagesInput));
    popupMessagesSend.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sendMessage(popupMessagesInput.value)) {
        clearPopupInput();
      }
    });
  }

  if (popoutMessagesInput && popoutMessagesSend) {
    popoutMessagesInput.addEventListener("input", () => autoResizeTextarea(popoutMessagesInput));
    popoutMessagesSend.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sendMessage(popoutMessagesInput.value)) {
        clearPopoutInput();
      }
    });
  }

  [messagesInput, popupMessagesInput, popoutMessagesInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        if (input === messagesInput) {
          if (sendMessage(messagesInput.value)) clearDrawerInput();
        } else if (input === popupMessagesInput) {
          if (sendMessage(popupMessagesInput.value)) clearPopupInput();
        } else if (input === popoutMessagesInput) {
          if (sendMessage(popoutMessagesInput.value)) clearPopoutInput();
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

      threadButtons.forEach((btn) => {
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
  });

  syncAllChats();
  updateDrawerLayout();

  window.interactiveMessages = {
    openDrawer,
    openPopup,
    openPopout,
    openMinimized,
    closeAll,
    selectThread
  };
});
