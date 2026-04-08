import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("FORM SUBMITTED"); // 👈 add this

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
