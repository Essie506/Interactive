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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
