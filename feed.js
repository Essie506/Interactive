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

        <img class="post-img" src="${post.image}">

        <div class="post-actions">
          <span><i class="fa-solid fa-heart"></i> 12</span>
          <span><i class="fa-solid fa-comment"></i> 3</span>
          <span><i class="fa-solid fa-bookmark"></i></span>
        </div>
      `;

      feed.appendChild(card);
    });
  }

  const mediaUpload = document.getElementById("mediaUpload");
  const postPreview = document.getElementById("postPreview");

  if (mediaUpload && postPreview) {
    mediaUpload.addEventListener("change", function () {
      postPreview.innerHTML = "";

      Array.from(this.files).forEach(file => {
        const fileURL = URL.createObjectURL(file);

        if (file.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = fileURL;
          postPreview.appendChild(img);
        } else if (file.type.startsWith("video/")) {
          const video = document.createElement("video");
          video.src = fileURL;
          video.controls = true;
          postPreview.appendChild(video);
        }
      });
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
