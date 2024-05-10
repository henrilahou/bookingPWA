// booking.js
import { db, auth } from './firebase-config';
import { collection, addDoc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', async event => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Verify user is logged in
        if (!auth.currentUser) {
            alert('Please log in to make a booking.');
            return;
        }

        // Extracting form data
        const formData = new FormData(bookingForm);
        const bookingData = {
            name: formData.get('name'),       // Assuming this is the name of the service or person being booked
            userId: auth.currentUser.uid,     // User making the booking
            date: formData.get('date'),
            time: formData.get('time'),
            notes: formData.get('notes') || 'No additional notes.' // Handle optional field
        };

        // Validate the data
        if (!validateBookingData(bookingData)) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        try {
            // Add booking to Firestore
            const docRef = await addDoc(collection(db, 'bookings'), bookingData);
            console.log("Booking added with ID: ", docRef.id);

            // Feedback to user and form reset
            alert('Your booking has been successfully added!');
            bookingForm.reset();
        } catch (error) {
            console.error('Error adding booking:', error);
            alert('There was a problem adding your booking. Please try again.');
        }
    });
});

function validateBookingData(data) {
    // Simple validation: Ensure all fields are filled and date is not in the past
    const now = new Date();
    const bookingDate = new Date(data.date + 'T' + data.time);
    return data.name && data.date && data.time && bookingDate >= now;
}

export { validateBookingData };
