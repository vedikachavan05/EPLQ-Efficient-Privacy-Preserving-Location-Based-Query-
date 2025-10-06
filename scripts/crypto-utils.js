// A simple, fixed encryption key for demonstration purposes
// In a real application, this key would be managed much more securely
const ENCRYPTION_KEY = 'eplq-secret-key-2025'; 

// Simple XOR-based "encryption" for demonstration. 
// NOTE: This is NOT robust encryption, but serves to demonstrate the concept.
function simpleEncrypt(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        // XOR the character code with the key character code
        result += String.fromCharCode(text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return btoa(result); // Base64 encode the result to make it safe for Firestore
}

function simpleDecrypt(encryptedBase64Text) {
    // Check if the string looks like valid Base64 before trying to decode
    const isBase64 = /^[A-Za-z0-9+/=]+$/.test(encryptedBase64Text);
    
    if (!isBase64) {
        console.warn("Skipping decryption: Data does not appear to be Base64. Returning original text.");
        return encryptedBase64Text; // Return the original (plain) text if it's not encrypted
    }

    try {
        let decoded = atob(encryptedBase64Text); // Base64 decode it first
        let result = '';
        for (let i = 0; i < decoded.length; i++) {
            // XOR back to decrypt
            result += String.fromCharCode(decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
        }
        return result;
    } catch (e) {
        console.error("Decryption attempt failed for valid Base64:", e);
        return encryptedBase64Text; // Return original if decryption fails unexpectedly
    }
}

// We will use a basic distance calculation for the server-side proxy
// This will simulate the "Encrypted Search Token" matching
function isWithinEncryptedRadius(userLat, userLon, poiLat, poiLon, radius) {
    // For a real EPLQ, this function would use homomorphic encryption or similar
    // to compare ENCRYPTED locations. 
    // Here, we use the unencrypted Haversine but imagine this check is done blindly on the server.
    
    // Rerun the Haversine calculation here for clarity, though it's already in user.js
    const R = 6371; 
    const dLat = (poiLat - userLat) * (Math.PI / 180);
    const dLon = (poiLon - userLon) * (Math.PI / 180);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * (Math.PI / 180)) * Math.cos(poiLat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    
    return distance <= radius;
}


export { simpleEncrypt, simpleDecrypt, isWithinEncryptedRadius, ENCRYPTION_KEY };