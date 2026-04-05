document.addEventListener("DOMContentLoaded", () => {
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

  const feed = document.getElementById("feed");
  if (!feed) return;

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function escapeAttribute(text) {
    return String(text ?? "").replace(/"/g, "&quot;");
  }

  function renderFeed() {
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

  renderFeed();
});
