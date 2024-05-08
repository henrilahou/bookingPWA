// lgoinHandlers.js
import { login, register } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');

    loginButton.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        login(email, password)
            .then(() => console.log("User logged in"))
            .catch(error => console.error("Login failed", error));
    });

    registerButton.addEventListener('click', () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        register(email, password)
            .then(() => console.log("User registered"))
            .catch(error => console.error("Registration failed", error));
    });
});
