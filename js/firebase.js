// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDyJVNgrFX3od1LYYyIVtdEq7O5-I34BTk",
  authDomain: "queuesmart-c3c28.firebaseapp.com",
  projectId: "queuesmart-c3c28",
  messagingSenderId: "709226546814",
  appId: "1:709226546814:web:6eb9be2f916298fd34fa2f",
  measurementId: "G-34TC8L9HJJ"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
