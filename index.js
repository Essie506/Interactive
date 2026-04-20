import { auth, sendPasswordResetEmail } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const forgotBtn = document.getElementById("forgotPasswordBtn");
  const togglePassword = document.getElementById("togglePassword");

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
    window.location.href = "feed.html";
  });

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";

      togglePassword.innerHTML = isHidden
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
    });
  }

  if (forgotBtn && emailInput) {
    forgotBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();

      if (!email) {
        alert("Enter your email first");
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email);
        alert("If an account exists, a reset link has been sent.");
      } catch (error) {
        console.error("Password reset error:", error);
        alert(error.message);
      }
    });
  }

  updateLoginState();
});
