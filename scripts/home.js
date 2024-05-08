//home.js
// Import Firebase modules with Firestore query functionalities
import { db, auth } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { displayQRCode } from './displayQRCode.js';  // Assuming displayQRCode.js is correctly set up to export this function

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    auth.onAuthStateChanged(user => {
        const userEmailDisplay = document.getElementById('user-email-display');
        if (user) {
            userEmailDisplay.textContent = user.email; // Display user email in navbar
            fetchUserDetailsAndDisplayQRCode(user.uid);
            fetchUpcomingBookings(user.uid);
            fetchRecentActivities();
        } else {
            userEmailDisplay.textContent = 'Not signed in';
            console.log("No user is signed in.");
        }
    });
});

function fetchUserDetailsAndDisplayQRCode(userId) {
    const userRef = doc(db, "users", userId);
    getDoc(userRef).then((doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            if (userData.qrCode) {
                displayQRCode(userData.qrCode);  // Function to display QR code on the page
            } else {
                console.log("QR Code not found for user.");
            }
        } else {
            console.log("User data not found.");
        }
    }).catch(error => {
        console.error("Error fetching user details:", error);
    });
}

function fetchUpcomingBookings(userId) {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', userId), orderBy('date', 'asc'), limit(10));

    getDocs(q).then((querySnapshot) => {
        const bookingsContainer = document.querySelector('.upcoming-bookings');
        bookingsContainer.innerHTML = '';  // Clear existing bookings
        querySnapshot.forEach((doc) => {
            const booking = doc.data();
            bookingsContainer.innerHTML += `<div class="card-panel">
                <span>${booking.date.toDate()} - ${booking.location}</span>
            </div>`;
        });
    }).catch(error => console.error("Error fetching bookings:", error));
}

function fetchRecentActivities() {
    const activitiesRef = collection(db, 'activities');
    const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(10));

    getDocs(q).then((querySnapshot) => {
        const activitiesContainer = document.querySelector('.recent-activities');
        activitiesContainer.innerHTML = '';  // Clear existing entries
        querySnapshot.forEach((doc) => {
            const activity = doc.data();
            activitiesContainer.innerHTML += `<li class="collection-item">${activity.description}</li>`;
        });
    }).catch(error => console.error("Error fetching activities:", error));
}
