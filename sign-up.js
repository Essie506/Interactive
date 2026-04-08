console.log("sign-up.js loaded");
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
