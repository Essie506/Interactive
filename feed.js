const posts = [

  {
    user: "Esther",
    time: "2 min ago",
    text: "Finished HIIT session 🔥",
    image: "logo.png"
  },

  {
    user: "Alex",
    time: "10 min ago",
    text: "5K run done",
    image: "logo.png"
  },

  {
    user: "Sam",
    time: "1 hr ago",
    text: "Leg day complete",
    image: "logo.png"
  }

];


const feed = document.getElementById("feed");


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

    <img class="post-image" src="${post.image}">

    <div class="post-actions">

      <span><i class="fa-solid fa-heart"></i> 12</span>
      <span><i class="fa-solid fa-comment"></i> 3</span>
      <span><i class="fa-solid fa-bookmark"></i></span>

    </div>

  `;

  feed.appendChild(card);

});
