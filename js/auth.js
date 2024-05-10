// auth.js
import { auth, db } from './firebase-config';
import { doc, setDoc } from "firebase/firestore";

// Listen for authentication status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User logged in: ', user);
        // Optionally update UI or perform other actions on user login
    } else {
        console.log('User logged out');
        // Optionally handle user logout (e.g., redirect to login page)
    }
});

// Function to sign up a new user and create a user profile document in Firestore
async function signUp(email, password, name, role) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        console.log('User created: ', userCredential.user);
        // Create a user profile in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            name: name,
            role: role,
            createdAt: new Date() // Store the date of account creation
        });
        console.log('User profile created in Firestore');
    } catch (error) {
        console.error('Sign up failed:', error.message);
    }
}

// Function for user login
async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('User logged in: ', userCredential.user);
        // Further actions after login could be performed here
    } catch (error) {
        console.error('Login failed:', error.message);
    }
}

// Function for user logout
async function logout() {
    try {
        await auth.signOut();
        console.log('User signed out');
        // Further actions after logout could be performed here
    } catch (error) {
        console.error('Sign out failed:', error.message);
    }
}

export { signUp, login, logout };
