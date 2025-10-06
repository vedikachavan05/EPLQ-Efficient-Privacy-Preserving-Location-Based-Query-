// user.js - Final Corrected Code

// ====================================================================
// 1. FIREBASE INITIALIZATION AND POI RETRIEVAL (STAY HERE)
// ====================================================================

// **CRITICAL: THESE IMPORTS MUST BE AT THE VERY TOP**
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { simpleDecrypt } from "./crypto-utils.js"; // Import the decryption function
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";


// Your web app's Firebase configuration (Please verify this is correct)
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


// Global variables for Element References (initialized later in DOMContentLoaded)
let locationForm;
let getLocationBtn;
let userLatitudeInput;
let userLongitudeInput;
let resultsContainer;


// ====================================================================
// 3. HELPER FUNCTIONS (Stay here as they don't directly reference the DOM when defined)
// ====================================================================

// Function to handle getting the user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log("Location obtained automatically:", { latitude: latitude, longitude: longitude });
                // These global variables are guaranteed to be defined by the time this runs
                userLatitudeInput.value = latitude;
                userLongitudeInput.value = longitude;
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Could not get your location. Please enter it manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Function to retrieve all POIs from Firestore (now with decryption)
async function getAllPOIs() {
    const pois = [];
    try {
        const querySnapshot = await getDocs(collection(db, "pois"));
        querySnapshot.forEach((doc) => {
            const encryptedData = doc.data();
            
            const decryptedPOI = {
                id: doc.id,
                name: simpleDecrypt(encryptedData.name),
                latitude: simpleDecrypt(encryptedData.latitude),
                longitude: simpleDecrypt(encryptedData.longitude),
                timestamp: encryptedData.timestamp 
            };
            
            pois.push(decryptedPOI);
        });
        return pois;
    } catch (e) {
        console.error("Error retrieving and decrypting POIs:", e);
        // resultsContainer is defined globally but might be null if accessed outside DOMContentLoaded
        // We'll rely on it being defined when called from the submit listener.
        if (resultsContainer) {
            resultsContainer.innerHTML = "<p style='color:red;'>Error connecting to the database. Check console for details.</p>";
        }
        return [];
    }
}

// Function to calculate the distance (Haversine Formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}


// ====================================================================
// 4. MAIN LOGIC AND EVENT LISTENERS (MOVED INSIDE DOMContentLoaded)
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // **2. ELEMENT REFERENCES - INITIALIZED HERE TO PREVENT NULL ERRORS**
    locationForm = document.getElementById("location-form");
    getLocationBtn = document.getElementById("get-location-btn");
    userLatitudeInput = document.getElementById("user-latitude");
    userLongitudeInput = document.getElementById("user-longitude");
    resultsContainer = document.getElementById("results-container");
    const logoutLink = document.getElementById("logout-link"); // Local reference for logout

    // Input validation: If any critical element is missing, log an error and exit.
    if (!locationForm || !getLocationBtn || !userLatitudeInput || !userLongitudeInput || !resultsContainer) {
        console.error("CRITICAL ERROR: One or more required HTML elements (form, button, inputs, results container) were not found.");
        // Prevent listeners from being added on null elements.
        return; 
    }

    // Event listener for the "Get My Location" button
    getLocationBtn.addEventListener('click', getUserLocation);

    // MAIN: Event listener for the Search form submission (The core logic)
    locationForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const userLatitude = parseFloat(userLatitudeInput.value);
        const userLongitude = parseFloat(userLongitudeInput.value);
        const SEARCH_RADIUS_KM = 10; 

        // Clear previous results
        resultsContainer.innerHTML = "<p>Searching...</p>";

        // 1. Retrieve all POIs from the database
        const allPOIs = await getAllPOIs();
        
        // 2. Filter POIs based on distance
        const nearbyPOIs = allPOIs.filter(poi => {
            
            // Input validation for POI coordinates
            const poiLat = parseFloat(poi.latitude);
            const poiLon = parseFloat(poi.longitude);
            
            if (isNaN(poiLat) || isNaN(poiLon)) {
                console.warn(`Skipping POI ${poi.id}: Invalid coordinates.`);
                return false;
            }
            
            const distance = calculateDistance(userLatitude, userLongitude, poiLat, poiLon);
            poi.distance = distance.toFixed(2); // Add the distance to the POI object

            return distance <= SEARCH_RADIUS_KM;
        });

        console.log(`Search completed. Found ${nearbyPOIs.length} POIs within ${SEARCH_RADIUS_KM} km.`);
        console.table(nearbyPOIs); 
        
        // 3. Display Results Functionality
        if (nearbyPOIs.length === 0) {
            resultsContainer.innerHTML = "<p>No POIs found within 10 km.</p>";
        } else {
            let html = `<h3>Found ${nearbyPOIs.length} place(s) nearby:</h3><ul class="poi-list">`;
            
            // Optional: Sort by distance
            nearbyPOIs.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            
            nearbyPOIs.forEach(poi => {
                html += `
                    <li>
                        <strong>${poi.name}</strong> 
                        <span>(${poi.distance} km away)</span>
                    </li>`;
            });
            
            html += `</ul>`;
            resultsContainer.innerHTML = html;
        } 
    });

    // 5. AUTHENTICATION LOGIC (Logout)
    if (logoutLink) {
        logoutLink.addEventListener('click', async function(event) {
            event.preventDefault(); 
            
            // 'app' is accessible because it was defined outside the DOMContentLoaded block
            const auth = getAuth(app); 
            
            try {
                await signOut(auth);
                console.log("User signed out successfully. Redirecting to login page.");
                window.location.href = "index.html"; 
                
            } catch (error) {
                console.error("Logout failed:", error);
                alert("Logout failed. Check the console.");
            }
        });
    }
});