// src/firebase/firebase.js (or whatever your path is)

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// These values are now read from the environment variables defined in your .env file
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgQ-NXLIkcsIN3c3j-NrmwtU9u7Z-dUO0",
  authDomain: "trusthaven-webapp.firebaseapp.com",
  projectId: "trusthaven-webapp",
  storageBucket: "trusthaven-webapp.firebasestorage.app",
  messagingSenderId: "596883432737",
  appId: "1:596883432737:web:725f3bd10104ef32248a60",
  measurementId: "G-0SWNDP36V0"
};
// VITE_CLOUD_FUNCTIONS_BASE_URL_PROD="https://us-central1-trusthaven-webapp.cloudfunctions.net"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Ensure analytics is set up if needed
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };