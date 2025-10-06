// Import the necessary Firebase functions for authentication
import { getAuth, updatePassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Re-initialize Firebase Config (Copy from your user.js or main.js)
const firebaseConfig = {
    apiKey: "AIzaSyDz4XvrwVbE5vXFSxNm0MHKVXuR3lt49d0",
    authDomain: "eplq-b85ac.firebaseapp.com",
    projectId: "eplq-b85ac",
    storageBucket: "eplq-b85ac.firebasestorage.app",
    messagingSenderId: "1035731546590",
    appId: "1:1035731546590:web:ac093577c1bb8ccb0b6d4f",
    measurementId: "G-Y6Q8S4ZPJY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ELEMENT REFERENCES
const passwordForm = document.getElementById("change-password-form");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const statusDiv = document.getElementById("account-status");

// Ensure user is logged in before allowing actions (a good practice)
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // If no user is logged in, redirect them to the login page
        window.location.href = "index.html"; 
    }
});


// MAIN EVENT LISTENER: Change Password
passwordForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const user = auth.currentUser;
    
    statusDiv.textContent = ''; // Clear previous messages
    
    if (newPassword !== confirmPassword) {
        statusDiv.textContent = "Error: Passwords do not match.";
        statusDiv.style.color = 'red';
        return;
    }

    if (newPassword.length < 6) {
        statusDiv.textContent = "Error: Password must be at least 6 characters.";
        statusDiv.style.color = 'red';
        return;
    }

    if (user) {
        try {
            await updatePassword(user, newPassword);
            statusDiv.textContent = "Success! Password updated.";
            statusDiv.style.color = 'green';
            passwordForm.reset();
            
            // NOTE: Firebase requires re-authentication after a short period.
            // Best practice is to log them out or prompt them to log in again.
            await signOut(auth);
            alert("Password updated successfully. Please log in again with your new password.");
            window.location.href = "index.html";


        } catch (error) {
            console.error("Password update failed:", error.code, error.message);
            statusDiv.textContent = `Error: ${error.message}. (You may need to log out and log in again to refresh your session.)`;
            statusDiv.style.color = 'red';
        }
    } else {
        statusDiv.textContent = "Error: You must be logged in to change your password.";
        statusDiv.style.color = 'red';
    }
});