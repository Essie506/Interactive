import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

console.log("sign-up.js loaded");

const signupForm = document.getElementById("signupForm");
console.log("signupForm:", signupForm);

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("FORM SUBMITTED");

    const formData = new FormData(signupForm);
    const displayName = formData.get("displayName")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";
    const accountType = formData.get("accountType")?.toString().trim() || "";

    if (!displayName || !email || !password || !accountType) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        displayName,
        email,
        accountType,
        verified: false,
        avatar: "",
        bio: "",
        role: accountType === "professional" ? "Trainer" : "Member",
        createdAt: serverTimestamp()
      });

      alert("Account created successfully");
      window.location.href = "profile.html";
    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Account already exists — try logging in");
      } else {
        alert(error.message);
      }
    }
  });
}
