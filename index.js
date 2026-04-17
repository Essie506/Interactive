document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!loginForm || !loginBtn || !emailInput || !passwordInput) return;

  function updateLoginState() {
    const hasEmail = emailInput.value.trim().length > 0;
    const hasPassword = passwordInput.value.trim().length > 0;
    const isReady = hasEmail && hasPassword;

    loginBtn.disabled = !isReady;
    loginBtn.classList.toggle("ready", isReady);
  }

  emailInput.addEventListener("input", updateLoginState);
  passwordInput.addEventListener("input", updateLoginState);

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) return;

    console.log("Login submitted", { email });
    // later: connect Firebase / backend auth here
  });

  updateLoginState();
});
