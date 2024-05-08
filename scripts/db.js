// db.js
// Documentation for Firestore: https://firebase.google.com/docs/firestore/quickstart
// Working with JavaScript Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

// Import the required SDKs from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, query, onSnapshot, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your web app's Firebase configuration (update this with your own settings)
const firebaseConfig = {
    apiKey: "AIzaSyBYXCSVFFH-BlIS9c2DYPtWNu7SvujGWvw",
    authDomain: "bookingpwa-6633f.firebaseapp.com",
    projectId: "bookingpwa-6633f",
    storageBucket: "bookingpwa-6633f.appspot.com",
    messagingSenderId: "149584466838",
    appId: "1:149584466838:web:0c5cf1dfdf1914412783b7",
    measurementId: "G-ZJWBH9PGQ1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to listen for changes in user data
function listenForUsers() {
    const usersQuery = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("User added: ", change.doc.data());
            } else if (change.type === "removed") {
                console.log("User removed: ", change.doc.id);
            }
        });
    });
    return unsubscribeUsers;
}

// Function to listen for changes in bookings
function listenForBookings() {
    const bookingsQuery = query(collection(db, "bookings"));
    const unsubscribeBookings = onSnapshot(bookingsQuery, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("Booking added: ", change.doc.data());
            } else if (change.type === "removed") {
                console.log("Booking removed: ", change.doc.id);
            }
        });
    });
    return unsubscribeBookings;
}

// Add new booking to Firestore
async function addBooking(bookingData) {
    try {
        const docRef = await addDoc(collection(db, "bookings"), bookingData);
        console.log("Booking added with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding booking: ", error);
    }
}

// Delete a booking from Firestore
async function deleteBooking(bookingId) {
    try {
        await deleteDoc(doc(db, "bookings", bookingId));
        console.log("Booking deleted: ", bookingId);
    } catch (error) {
        console.error("Error deleting booking: ", error);
    }
}

// Example usage (this code would be in your event handlers or initialization logic)
const unsubscribeUsers = listenForUsers();
const unsubscribeBookings = listenForBookings();

// Later in your code, when you no longer need to listen for changes (e.g., when user logs out)
unsubscribeUsers();
unsubscribeBookings();
