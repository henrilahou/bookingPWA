// lgoinHandlers.js
import { login, register } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');

    loginButton.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        login(email, password)
            .then(() => {
                console.log("User logged in");
                // Redirect to another page, e.g., home page
                window.location.href = '../index.html';  // Update with the correct path
            })
            .catch(error => console.error("Login failed", error));
    });

    registerButton.addEventListener('click', () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        register(email, password)
            .then(() => {
                console.log("User registered");
                // Optionally redirect after registration
                window.location.href = '../index.html';  // Update with the correct path
            })
            .catch(error => console.error("Registration failed", error));
    });
});
