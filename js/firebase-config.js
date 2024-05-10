// firebase-config.js
// Import the Firebase modules needed.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYXCSVFFH-BlIS9c2DYPtWNu7SvujGWvw",
  authDomain: "bookingpwa-6633f.firebaseapp.com",
  projectId: "bookingpwa-6633f",
  storageBucket: "bookingpwa-6633f.appspot.com",
  messagingSenderId: "149584466838",
  appId: "1:149584466838:web:0c5cf1dfdf1914412783b7",
  measurementId: "G-ZJWBH9PGQ1"
};

// Initialize Firebase.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
