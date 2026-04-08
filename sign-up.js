import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const displayName = formData.get("displayName").toString().trim();
    const email = formData.get("email").toString().trim();
    const password = formData.get("password").toString().trim();
    const accountType = formData.get("accountType").toString();

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
      console.error(error);
      alert(error.message);
    }
  });
}
