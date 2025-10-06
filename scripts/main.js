// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// firebase congig
const firebaseConfig = {
    apiKey: "AIzaSyDz4XvrwVbE5vXFSxNm0MHKVXuR3lt49d0",
    authDomain: "eplq-b85ac.firebaseapp.com",
    projectId: "eplq-b85ac",
    storageBucket: "eplq-b85ac.firebasestorage.app",
    messagingSenderId: "1035731546590",
    appId: "1:1035731546590:web:ac093577c1bb8ccb0b6d4f",
    measurementId: "G-Y6Q8S4ZPJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get references to all necessary HTML elements
const adminBtn = document.getElementById("admin-btn");
const userBtn = document.getElementById("user-btn");
const loginTitle = document.getElementById("login-title");
const loginForm = document.getElementById("login-form");
const registrationLinkContainer = document.getElementById("registration-link-container");
const userRegisterCard = document.getElementById("user-register-card");
const userRegisterForm = document.getElementById("user-register-form");
const backToLoginLink = document.getElementById("back-to-login-link");
const userRegisterLink = document.getElementById("user-register-link");

// Event listeners for role selection buttons
adminBtn.addEventListener('click', function() {
    userBtn.classList.remove("active");
    adminBtn.classList.add("active");
    loginTitle.textContent = "Admin Login";
});

userBtn.addEventListener('click', function() {
    adminBtn.classList.remove("active");
    userBtn.classList.add("active");
    loginTitle.textContent = "User Login";
});

// Event listener for showing the registration form
userRegisterLink.addEventListener('click', function(event) {
    event.preventDefault();
    loginForm.style.display = "none";
    registrationLinkContainer.style.display = "none";
    userRegisterCard.style.display = "block";
    loginTitle.style.display = "none"; 
});

// Event listener for going back to the login form
backToLoginLink.addEventListener('click', function(event) {
    event.preventDefault();
    loginForm.style.display = "flex";
    registrationLinkContainer.style.display = "block";
    userRegisterCard.style.display = "none";
    loginTitle.style.display = "block";
});

// Login Form Submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;

            // Redirect based on user type
            if (email === "admin2006@gmail.com") {
                console.log("Admin logged in. Redirecting...");
                window.location.href = "admin.html";
            } else {
                console.log("User logged in. Redirecting...");
                window.location.href = "user.html";
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Login failed:", errorCode, errorMessage);
            alert("Login failed: " + errorMessage);
        });
});

// Registration Form Submission
userRegisterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User registered:", user.email);
            alert("Registration successful! Welcome to EPLQ, " + user.email);
            loginForm.style.display = "flex";
            registrationLinkContainer.style.display = "block";
            userRegisterCard.style.display = "none";
            document.getElementById("email").value = email;
            document.getElementById("password").value = password;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Registration failed:", errorCode, errorMessage);
            alert("Registration failed: " + errorMessage);
        });
});