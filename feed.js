document.addEventListener("DOMContentLoaded", () => {
  const feedContainer = document.getElementById("feed");
  if (!feedContainer) return;

  renderPosts("feed", posts);
  setupPostActions("feed");
});

  const demoPosts = [
    {
      id: "post_1",
      user: "Esther",
      time: "2 min ago",
      text: "Finished HIIT session 🔥",
      image: "logo2.png",
      likes: 12,
      comments: 3,
      liked: false,
      saved: false
    },
    {
      id: "post_2",
      user: "Alex",
      time: "10 min ago",
      text: "5K run done",
      image: "logo2.png",
      likes: 8,
      comments: 1,
      liked: true,
      saved: false
    },
    {
      id: "post_3",
      user: "Jason",
      time: "1 hr ago",
      text: "I have man-flu! :(",
      image: "logo2.png",
      likes: 4,
      comments: 0,
      liked: false,
      saved: true
    }
  ];

  const posts = [...demoPosts];

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function escapeAttribute(text) {
    return String(text ?? "").replace(/"/g, "&quot;");
  }

  function findPostById(postId) {
    return posts.find((post) => post.id === postId) || null;
  }

  function renderPost(post) {
    const imageMarkup = post.image
      ? `
        <div class="post-media">
          <img
            class="post-img"
            src="${escapeAttribute(post.image)}"
            alt="${escapeAttribute(post.user)} post image"
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
              <span class="username">${escapeHtml(post.user)}</span>
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

  function renderFeed(postsToRender) {
    feed.innerHTML = postsToRender.map(renderPost).join("");
  }

  function toggleLike(postId) {
    const post = findPostById(postId);
    if (!post) return;

    post.liked = !post.liked;
    post.likes = Math.max(0, (post.likes ?? 0) + (post.liked ? 1 : -1));

    renderFeed(posts);
  }

  function toggleSave(postId) {
    const post = findPostById(postId);
    if (!post) return;

    post.saved = !post.saved;

    renderFeed(posts);
  }

  function handleComment(postId) {
    const post = findPostById(postId);
    if (!post) return;

    console.log(`Open comments for ${post.id}`);
    // later: open comments modal / panel / route
  }

  feed.addEventListener("click", (event) => {
    const actionButton = event.target.closest(".post-action-btn");
    if (!actionButton) return;

    const postElement = actionButton.closest(".post");
    if (!postElement) return;

    const postId = postElement.dataset.postId;
    const action = actionButton.dataset.action;

    if (!postId || !action) return;

    if (action === "like") {
      toggleLike(postId);
      return;
    }

    if (action === "save") {
      toggleSave(postId);
      return;
    }

    if (action === "comment") {
      handleComment(postId);
    }
  });

  renderFeed(posts);
});
