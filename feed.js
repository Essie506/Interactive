const posts = [

  {
    user: "Esther",
    text: "Finished HIIT session 🔥",
    image: "logo.png"
  },

  {
    user: "Alex",
    text: "5K run done",
    image: "logo.png"
  },

  {
    user: "Sam",
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

      <i class="fa-solid fa-user"></i>

      <span>${post.user}</span>

    </div>

    <p>${post.text}</p>

    <img src="${post.image}">

  `;

  feed.appendChild(card);

});
