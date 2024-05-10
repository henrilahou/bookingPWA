// Import Firebase modules with Firestore query functionalities
import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
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
                fetchUpcomingBookings(userId, userData.qrCode);  // Fetch bookings for both userId and qrCode
                fetchRecentActivities();
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

function fetchUpcomingBookings(userId, qrCode) {
    const bookingsRef = collection(db, 'bookings');
    // Query for bookings where the current user is the organizer or the invitee and sort by date
    const q1 = query(bookingsRef, where('bookedBy', '==', userId), orderBy('time', 'asc'));
    const q2 = query(bookingsRef, where('bookedWith', '==', qrCode), orderBy('time', 'asc'));

    Promise.all([getDocs(q1), getDocs(q2)]).then(([snapshot1, snapshot2]) => {
        const bookingsContainer = document.querySelector('.upcoming-bookings');
        bookingsContainer.innerHTML = '';  // Clear existing bookings

        snapshot1.forEach(doc => {
            const booking = doc.data();
            console.log('Booking from q1:', booking);  // Logging the booking object from q1
            appendBookingToDOM(booking, doc.id, bookingsContainer);
        });

        snapshot2.forEach(doc => {
            const booking = doc.data();
            console.log('Booking from q2:', booking);  // Logging the booking object from q2
            appendBookingToDOM(booking, doc.id, bookingsContainer);
        });
    }).catch(error => {
        console.error("Error fetching bookings:", error);
    });
}

function appendBookingToDOM(booking, docId, container) {
    const bookingElement = document.createElement('div');
    bookingElement.className = 'card-panel';

    let bookingDate = 'Invalid Date';
    if (booking.time) {
        if (booking.time.toDate) {  // Check if it is a Firestore Timestamp
            const date = booking.time.toDate();
            bookingDate = `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;
        } else if (typeof booking.time === 'string') {  // If it is a string, attempt to parse it
            const date = new Date(booking.time);
            bookingDate = isNaN(date.getTime()) ? 'Invalid Date' : `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;
        }
    }

    console.log('Formatted Time:', bookingDate);  // Logging the formatted time

    bookingElement.innerHTML = `
        <span>${bookingDate} - ${booking.location}</span>
        ${booking.status === 'pending' ? `<button onclick="acceptBooking('${docId}')">Accept</button>` : ''}
    `;
    container.appendChild(bookingElement);
}

window.acceptBooking = function(bookingId) {  // Make this function global to access from inline HTML
    const bookingRef = doc(db, 'bookings', bookingId);
    updateDoc(bookingRef, {
        status: 'accepted'
    }).then(() => {
        console.log('Booking accepted successfully');
        const currentUser = auth.currentUser;
        if (currentUser) {
            fetchUserDetailsAndDisplayQRCode(currentUser.uid);  // Refresh bookings list
        }
    }).catch(error => {
        console.error("Error accepting booking:", error);
    });
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
