// database.js
// Ensure to import Firebase config and Firestore methods using ES module imports if needed
import { db } from './firebase-config';
import { collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Function to add a booking to Firestore
export const addBooking = async (booking) => {
    try {
        const docRef = await addDoc(collection(db, 'bookings'), booking);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;  // Returns the document reference ID
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error('Failed to add booking.');
    }
};

// Function to get all bookings from Firestore
export const getBookings = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error('Failed to retrieve bookings.');
    }
};

// Function to get bookings for a specific user
export const getUserBookings = async (userId) => {
    try {
        const q = query(collection(db, 'bookings'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error getting documents for user: ", e);
        throw new Error('Failed to retrieve user bookings.');
    }
};
