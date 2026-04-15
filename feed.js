document.addEventListener("DOMContentLoaded", () => {
  const feedContainer = document.getElementById("feed");
  if (!feedContainer) return;

  const feedPosts = [
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

  renderPosts("feed", feedPosts);
  setupPostActions("feed", feedPosts);
});
