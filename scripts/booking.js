//booking.js
document.addEventListener('DOMContentLoaded', function() {
    const videoElem = document.getElementById('qr-video');
    const form = document.getElementById('booking-form');
    const CodeReader = new ZXing.BrowserMultiFormatReader();

    let currentUserId = null; // This should be fetched based on your authentication method
    let scannedUserId = '';

    CodeReader.decodeFromVideoElement(videoElem).then(result => {
        scannedUserId = result.text;
        console.log(`Scanned user ID: ${scannedUserId}`);
    }).catch(err => console.error(err));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!scannedUserId) {
            M.toast({html: 'No QR code scanned!'});
            return;
        }

        const bookingDetails = {
            bookedBy: currentUserId,
            bookedWith: scannedUserId,
            time: form.time.value,
            location: form.location.value,
            status: 'pending'
        };

        try {
            const db = firebase.firestore(); // Make sure db is initialized elsewhere or do it here
            await db.collection('bookings').add(bookingDetails);
            M.toast({html: 'Booking created successfully!'});
            form.reset(); // Reset the form after successful booking
        } catch (error) {
            console.error('Error creating booking:', error);
            M.toast({html: 'Failed to create booking!'});
        }
    });
});
