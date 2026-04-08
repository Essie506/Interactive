import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhR7mwSjPT6PXQ0PHJ0z4IwLr0OPmXPNA",
  authDomain: "interactive-273c0.firebaseapp.com",
  projectId: "interactive-273c0",
  storageBucket: "interactive-273c0.firebasestorage.app",
  messagingSenderId: "760620887389",
  appId: "1:760620887389:web:1c13d62578c879b62c4cb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("sign-up.js loaded");
console.log("createUserWithEmailAndPassword:", createUserWithEmailAndPassword);

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

      window.location.href = "profile.html";
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  });
}
