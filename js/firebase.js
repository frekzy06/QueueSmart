import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyJVNgrFX3od1LYYyIVtdEq7O5-I34BTk",
  authDomain: "queuesmart-c3c28.firebaseapp.com",
  projectId: "queuesmart-c3c28",
  storageBucket: "queuesmart-c3c28.firebasestorage.app",
  messagingSenderId: "709226546814",
  appId: "1:709226546814:web:6eb9be2f916298fd34fa2f",
  measurementId: "G-34TC8L9HJJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
