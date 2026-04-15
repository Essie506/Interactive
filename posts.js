// =========================
// MOCK DATA (temporary)
// =========================
const posts = [
  {
    id: 1,
    username: "Esther",
    time: "2h",
    text: "Strong session this morning.",
    image: "images/post1.jpg"
  },
  {
    id: 2,
    username: "Esther",
    time: "1d",
    text: "New mobility work added today.",
    image: ""
  }
];

// =========================
// POST TEMPLATE
// =========================
function createPostHTML(post) {
  return `
    <article class="post">
      <div class="post-header">
        <div class="avatar">
          <i class="fa-solid fa-user"></i>
        </div>

        <div class="post-info">
          <span class="username">${post.username}</span>
          <span class="time">${post.time}</span>
        </div>
      </div>

      <p class="post-text">${post.text}</p>

      ${
        post.image
          ? `
        <div class="post-media">
          <img class="post-img" src="${post.image}" alt="">
        </div>
      `
          : ""
      }

      <div class="post-actions">
        <button type="button" class="post-action-btn" data-action="like">
          <i class="fa-regular fa-heart"></i>
          <span>Like</span>
        </button>

        <button type="button" class="post-action-btn" data-action="comment">
          <i class="fa-regular fa-comment"></i>
          <span>Comment</span>
        </button>

        <button type="button" class="post-action-btn" data-action="share">
          <i class="fa-solid fa-share-nodes"></i>
          <span>Share</span>
        </button>
      </div>
    </article>
  `;
}

// =========================
// RENDER FUNCTION
// =========================
function renderPosts(containerId, postsArray) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = postsArray.map(createPostHTML).join("");
}
