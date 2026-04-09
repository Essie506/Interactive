document.addEventListener("DOMContentLoaded", () => {
  type Mode = "closed" | "drawer" | "popup" | "popout" | "minimized";
  type Pane = "list" | "chat";
  type MessageType = "incoming" | "outgoing";
  type WindowType = "popup" | "popout";

  interface MessageItem {
    type: MessageType;
    text: string;
  }

  interface ThreadData {
    unread: boolean;
    messages: MessageItem[];
  }

  interface SizeState {
    width: number;
    height: number;
  }

  interface MessagesState {
    currentUser: string;
    highlightedThreadUser: string | null;
    mode: Mode;

    split: boolean;
    popupSplit: boolean;
    popupMode: Pane;
    popoutSplit: boolean;
    popoutMode: Pane;
    popoutFullscreen: boolean;

    lastOpenMode: "drawer" | "popup" | "popout";
    lastDrawerView: Pane;

    drawerFocusedPane: Pane;
    popupFocusedPane: Pane;
    popoutFocusedPane: Pane;

    drawerWidth: number | null;
    popupSize: SizeState | null;
    popoutSize: SizeState | null;
  }

  interface MessagesAPI {
    openDrawer: () => void;
    openPopup: () => void;
    openPopout: () => void;
    openMinimized: () => void;
    closeAll: () => void;
    selectThread: (user: string) => void;
  }

  interface Window {
    interactiveMessages?: MessagesAPI;
  }

  /* =========================
     ELEMENTS
  ========================= */

  const messagesToggles = Array.from(
    document.querySelectorAll<HTMLElement>(".messages-toggle")
  );

  const messagesOverlay = document.getElementById("messagesOverlay") as HTMLElement | null;
  const messagesModal = document.getElementById("messagesModal") as HTMLElement | null;

  const messagesBack = document.getElementById("messagesBack") as HTMLButtonElement | null;
  const splitToggle = document.getElementById("splitToggle") as HTMLButtonElement | null;
  const drawerMediumBtn = document.getElementById("drawerMediumBtn") as HTMLButtonElement | null;
  const drawerMinimizeBtn = document.getElementById("drawerMinimizeBtn") as HTMLButtonElement | null;
  const drawerPopoutBtn = document.getElementById("drawerPopoutBtn") as HTMLButtonElement | null;
  const popupPopoutBtn = document.getElementById("popupPopoutBtn") as HTMLButtonElement | null;

  const messagesHeaderTitle = document.getElementById("messagesHeaderTitle") as HTMLElement | null;
  const messagesListView = document.getElementById("messagesListView") as HTMLElement | null;
  const messagesChatView = document.getElementById("messagesChatView") as HTMLElement | null;
  const messageChat = document.getElementById("messageChat") as HTMLElement | null;
  const messagesInput = document.getElementById("messagesInput") as HTMLTextAreaElement | null;
  const messagesSend = document.getElementById("messagesSend") as HTMLButtonElement | null;
  const messagesMediaUpload = document.getElementById("messagesMediaUpload") as HTMLInputElement | null;
  const messagesPreview = document.getElementById("messagesPreview") as HTMLElement | null;
  const messagesSearchInput = document.getElementById("messagesSearchInput") as HTMLInputElement | null;
  const messagesList = document.getElementById("messagesList") as HTMLElement | null;
  const messagesBody = document.getElementById("messagesBody") as HTMLElement | null;

  const drawerChevronBtn = document.getElementById("drawerChevronBtn") as HTMLButtonElement | null;
  const drawerCornerMenu = document.getElementById("drawerCornerMenu") as HTMLElement | null;

  const messagesPopup = document.getElementById("messagesPopup") as HTMLElement | null;
  const messagesPopupHeader = messagesPopup?.querySelector(".messages-popup-header") as HTMLElement | null;
  const popupBack = document.getElementById("popupBack") as HTMLButtonElement | null;
  const popupHeaderTitle = document.getElementById("popupHeaderTitle") as HTMLElement | null;
  const popupMessageChat = document.getElementById("popupMessageChat") as HTMLElement | null;
  const popupMessagesInput = document.getElementById("popupMessagesInput") as HTMLTextAreaElement | null;
  const popupMessagesSend = document.getElementById("popupMessagesSend") as HTMLButtonElement | null;
  const popupMinimizeBtn = document.getElementById("popupMinimizeBtn") as HTMLButtonElement | null;
  const popupCloseBtn = document.getElementById("popupCloseBtn") as HTMLButtonElement | null;
  const popupSplitBtn = document.getElementById("popupSplitBtn") as HTMLButtonElement | null;
  const popupListView = document.getElementById("popupListView") as HTMLElement | null;
  const popupChatView = document.getElementById("popupChatView") as HTMLElement | null;
  const popupMessagesList = document.getElementById("popupMessagesList") as HTMLElement | null;
  const popupMessagesSearchInput = document.getElementById("popupMessagesSearchInput") as HTMLInputElement | null;
  const popupChevronBtn = document.getElementById("popupChevronBtn") as HTMLButtonElement | null;
  const popupCornerMenu = document.getElementById("popupCornerMenu") as HTMLElement | null;

  const messagesMinimized = document.getElementById("messagesMinimized") as HTMLElement | null;
  const minimizedLabel = document.getElementById("minimizedLabel") as HTMLElement | null;

  const messagesPopout = document.getElementById("messagesPopout") as HTMLElement | null;
  const messagesPopoutHeader = messagesPopout?.querySelector(".messages-popout-header") as HTMLElement | null;
  const popoutBack = document.getElementById("popoutBack") as HTMLButtonElement | null;
  const popoutHeaderTitle = document.getElementById("popoutHeaderTitle") as HTMLElement | null;
  const popoutMessageChat = document.getElementById("popoutMessageChat") as HTMLElement | null;
  const popoutMessagesInput = document.getElementById("popoutMessagesInput") as HTMLTextAreaElement | null;
  const popoutMessagesSend = document.getElementById("popoutMessagesSend") as HTMLButtonElement | null;
  const popoutMinimizeBtn = document.getElementById("popoutMinimizeBtn") as HTMLButtonElement | null;
  const popoutCloseBtn = document.getElementById("popoutCloseBtn") as HTMLButtonElement | null;
  const popoutChevronBtn = document.getElementById("popoutChevronBtn") as HTMLButtonElement | null;
  const popoutCornerMenu = document.getElementById("popoutCornerMenu") as HTMLElement | null;

  const popoutMediumMenuBtn = document.getElementById("popoutMediumMenuBtn") as HTMLButtonElement | null;
  const popoutFullscreenBtn = document.getElementById("popoutFullscreenBtn") as HTMLButtonElement | null;
  const popoutSplitBtn = document.getElementById("popoutSplitBtn") as HTMLButtonElement | null;
  const popoutListView = document.getElementById("popoutListView") as HTMLElement | null;
  const popoutChatView = document.getElementById("popoutChatView") as HTMLElement | null;
  const popoutMessagesList = document.getElementById("popoutMessagesList") as HTMLElement | null;
  const popoutMessagesSearchInput = document.getElementById("popoutMessagesSearchInput") as HTMLInputElement | null;

  const drawerResizeHandle = document.getElementById("drawerResizeHandle") as HTMLElement | null;
  const popupResizeHandle = document.getElementById("popupResizeHandle") as HTMLElement | null;
  const popoutResizeHandle = document.getElementById("popoutResizeHandle") as HTMLElement | null;

  const gifBtn = document.querySelector(".messages-gif-btn") as HTMLElement | null;
  const emojiBtn = document.querySelector(".messages-emoji-btn") as HTMLElement | null;
  const locationBtn = document.querySelector(".messages-location-btn") as HTMLElement | null;

  const popupGifBtn = document.querySelector(".popup-gif-btn") as HTMLElement | null;
  const popupEmojiBtn = document.querySelector(".popup-emoji-btn") as HTMLElement | null;
  const popupLocationBtn = document.querySelector(".popup-location-btn") as HTMLElement | null;

  const popoutGifBtn = document.querySelector(".popout-gif-btn") as HTMLElement | null;
  const popoutEmojiBtn = document.querySelector(".popout-emoji-btn") as HTMLElement | null;
  const popoutLocationBtn = document.querySelector(".popout-location-btn") as HTMLElement | null;

  const typingIndicator = document.getElementById("typingIndicator") as HTMLElement | null;

  if (!messagesModal) return;

  /* =========================
     DATA
  ========================= */

  let threadButtons: HTMLButtonElement[] = Array.from(
    document.querySelectorAll<HTMLButtonElement>("#messagesList .message-thread")
  );

  const messageStore: Record<string, ThreadData> = {
    Jason: {
      unread: false,
      messages: [
        { type: "incoming", text: "Hey, are you around later?" },
        { type: "outgoing", text: "Yes, I should be." }
      ]
    },
    Alex: {
      unread: true,
      messages: [{ type: "incoming", text: "Nice work on your run 🔥" }]
    }
  };

  const state: MessagesState = {
    currentUser: "Jason",
    highlightedThreadUser: null,
    mode: "closed",

    split: false,
    popupSplit: false,
    popupMode: "chat",
    popoutSplit: false,
    popoutMode: "chat",
    popoutFullscreen: false,

    lastOpenMode: "drawer",
    lastDrawerView: "list",

    drawerFocusedPane: "list",
    popupFocusedPane: "list",
    popoutFocusedPane: "list",

    drawerWidth: null,
    popupSize: null,
    popoutSize: null
  };

  /* =========================
     HELPERS
  ========================= */

  const getFocusedPaneKey = (): keyof Pick<
    MessagesState,
    "drawerFocusedPane" | "popupFocusedPane" | "popoutFocusedPane"
  > => {
    if (state.mode === "popup") return "popupFocusedPane";
    if (state.mode === "popout") return "popoutFocusedPane";
    return "drawerFocusedPane";
  };

  const getFocusedPaneForMode = (mode: "drawer" | "popup" | "popout"): Pane => {
    if (mode === "popup") return state.popupFocusedPane;
    if (mode === "popout") return state.popoutFocusedPane;
    return state.drawerFocusedPane;
  };

  const setFocusedPaneForMode = (mode: "drawer" | "popup" | "popout", pane: Pane): void => {
    if (mode === "popup") {
      state.popupFocusedPane = pane;
      return;
    }
    if (mode === "popout") {
      state.popoutFocusedPane = pane;
      return;
    }
    state.drawerFocusedPane = pane;
  };

  const setFocusedPane = (pane: Pane): void => {
    state[getFocusedPaneKey()] = pane;
    syncTitles();
    updatePaneHighlights();
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement | null, maxHeight = 180): void => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  };

  const ensureThread = (user: string): void => {
    if (!messageStore[user]) {
      messageStore[user] = {
        unread: false,
        messages: []
      };
    }
  };

  const hasAnyUnread = (): boolean => {
    return Object.values(messageStore).some((thread) => thread.unread);
  };

  const setUnreadDot = (show = true): void => {
    document.querySelectorAll<HTMLElement>(".messages-dot").forEach((dot) => {
      dot.style.display = show ? "block" : "none";
    });
  };

  const syncNavUnreadDot = (): void => {
    setUnreadDot(hasAnyUnread());
  };

  const showTyping = (): void => {
    if (typingIndicator) typingIndicator.style.display = "block";
  };

  const hideTyping = (): void => {
    if (typingIndicator) typingIndicator.style.display = "none";
  };

  const setBodyLock = (): void => {
    const lockBody = state.mode === "popup" || state.mode === "popout";
    document.body.style.overflow = lockBody ? "hidden" : "";
  };

  const refreshThreadButtons = (): void => {
    threadButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("#messagesList .message-thread")
    );
  };

  const moveThreadToTop = (user: string): void => {
    if (!messagesList) return;

    refreshThreadButtons();
    const thread = threadButtons.find((btn) => btn.dataset.user === user);
    if (!thread) return;

    messagesList.prepend(thread);
    refreshThreadButtons();
  };

  const updateThreadPreview = (user: string, text: string, time = "now"): void => {
    refreshThreadButtons();
    const thread = threadButtons.find((btn) => btn.dataset.user === user);
    if (!thread) return;

    const preview = thread.querySelector<HTMLElement>(".message-thread-preview");
    const timeEl = thread.querySelector<HTMLElement>(".message-thread-time");

    if (preview) preview.textContent = text;
    if (timeEl) timeEl.textContent = time;
  };

  const updateSendButtonState = (
    input: HTMLTextAreaElement | null,
    button: HTMLButtonElement | null
  ): void => {
    if (!input || !button) return;
    button.classList.toggle("ready", input.value.trim().length > 0);
  };

  const hasHighlightedThread = (): boolean => {
    return !!state.highlightedThreadUser;
  };

  const setHighlightedThread = (user: string): void => {
    state.highlightedThreadUser = user;
    updateThreadActiveState();
    syncTitles();
  };

  const clearHighlightedThread = (): void => {
    state.highlightedThreadUser = null;
    updateThreadActiveState();
    syncTitles();
  };

  const getThreadPreview = (user: string): { text: string; time: string } => {
    ensureThread(user);
    const messages = messageStore[user].messages;
    const lastMessage = messages[messages.length - 1];

    return {
      text: lastMessage ? lastMessage.text : "No messages yet",
      time: "now"
    };
  };

  const setPaneActiveState = (viewEl: HTMLElement | null, isActive: boolean): void => {
    if (!viewEl) return;
    viewEl.classList.toggle("pane-active", isActive);
    viewEl.classList.toggle("pane-inactive", !isActive);
  };

  const updatePaneHighlights = (): void => {
    const drawerIsSplit = state.mode === "drawer" && state.split;
    const popupIsSplit = state.mode === "popup" && state.popupSplit;
    const popoutIsSplit = state.mode === "popout" && state.popoutSplit;

    setPaneActiveState(messagesListView, drawerIsSplit && state.drawerFocusedPane === "list");
    setPaneActiveState(messagesChatView, drawerIsSplit && state.drawerFocusedPane === "chat");

    setPaneActiveState(popupListView, popupIsSplit && state.popupFocusedPane === "list");
    setPaneActiveState(popupChatView, popupIsSplit && state.popupFocusedPane === "chat");

    setPaneActiveState(popoutListView, popoutIsSplit && state.popoutFocusedPane === "list");
    setPaneActiveState(popoutChatView, popoutIsSplit && state.popoutFocusedPane === "chat");
  };

  const getDrawerActivePane = (): Pane => {
    const activeEl = document.activeElement;

    const focusedInList =
      !!activeEl &&
      ((messagesListView?.contains(activeEl) ?? false) ||
        (messagesList?.contains(activeEl) ?? false) ||
        activeEl === messagesSearchInput);

    const focusedInChat =
      !!activeEl &&
      ((messagesChatView?.contains(activeEl) ?? false) || activeEl === messagesInput);

    if (focusedInList) return "list";
    if (focusedInChat) return "chat";

    return state.drawerFocusedPane;
  };

  const getPopupActivePane = (): Pane => {
    const activeEl = document.activeElement;

    const focusedInList =
      !!activeEl &&
      ((popupListView?.contains(activeEl) ?? false) ||
        (popupMessagesList?.contains(activeEl) ?? false) ||
        activeEl === popupMessagesSearchInput);

    const focusedInChat =
      !!activeEl &&
      ((popupChatView?.contains(activeEl) ?? false) || activeEl === popupMessagesInput);

    if (focusedInList) return "list";
    if (focusedInChat) return "chat";

    return state.popupFocusedPane;
  };

  const getPopoutActivePane = (): Pane => {
    const activeEl = document.activeElement;

    const focusedInList =
      !!activeEl &&
      ((popoutListView?.contains(activeEl) ?? false) ||
        (popoutMessagesList?.contains(activeEl) ?? false) ||
        activeEl === popoutMessagesSearchInput);

    const focusedInChat =
      !!activeEl &&
      ((popoutChatView?.contains(activeEl) ?? false) || activeEl === popoutMessagesInput);

    if (focusedInList) return "list";
    if (focusedInChat) return "chat";

    return state.popoutFocusedPane;
  };

  const updateSingleThreadListState = (container: ParentNode | null): void => {
    if (!container) return;

    const buttons = Array.from(container.querySelectorAll<HTMLElement>(".message-thread"));

    buttons.forEach((btn) => {
      const user = btn.dataset.user ?? "";
      btn.classList.toggle("active", user === state.highlightedThreadUser);

      const unreadDot = btn.querySelector<HTMLElement>(".thread-unread-dot");
      if (unreadDot) {
        unreadDot.style.display = messageStore[user]?.unread ? "inline-block" : "none";
      }
    });
  };

  const updateThreadActiveState = (): void => {
    refreshThreadButtons();
    updateSingleThreadListState(messagesList);
    updateSingleThreadListState(popupMessagesList);
    updateSingleThreadListState(popoutMessagesList);
    syncNavUnreadDot();
  };

  const updateThreadDots = (): void => {
    refreshThreadButtons();

    threadButtons.forEach((btn) => {
      const user = btn.dataset.user ?? "";
      const dot = btn.querySelector<HTMLElement>(".thread-unread-dot");
      if (!dot) return;
      dot.style.display = messageStore[user]?.unread ? "inline-block" : "none";
    });
  };

  /* =========================
     CORNER MENUS
  ========================= */

  const closeCornerMenus = (): void => {
    [
      [drawerChevronBtn, drawerCornerMenu],
      [popupChevronBtn, popupCornerMenu],
      [popoutChevronBtn, popoutCornerMenu]
    ].forEach(([btn, menu]) => {
      btn?.classList.remove("open");
      menu?.classList.remove("open");
    });
  };

  const toggleCornerMenu = (
    btn: HTMLButtonElement | null,
    menu: HTMLElement | null
  ): void => {
    if (!btn || !menu) return;

    const willOpen = !menu.classList.contains("open");
    closeCornerMenus();

    if (willOpen) {
      btn.classList.add("open");
      menu.classList.add("open");
    }
  };

  /* =========================
     VISIBILITY / MODES
  ========================= */

  const hideAllContainers = (): void => {
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
  };

  const rememberDrawerState = (): void => {
    if (state.mode !== "drawer") return;
    if (state.split) return;

    if (messagesChatView?.classList.contains("active")) {
      state.lastDrawerView = "chat";
    } else {
      state.lastDrawerView = "list";
    }
  };

  const rememberCurrentStateBeforeMinimize = (): void => {
    if (state.mode === "drawer" || state.mode === "popup" || state.mode === "popout") {
      state.lastOpenMode = state.mode;
    }

    if (state.mode === "drawer") {
      rememberDrawerState();
    }
  };

  const getDrawerTitle = (): string => {
    if (state.mode === "drawer" && state.split) {
      if (state.drawerFocusedPane === "chat") return state.currentUser;
      if (state.highlightedThreadUser) return state.highlightedThreadUser;
      return "Messages";
    }

    if (
      state.mode === "drawer" &&
      messagesChatView?.classList.contains("active") &&
      !state.split
    ) {
      return state.currentUser;
    }

    if (state.mode === "drawer" && hasHighlightedThread()) {
      return state.highlightedThreadUser ?? "Messages";
    }

    return "Messages";
  };

  const getPopupTitle = (): string => {
    if (state.popupSplit) {
      if (state.popupFocusedPane === "chat") return state.currentUser;
      if (state.highlightedThreadUser) return state.highlightedThreadUser;
      return "Messages";
    }

    return state.popupMode === "chat" ? state.currentUser : "Messages";
  };

  const getPopoutTitle = (): string => {
    if (state.popoutSplit) {
      if (state.popoutFocusedPane === "chat") return state.currentUser;
      if (state.highlightedThreadUser) return state.highlightedThreadUser;
      return "Messages";
    }

    return state.popoutMode === "chat" ? state.currentUser : "Messages";
  };

  const syncTitles = (): void => {
    if (messagesHeaderTitle) {
      messagesHeaderTitle.textContent = getDrawerTitle();
    }

    if (popupHeaderTitle) {
      popupHeaderTitle.textContent = getPopupTitle();
    }

    if (popoutHeaderTitle) {
      popoutHeaderTitle.textContent = getPopoutTitle();
    }

    if (minimizedLabel) {
      minimizedLabel.textContent = state.currentUser;
    }
  };

  const showDrawerList = (): void => {
    messagesListView?.classList.add("active");
    messagesChatView?.classList.remove("active");

    if (messagesBack) {
      messagesBack.style.visibility = "visible";
      messagesBack.setAttribute("aria-label", "Close messages");
    }

    state.lastDrawerView = "list";
    syncTitles();
    updatePaneHighlights();
  };

  const showDrawerChat = (): void => {
    messagesListView?.classList.remove("active");
    messagesChatView?.classList.add("active");

    clearHighlightedThread();

    if (messagesBack) {
      messagesBack.style.visibility = "visible";
      messagesBack.setAttribute("aria-label", "Back to conversations");
    }

    state.lastDrawerView = "chat";
    syncTitles();
    updatePaneHighlights();
  };

  const updateDrawerLayout = (): void => {
    messagesModal?.classList.toggle("split-mode", state.split);
    messagesBody?.classList.toggle("split-mode", state.split);

    if (state.split) {
      messagesListView?.classList.add("active");
      messagesChatView?.classList.add("active");

      if (messagesBack) {
        messagesBack.style.visibility = "visible";
        messagesBack.setAttribute("aria-label", "Close messages");
      }

      syncTitles();
      updatePaneHighlights();
      return;
    }

    if (state.lastDrawerView === "chat") {
      showDrawerChat();
    } else {
      showDrawerList();
    }
  };

  const updatePopupLayout = (): void => {
    messagesPopup?.classList.toggle("split-mode", state.popupSplit);

    if (state.popupSplit) {
      if (popupListView) popupListView.style.display = "flex";
      if (popupChatView) popupChatView.style.display = "flex";
      syncTitles();
      updatePaneHighlights();
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
    updatePaneHighlights();
  };

  const updatePopoutLayout = (): void => {
    messagesPopout?.classList.toggle("split-mode", state.popoutSplit);

    if (state.popoutSplit) {
      if (popoutListView) popoutListView.style.display = "flex";
      if (popoutChatView) popoutChatView.style.display = "flex";
      syncTitles();
      updatePaneHighlights();
      return;
    }

    if (state.popoutMode === "list") {
      if (popoutListView) popoutListView.style.display = "flex";
      if (popoutChatView) popoutChatView.style.display = "none";
    } else {
      if (popoutListView) popoutListView.style.display = "none";
      if (popoutChatView) popoutChatView.style.display = "flex";
    }

    syncTitles();
    updatePaneHighlights();
  };

  const openDrawer = (): void => {
    state.mode = "drawer";
    state.lastOpenMode = "drawer";

    hideAllContainers();

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
  };

  const openDrawerFromPreviousState = (): void => {
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
  };

  const openPopup = (): void => {
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
  };

  const openPopout = (): void => {
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

    updatePopoutLayout();
    syncAllChats();
    setBodyLock();
  };

  const openMinimized = (): void => {
    rememberCurrentStateBeforeMinimize();

    state.mode = "minimized";
    hideAllContainers();
    messagesMinimized?.classList.add("open");
    messagesMinimized?.setAttribute("aria-hidden", "false");
    syncTitles();
    setBodyLock();
  };

  const restoreFromMinimized = (): void => {
    if (state.lastOpenMode === "popup") {
      openPopup();
      return;
    }

    if (state.lastOpenMode === "popout") {
      openPopout();
      return;
    }

    openDrawerFromPreviousState();
  };

  const closeAll = (): void => {
    state.mode = "closed";
    state.popoutFullscreen = false;
    clearHighlightedThread();
    hideAllContainers();
    setBodyLock();
  };

  /* =========================
     CHAT RENDERING
  ========================= */

  const renderChat = (container: HTMLElement | null, user: string): void => {
    if (!container) return;
    ensureThread(user);

    container.innerHTML = messageStore[user].messages
      .map(
        (msg) => `
          <div class="message-bubble ${msg.type}">
            ${escapeHtml(msg.text)}
          </div>
        `
      )
      .join("");

    container.scrollTop = container.scrollHeight;
  };

  const buildThreadButtonHtml = (user: string): string => {
    const preview = getThreadPreview(user);

    return `
      <div class="message-thread-avatar">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="message-thread-content">
        <div class="message-thread-top">
          <div class="message-thread-name-row">
            <span class="message-thread-name">${escapeHtml(user)}</span>
            <span class="thread-unread-dot" style="display: ${
              messageStore[user]?.unread ? "inline-block" : "none"
            };"></span>
          </div>
          <span class="message-thread-time">${preview.time}</span>
        </div>
        <div class="message-thread-preview">${escapeHtml(preview.text)}</div>
      </div>
    `;
  };

  const handleVirtualThreadClick = (user: string, source: "popup" | "popout"): void => {
    if (source === "popup") {
      if (state.mode === "popup" && state.popupSplit) {
        state.currentUser = user;
        setHighlightedThread(user);
        moveThreadToTop(user);
        syncAllChats();
        setFocusedPaneForMode("popup", "list");
        syncTitles();
        updatePaneHighlights();
        return;
      }

      selectThread(user);
      return;
    }

    if (state.mode === "popout" && state.popoutSplit) {
      state.currentUser = user;
      setHighlightedThread(user);
      moveThreadToTop(user);
      syncAllChats();
      setFocusedPaneForMode("popout", "list");
      syncTitles();
      updatePaneHighlights();
      return;
    }

    state.popoutMode = "chat";
    selectThread(user);
    updatePopoutLayout();
  };

  const renderThreadListFromMaster = (
    container: HTMLElement | null,
    source: "popup" | "popout"
  ): void => {
    if (!container) return;

    refreshThreadButtons();
    container.innerHTML = "";

    threadButtons.forEach((btn) => {
      const user = btn.dataset.user;
      if (!user) return;

      const thread = document.createElement("button");
      thread.type = "button";
      thread.className = `message-thread ${
        user === state.highlightedThreadUser ? "active" : ""
      }`;
      thread.dataset.user = user;
      thread.innerHTML = buildThreadButtonHtml(user);

      thread.addEventListener("click", (e: MouseEvent) => {
        e.stopPropagation();
        handleVirtualThreadClick(user, source);
      });

      container.appendChild(thread);
    });
  };

  const renderPopupThreadList = (): void => {
    renderThreadListFromMaster(popupMessagesList, "popup");
  };

  const renderPopoutThreadList = (): void => {
    renderThreadListFromMaster(popoutMessagesList, "popout");
  };

  const syncAllChats = (): void => {
    renderChat(messageChat, state.currentUser);
    renderChat(popupMessageChat, state.currentUser);
    renderChat(popoutMessageChat, state.currentUser);

    renderPopupThreadList();
    renderPopoutThreadList();

    updateThreadActiveState();
    updateThreadDots();

    syncTitles();
    updatePaneHighlights();
  };

  /* =========================
     MESSAGE ACTIONS
  ========================= */

  function selectThread(user: string): void {
    state.currentUser = user;
    ensureThread(user);
    messageStore[user].unread = false;
    setHighlightedThread(user);

    moveThreadToTop(user);
    syncAllChats();

    if (state.mode === "drawer") {
      if (state.split) {
        updateDrawerLayout();
        return;
      }

      showDrawerChat();
      return;
    }

    if (state.mode === "popup") {
      if (state.popupSplit) {
        updatePopupLayout();
        return;
      }

      state.popupMode = "chat";
      setFocusedPaneForMode("popup", "chat");
      syncTitles();
      updatePaneHighlights();
      updatePopupLayout();
      return;
    }

    if (state.mode === "popout") {
      if (state.popoutSplit) {
        updatePopoutLayout();
        return;
      }

      state.popoutMode = "chat";
      setFocusedPaneForMode("popout", "chat");
      syncTitles();
      updatePaneHighlights();
      updatePopoutLayout();
      return;
    }

    openDrawer();
    showDrawerChat();
  }

  const sendMessage = (text: string): boolean => {
    const clean = text.trim();
    if (!clean) return false;

    ensureThread(state.currentUser);

    messageStore[state.currentUser].messages.push({
      type: "outgoing",
      text: clean
    });

    messageStore[state.currentUser].unread = false;

    updateThreadPreview(state.currentUser, clean, "now");
    moveThreadToTop(state.currentUser);
    syncAllChats();
    simulateReply(state.currentUser);

    return true;
  };

  const simulateReply = (user: string): void => {
    showTyping();

    setTimeout(() => {
      hideTyping();

      ensureThread(user);
      messageStore[user].messages.push({
        type: "incoming",
        text: "Typing reply 👀"
      });
      messageStore[user].unread = true;

      updateThreadPreview(user, "Typing reply 👀", "now");
      moveThreadToTop(user);
      refreshThreadButtons();
      syncAllChats();
    }, 2000);
  };

  const clearTextarea = (input: HTMLTextAreaElement | null): void => {
    if (!input) return;
    input.value = "";
    input.style.height = "";
    input.style.overflowY = "hidden";
  };

  const clearDrawerInput = (): void => {
    clearTextarea(messagesInput);

    if (messagesPreview) {
      messagesPreview.innerHTML = "";
      messagesPreview.classList.remove("has-media");
    }

    if (messagesMediaUpload) {
      messagesMediaUpload.value = "";
    }
  };

  const clearPopupInput = (): void => {
    clearTextarea(popupMessagesInput);
  };

  const clearPopoutInput = (): void => {
    clearTextarea(popoutMessagesInput);
  };

  const getSendButtonForInput = (
    input: HTMLTextAreaElement | null
  ): HTMLButtonElement | null => {
    if (input === messagesInput) return messagesSend;
    if (input === popupMessagesInput) return popupMessagesSend;
    if (input === popoutMessagesInput) return popoutMessagesSend;
    return null;
  };

  const bindToolInsert = (
    button: HTMLElement | null,
    targetInput: HTMLTextAreaElement | null,
    textToInsert: string
  ): void => {
    if (!button || !targetInput) return;

    let startX = 0;
    let startY = 0;
    let moved = false;

    button.addEventListener("pointerdown", (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      moved = false;
    });

    button.addEventListener("pointermove", (e: PointerEvent) => {
      if (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8) {
        moved = true;
      }
    });

    button.addEventListener("pointerup", (e: PointerEvent) => {
      if (moved) return;

      e.preventDefault();
      e.stopPropagation();

      const start = targetInput.selectionStart ?? targetInput.value.length;
      const end = targetInput.selectionEnd ?? targetInput.value.length;

      const before = targetInput.value.slice(0, start);
      const after = targetInput.value.slice(end);

      targetInput.value = before + textToInsert + after;

      const newCaret = start + textToInsert.length;

      autoResizeTextarea(targetInput);

      targetInput.focus({ preventScroll: true });

      requestAnimationFrame(() => {
        targetInput.setSelectionRange(newCaret, newCaret);
      });

      updateSendButtonState(targetInput, getSendButtonForInput(targetInput));
    });
  };

  const bindThreadButtons = (): void => {
    refreshThreadButtons();

    threadButtons.forEach((btn) => {
      btn.addEventListener("click", (e: MouseEvent) => {
        e.stopPropagation();

        const user = btn.dataset.user;
        if (!user) return;

        if (state.mode === "drawer" && state.split) {
          state.currentUser = user;
          setHighlightedThread(user);
          moveThreadToTop(user);
          syncAllChats();
          setFocusedPaneForMode("drawer", "list");
          syncTitles();
          updatePaneHighlights();
          return;
        }

        selectThread(user);
      });
    });
  };

  /* =========================
     DRAGGING
  ========================= */

  const makeDraggable = (windowEl: HTMLElement | null, headerEl: HTMLElement | null): void => {
    if (!windowEl || !headerEl) return;

    let isDragging = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    headerEl.style.touchAction = "none";

    headerEl.addEventListener("pointerdown", (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const blocked = target?.closest("button, input, textarea, label");
      if (blocked) return;

      if (windowEl.classList.contains("fullscreen")) return;
      if (windowEl === messagesModal) return;
      if (windowEl === messagesPopup) return;

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

    headerEl.addEventListener("pointermove", (e: PointerEvent) => {
      if (!isDragging || e.pointerId !== pointerId) return;

      const nextLeft = startLeft + (e.clientX - startX);
      const nextTop = startTop + (e.clientY - startY);

      const maxLeft = Math.max(0, window.innerWidth - windowEl.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - windowEl.offsetHeight);

      windowEl.style.left = `${Math.max(0, Math.min(nextLeft, maxLeft))}px`;
      windowEl.style.top = `${Math.max(0, Math.min(nextTop, maxTop))}px`;
    });

    const stopDragging = (e: PointerEvent): void => {
      if (!isDragging) return;
      if (e.pointerId !== pointerId) return;

      isDragging = false;

      try {
        if (pointerId !== null) {
          headerEl.releasePointerCapture(pointerId);
        }
      } catch {}

      pointerId = null;
      document.body.style.userSelect = "";
    };

    headerEl.addEventListener("pointerup", stopDragging);
    headerEl.addEventListener("pointercancel", stopDragging);
  };

  /* =========================
     RESIZING
  ========================= */

  const makeDrawerResizable = (
    drawerEl: HTMLElement | null,
    handleEl: HTMLElement | null
  ): void => {
    if (!drawerEl || !handleEl) return;

    let isResizing = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startWidth = 0;

    handleEl.style.touchAction = "none";

    handleEl.addEventListener("pointerdown", (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startWidth = drawerEl.getBoundingClientRect().width;

      handleEl.setPointerCapture(pointerId);
      document.body.style.userSelect = "none";
    });

    handleEl.addEventListener("pointermove", (e: PointerEvent) => {
      if (!isResizing || e.pointerId !== pointerId) return;

      const delta = e.clientX - startX;
      const nextWidth = startWidth + delta;
      const clampedWidth = Math.max(320, Math.min(nextWidth, window.innerWidth * 0.9));

      drawerEl.style.width = `${clampedWidth}px`;
      state.drawerWidth = clampedWidth;
    });

    const stopResizing = (e: PointerEvent): void => {
      if (!isResizing) return;
      if (e.pointerId !== pointerId) return;

      isResizing = false;

      try {
        if (pointerId !== null) {
          handleEl.releasePointerCapture(pointerId);
        }
      } catch {}

      pointerId = null;
      document.body.style.userSelect = "";
    };

    handleEl.addEventListener("pointerup", stopResizing);
    handleEl.addEventListener("pointercancel", stopResizing);
  };

  const makeCornerResizable = (
    windowEl: HTMLElement | null,
    handleEl: HTMLElement | null,
    type: WindowType
  ): void => {
    if (!windowEl || !handleEl) return;

    let isResizing = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    const minWidth = type === "popup" ? 300 : 340;
    const minHeight = type === "popup" ? 320 : 360;

    handleEl.style.touchAction = "none";

    handleEl.addEventListener("pointerdown", (e: PointerEvent) => {
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

    handleEl.addEventListener("pointermove", (e: PointerEvent) => {
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

    const stopResizing = (e: PointerEvent): void => {
      if (!isResizing) return;
      if (e.pointerId !== pointerId) return;

      isResizing = false;

      try {
        if (pointerId !== null) {
          handleEl.releasePointerCapture(pointerId);
        }
      } catch {}

      pointerId = null;
      document.body.style.userSelect = "";
    };

    handleEl.addEventListener("pointerup", stopResizing);
    handleEl.addEventListener("pointercancel", stopResizing);
  };

  const resetDrawerSize = (): void => {
    state.drawerWidth = null;
    if (messagesModal) {
      messagesModal.style.width = "";
    }
  };

  const resetPopoutSize = (): void => {
    state.popoutSize = null;
    if (messagesPopout) {
      messagesPopout.style.width = "";
      messagesPopout.style.height = "";
      messagesPopout.style.left = "";
      messagesPopout.style.top = "";
      messagesPopout.style.right = "";
      messagesPopout.style.bottom = "";
    }
  };

  const resetPopupSize = (): void => {
    state.popupSize = null;
    if (messagesPopup) {
      messagesPopup.style.width = "";
      messagesPopup.style.height = "";
      messagesPopup.style.left = "";
      messagesPopup.style.top = "";
      messagesPopup.style.right = "";
      messagesPopup.style.bottom = "";
    }
  };

  /* =========================
     SEARCH
  ========================= */

  const bindThreadSearch = (
    input: HTMLInputElement | null,
    getButtons: () => Iterable<HTMLElement>
  ): void => {
    if (!input) return;

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      Array.from(getButtons()).forEach((btn) => {
        const user = btn.dataset.user ?? "";
        const name = user.toLowerCase();
        const preview = (btn.textContent ?? "").toLowerCase();
        const show = !query || name.includes(query) || preview.includes(query);
        btn.style.display = show ? "" : "none";
      });
    });
  };

  /* =========================
     MESSAGE INPUT BINDING
  ========================= */

  const bindInputSend = (
    input: HTMLTextAreaElement | null,
    button: HTMLButtonElement | null,
    clearFn: () => void
  ): void => {
    if (!input || !button) return;

    input.addEventListener("input", () => {
      autoResizeTextarea(input);
      updateSendButtonState(input, button);
    });

    button.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      if (sendMessage(input.value)) {
        clearFn();
        updateSendButtonState(input, button);
      }
    });

    input.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        if (sendMessage(input.value)) {
          clearFn();
          updateSendButtonState(input, button);
        }
      }
    });
  };

  /* =========================
     EVENT BINDING
  ========================= */

  bindThreadButtons();

  if (messagesListView) {
    messagesListView.addEventListener("click", () => {
      if (state.mode === "drawer" && state.split) {
        setFocusedPaneForMode("drawer", "list");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (messagesList) {
    messagesList.addEventListener("pointerdown", () => {
      if (state.mode === "drawer" && state.split) {
        setFocusedPaneForMode("drawer", "list");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (messagesInput) {
    messagesInput.addEventListener("focus", () => {
      if (state.mode === "drawer" && state.split) {
        clearHighlightedThread();
        setFocusedPaneForMode("drawer", "chat");
        syncTitles();
        updatePaneHighlights();
      } else if (state.mode === "drawer") {
        clearHighlightedThread();
      }
    });
  }

  if (messagesChatView) {
    messagesChatView.addEventListener("click", () => {
      if (state.mode === "drawer" && state.split) {
        clearHighlightedThread();
        setFocusedPaneForMode("drawer", "chat");
        syncTitles();
        updatePaneHighlights();
      } else if (state.mode === "drawer") {
        clearHighlightedThread();
        syncTitles();
      }
    });
  }

  if (popupListView) {
    popupListView.addEventListener("pointerdown", () => {
      if (state.mode === "popup" && state.popupSplit) {
        setFocusedPaneForMode("popup", "list");
        syncTitles();
        updatePaneHighlights();
      }
    });

    popupListView.addEventListener("click", () => {
      if (state.mode === "popup" && state.popupSplit) {
        setFocusedPaneForMode("popup", "list");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (popupPopoutBtn) {
    popupPopoutBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      resetPopoutSize();

      state.popoutSplit = state.popupSplit;
      state.popoutMode = state.popupSplit ? state.popupFocusedPane : state.popupMode;
      state.popoutFocusedPane = state.popupFocusedPane;

      openPopout();
    });
  }

  if (popupMessagesList) {
    popupMessagesList.addEventListener("pointerdown", () => {
      if (state.mode === "popup" && state.popupSplit) {
        setFocusedPaneForMode("popup", "list");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (popupChatView) {
    popupChatView.addEventListener("pointerdown", () => {
      if (state.mode === "popup" && state.popupSplit) {
        clearHighlightedThread();
        setFocusedPaneForMode("popup", "chat");
        syncTitles();
        updatePaneHighlights();
      }
    });

    popupChatView.addEventListener("click", () => {
      if (state.mode === "popup" && state.popupSplit) {
        clearHighlightedThread();
        setFocusedPaneForMode("popup", "chat");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (popupMessagesInput) {
    popupMessagesInput.addEventListener("focus", () => {
      if (state.mode === "popup" && state.popupSplit) {
        clearHighlightedThread();
        setFocusedPaneForMode("popup", "chat");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (popoutListView) {
    popoutListView.addEventListener("pointerdown", () => {
      if (state.mode === "popout" && state.popoutSplit) {
        setFocusedPaneForMode("popout", "list");
        syncTitles();
        updatePaneHighlights();
      }
    });

    popoutListView.addEventListener("click", () => {
      if (state.mode === "popout" && state.popoutSplit) {
        setFocusedPaneForMode("popout", "list");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (popoutMessagesList) {
    popoutMessagesList.addEventListener("pointerdown", () => {
      if (state.mode === "popout" && state.popoutSplit) {
        setFocusedPaneForMode("popout", "list");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (popoutChatView) {
    popoutChatView.addEventListener("pointerdown", () => {
      if (state.mode === "popout" && state.popoutSplit) {
        clearHighlightedThread();
        setFocusedPaneForMode("popout", "chat");
        syncTitles();
        updatePaneHighlights();
      }
    });

    popoutChatView.addEventListener("click", () => {
      if (state.mode === "popout" && state.popoutSplit) {
        clearHighlightedThread();
        setFocusedPaneForMode("popout", "chat");
        syncTitles();
        updatePaneHighlights();
      }
    });
  }

  if (popoutMessagesInput) {
    popoutMessagesInput.addEventListener("focus", () => {
      if (state.mode === "popout" && state.popoutSplit) {
        clearHighlightedThread();
        setFocusedPaneForMode("popout", "chat");
        syncTitles();
        updatePaneHighlights();
      } else if (state.mode === "popout") {
        clearHighlightedThread();
      }
    });
  }

  if (messagesToggles.length) {
    messagesToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e: MouseEvent) => {
        e.stopPropagation();
        openDrawer();
      });
    });
  }

  if (messagesOverlay) {
    messagesOverlay.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();

      if (state.mode === "popup" || state.mode === "popout") {
        closeAll();
      }
    });
  }

  if (messagesBack) {
    messagesBack.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();

      if (state.mode !== "drawer") return;

      if (state.split) {
        closeAll();
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
    splitToggle.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();

      if (state.mode !== "drawer") {
        openDrawer();
      }

      const activePane = getDrawerActivePane();
      const enteringSplit = !state.split;

      if (enteringSplit) {
        state.split = true;
        setFocusedPaneForMode(
          "drawer",
          state.lastDrawerView === "list" ? "list" : "chat"
        );
      } else {
        state.split = false;
        state.lastDrawerView = activePane;
        setFocusedPaneForMode("drawer", activePane);
      }

      syncTitles();
      updatePaneHighlights();
      updateDrawerLayout();
      syncAllChats();
    });
  }

  if (drawerMediumBtn) {
    drawerMediumBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      resetPopupSize();

      if (state.split) {
        state.popupSplit = true;
        state.popupMode = state.drawerFocusedPane === "list" ? "list" : "chat";
        state.popupFocusedPane = state.drawerFocusedPane;
      } else {
        state.popupSplit = false;
        state.popupMode = state.lastDrawerView === "chat" ? "chat" : "list";
      }

      openPopup();
    });
  }

  if (popoutMediumMenuBtn) {
    popoutMediumMenuBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      resetPopupSize();

      state.popupSplit = state.popoutSplit;
      state.popupMode = state.popoutSplit ? state.popoutFocusedPane : state.popoutMode;
      state.popupFocusedPane = state.popoutFocusedPane;

      popoutCornerMenu?.classList.remove("open");
      openPopup();
    });
  }

  if (drawerMinimizeBtn) {
    drawerMinimizeBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (drawerPopoutBtn) {
    drawerPopoutBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      resetPopoutSize();

      if (state.split) {
        state.popoutSplit = true;
        state.popoutMode = state.drawerFocusedPane === "list" ? "list" : "chat";
        state.popoutFocusedPane = state.drawerFocusedPane;
      } else {
        state.popoutSplit = false;
        state.popoutMode = state.lastDrawerView === "chat" ? "chat" : "list";
      }

      openPopout();
    });
  }

  if (popupBack) {
    popupBack.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();

      if (state.mode !== "popup") return;

      if (state.popupSplit) {
        state.split = true;
        state.lastDrawerView = state.popupFocusedPane === "chat" ? "chat" : "list";
        state.drawerFocusedPane = state.popupFocusedPane;
        openDrawer();
        return;
      }

      if (state.popupMode === "chat") {
        state.popupMode = "list";
        updatePopupLayout();
        syncTitles();
        return;
      }

      state.split = false;
      state.lastDrawerView = "list";
      openDrawerFromPreviousState();
    });
  }

  if (popupMinimizeBtn) {
    popupMinimizeBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (popupCloseBtn) {
    popupCloseBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      closeAll();
    });
  }

  if (popupSplitBtn) {
    popupSplitBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();

      const activePane = getPopupActivePane();
      const enteringSplit = !state.popupSplit;

      if (enteringSplit) {
        state.popupSplit = true;
        setFocusedPaneForMode("popup", state.popupMode === "list" ? "list" : "chat");
      } else {
        state.popupSplit = false;
        state.popupMode = activePane;
        setFocusedPaneForMode("popup", activePane);
      }

      syncTitles();
      updatePaneHighlights();
      updatePopupLayout();
      syncAllChats();
    });
  }

  if (popoutBack) {
    popoutBack.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();

      if (state.mode !== "popout") return;

      if (state.popoutSplit) {
        state.split = true;
        state.lastDrawerView = state.popoutFocusedPane === "chat" ? "chat" : "list";
        state.drawerFocusedPane = state.popoutFocusedPane;
        resetDrawerSize();
        openDrawer();
        return;
      }

      if (state.popoutMode === "chat") {
        state.popoutMode = "list";
        updatePopoutLayout();
        syncTitles();
        return;
      }

      resetDrawerSize();
      state.split = false;
      state.lastDrawerView = "list";
      openDrawerFromPreviousState();
    });
  }

  if (popoutMinimizeBtn) {
    popoutMinimizeBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      openMinimized();
    });
  }

  if (popoutCloseBtn) {
    popoutCloseBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      closeAll();
    });
  }

  if (popoutSplitBtn) {
    popoutSplitBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();

      const activePane = getPopoutActivePane();
      const enteringSplit = !state.popoutSplit;

      if (enteringSplit) {
        state.popoutSplit = true;
        setFocusedPaneForMode("popout", state.popoutMode === "list" ? "list" : "chat");
      } else {
        state.popoutSplit = false;
        state.popoutMode = activePane;
        setFocusedPaneForMode("popout", activePane);
      }

      syncTitles();
      updatePaneHighlights();
      updatePopoutLayout();
      syncAllChats();
    });
  }

  if (popoutFullscreenBtn) {
    popoutFullscreenBtn.addEventListener("click", (e: MouseEvent) => {
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
    drawerChevronBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      toggleCornerMenu(drawerChevronBtn, drawerCornerMenu);
    });
  }

  if (popupChevronBtn && popupCornerMenu) {
    popupChevronBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      toggleCornerMenu(popupChevronBtn, popupCornerMenu);
    });
  }

  if (popoutChevronBtn && popoutCornerMenu) {
    popoutChevronBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      toggleCornerMenu(popoutChevronBtn, popoutCornerMenu);
    });
  }

  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const clickedInsideCornerMenu = target.closest(
      "#drawerChevronBtn, #drawerCornerMenu, #popupChevronBtn, #popupCornerMenu, #popoutChevronBtn, #popoutCornerMenu"
    );

    if (!clickedInsideCornerMenu) {
      closeCornerMenus();
    }

    const clickedInsideMessages = target.closest(
      "#messagesModal, .messages-toggle, #messagesPopup, #messagesPopout, #messagesMinimized"
    );

    if (state.mode === "drawer" && !clickedInsideMessages) {
      clearHighlightedThread();

      if (state.split) {
        setFocusedPaneForMode("drawer", "list");
        syncTitles();
      } else if (!messagesChatView?.classList.contains("active")) {
        syncTitles();
      } else if (messagesHeaderTitle) {
        messagesHeaderTitle.textContent = "Messages";
      }
    }

    if (state.mode === "popup" && !clickedInsideMessages) {
      clearHighlightedThread();

      if (state.popupSplit) {
        setFocusedPaneForMode("popup", "list");
        syncTitles();
      }
    }

    if (state.mode === "popout" && !clickedInsideMessages) {
      clearHighlightedThread();

      if (state.popoutSplit) {
        setFocusedPaneForMode("popout", "list");
        syncTitles();
      }
    }
  });

  if (messagesMinimized) {
    messagesMinimized.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      restoreFromMinimized();
    });
  }

  bindInputSend(messagesInput, messagesSend, clearDrawerInput);
  bindInputSend(popupMessagesInput, popupMessagesSend, clearPopupInput);
  bindInputSend(popoutMessagesInput, popoutMessagesSend, clearPopoutInput);

  if (messagesMediaUpload && messagesPreview) {
    messagesMediaUpload.addEventListener("change", function () {
      messagesPreview.innerHTML = "";

      const files = Array.from(this.files ?? []);
      files.forEach((file) => {
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

  bindToolInsert(popoutEmojiBtn, popoutMessagesInput, " 😊");
  bindToolInsert(popoutGifBtn, popoutMessagesInput, " [GIF] ");
  bindToolInsert(popoutLocationBtn, popoutMessagesInput, " 📍");

  bindThreadSearch(messagesSearchInput, () => {
    refreshThreadButtons();
    return threadButtons;
  });

  bindThreadSearch(popupMessagesSearchInput, () =>
    popupMessagesList?.querySelectorAll<HTMLElement>(".message-thread") ?? []
  );

  bindThreadSearch(popoutMessagesSearchInput, () =>
    popoutMessagesList?.querySelectorAll<HTMLElement>(".message-thread") ?? []
  );

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeCornerMenus();
      closeAll();
    }
  });

  window.addEventListener("resize", () => {
    if (state.mode === "drawer") updateDrawerLayout();
    if (state.mode === "popup") updatePopupLayout();
    if (state.mode === "popout") updatePopoutLayout();
  });

  /* =========================
     INIT DRAG / RESIZE
  ========================= */

  makeDraggable(messagesPopout, messagesPopoutHeader);
  makeDrawerResizable(messagesModal, drawerResizeHandle);
  makeCornerResizable(messagesPopup, popupResizeHandle, "popup");
  makeCornerResizable(messagesPopout, popoutResizeHandle, "popout");

  /* =========================
     INIT
  ========================= */

  syncAllChats();
  updateDrawerLayout();
  updatePopupLayout();
  updatePopoutLayout();
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
