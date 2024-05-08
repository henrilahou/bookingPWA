import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle user registration
function register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User registered:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error registering user:", error.message);
        });
}

// Function to handle user login
function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
        });
}

// Function to handle user logout
function logout() {
    signOut(auth).then(() => {
        console.log("User signed out");
    }).catch((error) => {
        console.error("Error signing out:", error.message);
    });
}

// Real-time listener for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user);
    } else {
        console.log("No user is signed in.");
    }
});

export { register, login, logout };
