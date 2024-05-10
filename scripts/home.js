import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { displayQRCode } from './displayQRCode.js';
import { logout } from './auth.js';  // Import the logout function

let currentUserId = null;

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    auth.onAuthStateChanged(user => {
        const userEmailDisplay = document.getElementById('user-email-display');
        if (user) {
            currentUserId = user.uid; // Store current user ID
            userEmailDisplay.textContent = user.email; // Display user email in navbar
            fetchUserDetailsAndDisplayQRCode(user.uid);
        } else {
            userEmailDisplay.textContent = 'Not signed in';
            console.log("No user is signed in.");
        }
    });

    // Add event listener for logout button
    const logoutButton = document.getElementById('logout-button');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');
    logoutButton.addEventListener('click', handleLogout);
    logoutButtonMobile.addEventListener('click', handleLogout);
});

function handleLogout(event) {
    event.preventDefault();
    logout().then(() => {
        console.log("User logged out successfully.");
        window.location.href = 'pages/login.html'; // Redirect to login page
    }).catch(error => {
        console.error("Error logging out:", error);
    });
}

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
            fetchAndAppendBooking(booking, doc.id, bookingsContainer, false);
        });

        snapshot2.forEach(doc => {
            const booking = doc.data();
            console.log('Booking from q2:', booking);  // Logging the booking object from q2
            fetchAndAppendBooking(booking, doc.id, bookingsContainer, true);
        });
    }).catch(error => {
        console.error("Error fetching bookings:", error);
    });
}

async function fetchAndAppendBooking(booking, docId, container, isInvitee) {
    const bookingElement = document.createElement('div');
    bookingElement.className = 'card-panel';

    let bookingDate = 'Invalid Date';
    if (booking.time) {
        if (booking.time.toDate) {
            const date = booking.time.toDate();
            bookingDate = `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;
        } else if (typeof booking.time === 'string') {
            const date = new Date(booking.time);
            bookingDate = isNaN(date.getTime()) ? 'Invalid Date' : `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;
        }
    }

    console.log('Formatted Time:', bookingDate);

    let actionButtons = '';
    if (isInvitee && booking.status === 'pending') {
        actionButtons += `<button onclick="acceptBooking('${docId}')">Accept</button>`;
    }

    if (booking.bookedBy === currentUserId || booking.bookedWith === currentUserId) {
        actionButtons += `<button onclick="cancelBooking('${docId}')">Cancel</button>`;
    }

    // Fetch the participant's name based on whether the current user is the organizer or the invitee
    let participantName = isInvitee ? booking.bookedByName : await fetchUserNameByQRCode(booking.bookedWith);

    bookingElement.innerHTML = `
        <span>${bookingDate} - ${booking.location}</span><br>
        <span><strong>Meeting with:</strong> ${participantName || 'N/A'}</span><br>
        <span><strong>Note:</strong> ${booking.note || 'No additional notes'}</span><br>
        ${actionButtons}
    `;
    container.appendChild(bookingElement);
}

async function fetchUserNameByQRCode(qrCode) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("qrCode", "==", qrCode));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Assuming QR codes are unique
        return userDoc.data().name;
    }
    return 'N/A';
}

window.acceptBooking = function(bookingId) {
    const bookingRef = doc(db, 'bookings', bookingId);
    updateDoc(bookingRef, {
        status: 'accepted'
    }).then(() => {
        console.log('Booking accepted successfully');
        if (currentUserId) {
            fetchUserDetailsAndDisplayQRCode(currentUserId);
        }
    }).catch(error => {
        console.error("Error accepting booking:", error);
    });
}

window.cancelBooking = function(bookingId) {
    const bookingRef = doc(db, 'bookings', bookingId);
    deleteDoc(bookingRef).then(() => {
        console.log('Booking canceled successfully');
        if (currentUserId) {
            fetchUserDetailsAndDisplayQRCode(currentUserId);
        }
    }).catch(error => {
        console.error("Error canceling booking:", error);
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
