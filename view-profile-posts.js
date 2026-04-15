document.addEventListener("DOMContentLoaded", () => {
  const profilePostsContainer = document.getElementById("profilePosts");
  if (!profilePostsContainer) return;

  renderPosts("profilePosts", posts);
});
