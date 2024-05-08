// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBYXCSVFFH-BlIS9c2DYPtWNu7SvujGWvw",
    authDomain: "bookingpwa-6633f.firebaseapp.com",
    projectId: "bookingpwa-6633f",
    storageBucket: "bookingpwa-6633f.appspot.com",
    messagingSenderId: "149584466838",
    appId: "1:149584466838:web:0c5cf1dfdf1914412783b7",
    measurementId: "G-ZJWBH9PGQ1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
