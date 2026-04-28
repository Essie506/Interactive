const input = document.getElementById("composerInput");
const postBtn = document.querySelector(".composer-footer .send-btn");
const preview = document.getElementById("composerPreview");
const footer = document.querySelector(".composer-bottom-bar");

function resizeComposer() {
  if (!input) return;

  input.style.height = "auto";

  const footerHeight = footer?.offsetHeight || 0;
  const availableHeight = window.innerHeight - footerHeight - 120;

  input.style.height = `${Math.min(input.scrollHeight, availableHeight)}px`;
}

function updatePostButtonState() {
  const hasText = input.value.trim().length > 0;
  const hasMedia = preview && preview.children.length > 0;

  postBtn?.classList.toggle("active", hasText || hasMedia);
}

input?.addEventListener("input", () => {
  resizeComposer();
  updatePostButtonState();
});

window.addEventListener("resize", resizeComposer);

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function escapeAttribute(text) {
  return String(text ?? "").replace(/"/g, "&quot;");
}

function findPostById(postsArray, postId) {
  return postsArray.find((post) => post.id === postId) || null;
}

function createPostHTML(post) {
  const postUser = post.user || post.username || "User";
  const imageMarkup = post.image
    ? `
      <div class="post-media">
        <img
          class="post-img"
          src="${escapeAttribute(post.image)}"
          alt="${escapeAttribute(postUser)} post image"
        >
      </div>
    `
    : "";

  const likeIconClass = post.liked ? "fa-solid fa-heart" : "fa-regular fa-heart";
  const saveIconClass = post.saved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark";

  return `
    <article class="post" data-post-id="${escapeAttribute(post.id)}">
      <div class="post-inner">
        <div class="post-header">
          <div class="avatar" aria-hidden="true">
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="post-info">
            <span class="username">${escapeHtml(postUser)}</span>
            <span class="time">${escapeHtml(post.time)}</span>
          </div>
        </div>

        <div class="post-text">${escapeHtml(post.text)}</div>

        ${imageMarkup}

        <div class="post-actions">
          <button
            type="button"
            class="post-action-btn ${post.liked ? "is-active" : ""}"
            data-action="like"
            aria-label="Like post"
          >
            <i class="${likeIconClass}"></i>
            <span>${post.likes ?? 0}</span>
          </button>

          <button
            type="button"
            class="post-action-btn"
            data-action="comment"
            aria-label="View comments"
          >
            <i class="fa-solid fa-comment"></i>
            <span>${post.comments ?? 0}</span>
          </button>

          <button
            type="button"
            class="post-action-btn ${post.saved ? "is-active" : ""}"
            data-action="save"
            aria-label="${post.saved ? "Unsave post" : "Save post"}"
          >
            <i class="${saveIconClass}"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderPosts(containerId, postsArray) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = postsArray.map(createPostHTML).join("");
}

function setupPostActions(containerId, postsArray) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.addEventListener("click", (event) => {
    const actionButton = event.target.closest(".post-action-btn");
    if (!actionButton) return;

    const postElement = actionButton.closest(".post");
    if (!postElement) return;

    const postId = postElement.dataset.postId;
    const action = actionButton.dataset.action;
    if (!postId || !action) return;

    const post = findPostById(postsArray, postId);
    if (!post) return;

    if (action === "like") {
      post.liked = !post.liked;
      post.likes = Math.max(0, (post.likes ?? 0) + (post.liked ? 1 : -1));
      renderPosts(containerId, postsArray);
      return;
    }

    if (action === "save") {
      post.saved = !post.saved;
      renderPosts(containerId, postsArray);
      return;
    }

    if (action === "comment") {
      console.log(`Open comments for ${post.id}`);
    }
  });
}
