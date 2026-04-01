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

  const messagesPopup = document.getElementById("messagesPopup");
  const popupMessagesInput = document.getElementById("popupMessagesInput");
  const popupMessagesSend = document.getElementById("popupMessagesSend");

  const messagesPopout = document.getElementById("messagesPopout");
  const popoutMessagesInput = document.getElementById("popoutMessagesInput");
  const popoutMessagesSend = document.getElementById("popoutMessagesSend");

  const threadButtons = Array.from(document.querySelectorAll(".message-thread"));

  if (!messagesModal) return;

  // =========================
  // DATA
  // =========================
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
    mode: "closed",
    split: false
  };

  // =========================
  // HELPERS
  // =========================
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function ensureThread(user) {
    if (!messageStore[user]) messageStore[user] = [];
  }

  function moveThreadToTop(user) {
    const list = document.getElementById("messagesList");
    const thread = threadButtons.find(b => b.dataset.user === user);
    if (thread && list) list.prepend(thread);
  }

  function updateThreadPreview(user, text) {
    const thread = threadButtons.find(b => b.dataset.user === user);
    if (!thread) return;

    const preview = thread.querySelector(".message-thread-preview");
    const time = thread.querySelector(".message-thread-time");

    if (preview) preview.textContent = text;
    if (time) time.textContent = "now";
  }

  function updateSendButtonState(input, button) {
    if (!input || !button) return;
    button.classList.toggle("ready", input.value.trim().length > 0);
  }

  function renderChat(container, user) {
    if (!container) return;
    ensureThread(user);

    container.innerHTML = messageStore[user]
      .map(msg => `
        <div class="message-bubble ${msg.type}">
          ${escapeHtml(msg.text)}
        </div>
      `)
      .join("");

    container.scrollTop = container.scrollHeight;
  }

  function syncAllChats() {
    renderChat(messageChat, state.currentUser);
  }

  function showDrawerList() {
    messagesListView.classList.add("active");
    messagesChatView.classList.remove("active");
    messagesBack.style.visibility = "hidden";
    messagesHeaderTitle.textContent = "Messages";
  }

  function showDrawerChat() {
    messagesListView.classList.remove("active");
    messagesChatView.classList.add("active");
    messagesBack.style.visibility = "visible";
    messagesHeaderTitle.textContent = state.currentUser;
  }

  function updateDrawerLayout() {
    messagesModal.classList.toggle("split-mode", state.split);

    if (state.split) {
      messagesListView.classList.add("active");
      messagesChatView.classList.add("active");
      messagesBack.style.visibility = "hidden";
      return;
    }

    showDrawerList();
  }

  function openDrawer() {
    state.mode = "drawer";
    messagesOverlay.classList.add("open");
    messagesModal.classList.add("open");
    updateDrawerLayout();
    syncAllChats();
  }

  function closeAll() {
    state.mode = "closed";
    messagesOverlay.classList.remove("open");
    messagesModal.classList.remove("open");
  }

  // =========================
  // CORE LOGIC
  // =========================
  function selectThread(user) {
    state.currentUser = user;
    moveThreadToTop(user);
    syncAllChats();

    if (state.mode === "drawer") {
      if (state.split) return;
      showDrawerChat();
      messagesInput.focus();
      return;
    }

    openDrawer();
    showDrawerChat();
    messagesInput.focus();
  }

  function sendMessage(text) {
    const clean = text.trim();
    if (!clean) return false;

    ensureThread(state.currentUser);
    messageStore[state.currentUser].push({
      type: "outgoing",
      text: clean
    });

    updateThreadPreview(state.currentUser, clean);
    moveThreadToTop(state.currentUser);
    syncAllChats();
    return true;
  }

  // =========================
  // EVENTS
  // =========================

  threadButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectThread(btn.dataset.user);
    });
  });

  messagesToggle?.addEventListener("click", openDrawer);
  messagesOverlay?.addEventListener("click", closeAll);
  messagesClose?.addEventListener("click", closeAll);

  messagesBack?.addEventListener("click", showDrawerList);

  splitToggle?.addEventListener("click", () => {
    state.split = !state.split;
    updateDrawerLayout();
  });

  // =========================
  // SEND HANDLERS
  // =========================

  if (messagesInput && messagesSend) {
    messagesInput.addEventListener("input", () => {
      updateSendButtonState(messagesInput, messagesSend);
    });

    messagesSend.addEventListener("click", () => {
      if (sendMessage(messagesInput.value)) {
        messagesInput.value = "";
        updateSendButtonState(messagesInput, messagesSend);
      }
    });
  }

  if (popupMessagesInput && popupMessagesSend) {
    popupMessagesInput.addEventListener("input", () => {
      updateSendButtonState(popupMessagesInput, popupMessagesSend);
    });

    popupMessagesSend.addEventListener("click", () => {
      if (sendMessage(popupMessagesInput.value)) {
        popupMessagesInput.value = "";
        updateSendButtonState(popupMessagesInput, popupMessagesSend);
      }
    });
  }

  if (popoutMessagesInput && popoutMessagesSend) {
    popoutMessagesInput.addEventListener("input", () => {
      updateSendButtonState(popoutMessagesInput, popoutMessagesSend);
    });

    popoutMessagesSend.addEventListener("click", () => {
      if (sendMessage(popoutMessagesInput.value)) {
        popoutMessagesInput.value = "";
        updateSendButtonState(popoutMessagesInput, popoutMessagesSend);
      }
    });
  }

  // =========================
  // INIT
  // =========================
  moveThreadToTop(state.currentUser);
  syncAllChats();
  updateDrawerLayout();

});
