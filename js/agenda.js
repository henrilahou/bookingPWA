// agenda.js
import { db } from './firebase-config';
import { auth } from './firebase-config';
import { onSnapshot, collection, query, where } from "firebase/firestore";

// Function to fetch and display bookings for the logged-in user using real-time updates
function setupBookingsListener() {
    // Ensure the user is logged in
    if (auth.currentUser) {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("userId", "==", auth.currentUser.uid));

        onSnapshot(q, (snapshot) => {
            const bookings = [];
            snapshot.forEach(doc => {
                bookings.push({ id: doc.id, ...doc.data() });
            });
            displayBookings(bookings);
        }, (error) => {
            console.error("Failed to fetch bookings:", error);
        });
    } else {
        console.log("User not logged in, cannot fetch bookings.");
        // Handle the UI for logged out users or redirect
    }
}

// Function to display bookings on the agenda page
function displayBookings(bookings) {
    const agendaSection = document.querySelector('.agenda');
    agendaSection.innerHTML = ''; // Clear existing bookings display

    if (bookings.length === 0) {
        agendaSection.innerHTML = '<p>No upcoming appointments.</p>';
        return;
    }

    bookings.forEach(booking => {
        const bookingDiv = document.createElement('div');
        bookingDiv.className = 'appointment';
        bookingDiv.innerHTML = `
            <h3>${booking.name}</h3>
            <p>Date: ${booking.date}</p>
            <p>Time: ${booking.time}</p>
            <p>Notes: ${booking.notes || 'No additional notes.'}</p>
        `;
        agendaSection.appendChild(bookingDiv);
    });
}

// Initialize the display process when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupBookingsListener();
});

export { setupBookingsListener };
