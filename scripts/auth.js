// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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

// Register function
export async function register(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        uid: userCredential.user.uid,
        createdAt: new Date()
    });
    return userCredential;
}

// Login function
export async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) {
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            uid: userCredential.user.uid,
            lastLogin: new Date()
        });
    } else {
        await setDoc(doc(db, "users", userCredential.user.uid), {
            lastLogin: new Date()
        }, { merge: true });
    }
    return userCredential;
}

// Logout function
export function logout() {
    return signOut(auth);
}

// Auth state changes
onAuthStateChanged(auth, user => {
    if (user) {
        console.log("User is signed in:", user);
        // Additional code to handle user's state or navigate
    } else {
        console.log("No user is signed in.");
        // Additional code to handle unauthenticated state
    }
});
