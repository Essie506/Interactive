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

  if (feed) {
    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "post";

      card.innerHTML = `
        <div class="post-header">
          <div class="avatar">
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="post-info">
            <span class="username">${post.user}</span>
            <span class="time">${post.time}</span>
          </div>
        </div>

        <div class="post-text">
          ${post.text}
        </div>

        <img class="post-img" src="${post.image}" alt="${post.user} post image">

        <div class="post-actions">
          <span><i class="fa-solid fa-heart"></i> 12</span>
          <span><i class="fa-solid fa-comment"></i> 3</span>
          <span><i class="fa-solid fa-bookmark"></i></span>
        </div>
      `;

      feed.appendChild(card);
    });
  }

  const postBox = document.getElementById("postBox");
  const postInput = document.getElementById("postInput");
  const mediaUpload = document.getElementById("mediaUpload");
  const postPreview = document.getElementById("postPreview");
  const emojiBtn = document.querySelector(".emoji-btn");
  const tagBtn = document.querySelector(".tag-btn");
const gifBtn = document.querySelector(".gif-btn");
const locationBtn = document.querySelector(".location-btn");

if (tagBtn) {
  tagBtn.addEventListener("click", () => {
    alert("Tag people feature coming next");
  });
}

if (gifBtn) {
  gifBtn.addEventListener("click", () => {
    alert("GIF feature coming next");
  });
}

if (locationBtn) {
  locationBtn.addEventListener("click", () => {
    alert("Location feature coming next");
  });
}

if (emojiBtn && postInput) {
  emojiBtn.addEventListener("click", () => {
    postBox.classList.add("expanded");
    postInput.value += " 😊";
    postInput.focus();
    postInput.dispatchEvent(new Event("input"));
  });
}

  if (postBox && postInput) {
    postInput.addEventListener("focus", () => {
      postBox.classList.add("expanded");
    });

    postInput.addEventListener("click", () => {
      postBox.classList.add("expanded");
    });

    document.addEventListener("click", (e) => {
      const clickedInsidePostBox = postBox.contains(e.target);
      const hasText = postInput.value.trim().length > 0;
      const hasPreview = postPreview && postPreview.children.length > 0;

      if (!clickedInsidePostBox && !hasText && !hasPreview) {
        postBox.classList.remove("expanded");
      }
    });
  }

  if (mediaUpload && postPreview && postBox) {
    mediaUpload.addEventListener("change", function () {
      postPreview.innerHTML = "";

      Array.from(this.files).forEach(file => {
        const fileURL = URL.createObjectURL(file);

        if (file.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = fileURL;
          img.alt = file.name;
          postPreview.appendChild(img);
        } else if (file.type.startsWith("video/")) {
          const video = document.createElement("video");
          video.src = fileURL;
          video.controls = true;
          postPreview.appendChild(video);
        }
      });

      if (this.files.length > 0) {
        postBox.classList.add("expanded");
      }
    });
  }

  let lastScrollY = window.scrollY;
  const navbar = document.querySelector(".navbar");
  const bottomNav = document.querySelector(".bottom-nav");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 10) {
      if (navbar) navbar.classList.remove("hide-top");
      if (bottomNav) bottomNav.classList.remove("hide-bottom");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY) {
      if (navbar) navbar.classList.add("hide-top");
      if (bottomNav) bottomNav.classList.add("hide-bottom");
    } else {
      if (navbar) navbar.classList.remove("hide-top");
      if (bottomNav) bottomNav.classList.remove("hide-bottom");
    }

    lastScrollY = currentScrollY;
  });
});
