document.addEventListener("DOMContentLoaded", () => {
  const profilePostsContainer = document.getElementById("profilePosts");
  if (!profilePostsContainer) return;

  const profilePosts = [
    {
      id: "profile_1",
      user: "Esther",
      time: "2h",
      text: "Strong session this morning.",
      image: "images/post1.jpg",
      likes: 12,
      comments: 3,
      liked: false,
      saved: false
    },
    {
      id: "profile_2",
      user: "Esther",
      time: "1d",
      text: "New mobility work added today.",
      image: "",
      likes: 4,
      comments: 1,
      liked: true,
      saved: false
    }
  ];

  renderPosts("profilePosts", profilePosts);
  setupPostActions("profilePosts", profilePosts);
});
