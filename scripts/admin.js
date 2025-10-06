// Import the Firebase SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { simpleEncrypt } from "./crypto-utils.js"; 
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";


// Note: The path "./crypto-utils.js" assumes both admin.js and crypto-utils.js are in the same 'scripts' folder.

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDz4XvrwVbE5vXFSxNm0MHKVXuR3lt49d0",
    authDomain: "eplq-b85ac.firebaseapp.com",
    projectId: "eplq-b85ac",
    storageBucket: "eplq-b85ac.firebasestorage.app",
    messagingSenderId: "1035731546590",
    appId: "1:1035731546590:web:ac093577c1bb8ccb0b6d4f",
    measurementId: "G-Y6Q8S4ZPJY"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a reference to the form
const uploadForm = document.getElementById("upload-form");

// Handle form submission and upload data to Firestore
if(uploadForm){
uploadForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const poiName = document.getElementById("poi-name").value;
    const poiLatitude = document.getElementById("poi-latitude").value;
    const poiLongitude = document.getElementById("poi-longitude").value;
    
    try {
        const docRef = await addDoc(collection(db, "pois"), {
            name: simpleEncrypt(poiName),
           // CRITICAL FIX: Use the correct variable names (poiLatitude, poiLongitude)
           latitude: simpleEncrypt(poiLatitude),
           longitude: simpleEncrypt(poiLongitude),
            timestamp: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
        alert("POI uploaded successfully!");
        uploadForm.reset(); 
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error uploading POI.");
    }
});
}


document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById("logout-link");
    
    // Check again to be absolutely sure the element exists
    if (logoutLink) {
        logoutLink.addEventListener('click', async function(event) {
            event.preventDefault(); 
            
            // Assuming 'app' is the initialized Firebase app instance in admin.js
            const auth = getAuth(app); 
            
            try {
                await signOut(auth);
                console.log("Admin signed out successfully. Redirecting to login page.");
                window.location.href = "index.html";
                
            } catch (error) {
                console.error("Logout failed:", error);
                alert("Logout failed. Check the console.");
            }
        });
    }
});

