// main.js
// Import necessary Firebase modules
import { app } from './firebase-config';
import { formatDate } from './utils'; // Assuming you have a utility script for common functions

// Check if service workers are supported and register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.error('ServiceWorker registration failed: ', err);
            });
    });
}

// Example of initializing global event listeners or UI components
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // Initialize any components or perform startup tasks here
});

// Function to handle network requests with a timeout
function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;  // Default timeout is set to 8000 milliseconds

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return fetch(resource, {
        ...options,
        signal: controller.signal
    }).then(response => {
        clearTimeout(id);
        return response;
    }).catch(error => {
        console.log('Fetch timed out: ', error);
        throw error;
    });
}

export { fetchWithTimeout };
