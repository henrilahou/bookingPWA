// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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

// Register function
export function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Login function
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// Logout function
export function logout() {
    return signOut(auth);
}

// Auth state changes
onAuthStateChanged(auth, user => {
    if (user) {
        console.log("User is signed in:", user);
        // Handle logged in state
    } else {
        console.log("No user is signed in.");
        // Handle logged out state
    }
});
