document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');

  // Safety check (prevents errors if HTML changes later)
  if (!loginBtn || !emailInput || !passwordInput) return;

  function updateLoginState() {
    const hasEmail = emailInput.value.trim().length > 0;
    const hasPassword = passwordInput.value.trim().length > 0;

    if (hasEmail && hasPassword) {
      loginBtn.classList.add("ready");
      loginBtn.disabled = false;
    } else {
      loginBtn.classList.remove("ready");
      loginBtn.disabled = true;
    }
  }

  // Input listeners
  emailInput.addEventListener("input", updateLoginState);
  passwordInput.addEventListener("input", updateLoginState);

  // Click handler
  loginBtn.addEventListener("click", () => {
    if (loginBtn.disabled) return; // extra safety
    window.location.href = "home.html";
  });

  // Initial state
  updateLoginState();
});
