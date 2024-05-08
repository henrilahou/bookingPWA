//home.js
// Import Firebase modules with Firestore query functionalities
import { db, auth } from './firebase-config.js';
import { collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    auth.onAuthStateChanged(user => {
        if (user) {
            fetchUpcomingBookings(user.uid);
            fetchRecentActivities();
        } else {
            console.log("No user is signed in.");
        }
    });
});

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
