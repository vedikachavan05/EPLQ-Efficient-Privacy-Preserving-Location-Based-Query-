# EPLQ-Efficient-Privacy-Preserving-Location-Based-Query-
✨ Project Overview
EPLQ tackles the critical security challenge in Location-Based Services (LBS). While LBS is essential, it risks exposing a user's real-time location and sensitive Points of Interest (POIs).

This solution implements a robust, secure framework for performing spatial range queries, enabling users to efficiently find POIs within a defined radius while ensuring both the user's location and the POI coordinates remain encrypted on the server.

⚙️ How It Works: The Privacy Core
The system ensures privacy by enforcing a strict data flow where sensitive information is only ever decrypted on the client side, away from the publicly accessible server.

1. Data Ingestion (Admin)
The Admin Module receives raw POI coordinates (Lat, Lon) and immediately encrypts this data using a symmetric key before storage. Firebase only ever stores the ciphertext.

2. Query Execution (User)
Retrieval: The user.js script retrieves all encrypted POIs from Firestore.

Client-Side Decryption: The script uses a local decryption utility (crypto-utils.js) to reveal the plaintext coordinates (Lat_POI, Lon_POI) only on the user's device.

Spatial Calculation: The script uses the Haversine formula to calculate the precise distance between the User's location and the POI.

Filtering: Only POIs confirmed to be within the search radius are displayed, preserving the privacy of all other data.

✅ Current Status & Core Functionality
The core functional requirements for the EPLQ system are 100% complete and deployed.

Module	Feature	Status
Authentication	Secure Admin and User login/logout via Firebase Auth.	Fully Functional
Admin Panel	Encrypts and uploads new POI data to Firestore.	Fully Functional
User Search	Captures user location (Geolocation/Manual) and executes the encrypted query.	Fully Functional
Frontend	Fully responsive and optimized dashboard layout for all device sizes.	Fully Functional

Export to Sheets
🚀 Future Enhancements (Add-Ons)
To achieve maximum security and performance, the following architectural upgrades are planned:

Server-Side Decryption (True Privacy): Migrate the decryption key and logic to Firebase Cloud Functions. This will hide the key entirely from the client-side code, eliminating the current security risk of client-side key exposure and realizing true privacy preservation.

Advanced Indexing: Implement the proposed privacy-preserving tree index structure to significantly optimize spatial query latency for large datasets.

User POI Contribution: Develop a secure feature allowing authenticated users to submit new POIs (pending admin approval).

Admin User Management: Integrate full CRUD operations for managing user accounts within the Admin panel.

🛠️ Tech Stack & Setup
Core: JavaScript (ES6+), HTML5, CSS3

Backend & DB: Firebase (Cloud Firestore & Authentication)

Quick Start
Clone the repository.

Ensure your Firebase configuration is set up in user.js and admin.js.

Run index.html using a local server (e.g., Live Server) to begin the application workflow.

