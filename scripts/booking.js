// booking.js - JavaScript for the booking page
import { db, auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc, Timestamp, doc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    let currentUserId = null;
    let currentUserName = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid;
            fetchUserNameByUid(user.uid).then(name => {
                currentUserName = name;
            });
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
                            const scannedQrCode = result.text;
                            document.getElementById('bookedWith').value = scannedQrCode; // Auto-fill the scanned QR code
                            fetchUserNameByQrCode(scannedQrCode).then(name => {
                                document.getElementById('bookedWithName').value = name;
                            });
                            CodeReader.reset();
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

    setupReader();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const bookedWith = document.getElementById('bookedWith').value;
        const bookedWithName = document.getElementById('bookedWithName').value;
        const time = new Date(form.time.value);
        const location = form.location.value;
        const note = form.note.value;

        if (!bookedWith) {
            console.error('No QR code scanned!');
            return;
        }

        const bookingDetails = {
            bookedBy: currentUserId,
            bookedByName: currentUserName,
            bookedWith,
            bookedWithName,
            time: Timestamp.fromDate(time),
            location,
            note,
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

    async function fetchUserNameByUid(userId) {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        return userDoc.exists() ? userDoc.data().name : 'N/A';
    }

    async function fetchUserNameByQrCode(qrCode) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("qrCode", "==", qrCode));
        const querySnapshot = await getDocs(q);
        let name = 'N/A';
        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                name = doc.data().name;
            }
        });
        return name;
    }
});
