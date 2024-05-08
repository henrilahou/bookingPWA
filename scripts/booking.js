// booking.js
// Import Firebase functions and variables from a central config module
import { db, auth } from './firebase-config.js';  // Assuming firebase-config.js correctly exports these
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    let currentUserId = null;

    // Auth state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid;
        } else {
            window.location.href = '../pages/login.html'; // Redirect to login if not logged in
        }
    });

    const videoElem = document.getElementById('qr-video');
    const CodeReader = new ZXing.BrowserMultiFormatReader();
    const form = document.getElementById('booking-form');

    function setupReader() {
        CodeReader.listVideoInputDevices()
            .then((videoInputDevices) => {
                if (videoInputDevices.length > 0) {
                    CodeReader.decodeFromVideoDevice(videoInputDevices[0].deviceId, videoElem, (result, err) => {
                        if (result) {
                            document.getElementById('bookedWith').value = result.text; // Auto-fill the scanned ID
                            CodeReader.reset();  // Reset after successful scan
                        }
                        if (err && !(err instanceof ZXing.NotFoundException)) {
                            console.error('Error scanning QR code:', err);
                        }
                    });
                }
            }).catch((err) => {
                console.error('Error setting up video input devices:', err);
            });
    }

    setupReader();  // Setup QR Code reader on page load

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const bookedWith = document.getElementById('bookedWith').value;
        const time = form.time.value;
        const location = form.location.value;

        if (!bookedWith) {
            console.error('No QR code scanned!');
            return;
        }

        const bookingDetails = {
            bookedBy: currentUserId,
            bookedWith,
            time,
            location,
            status: 'pending'
        };

        try {
            await addDoc(collection(db, "bookings"), bookingDetails);
            console.log('Booking created successfully!');
            form.reset();
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    });
});
