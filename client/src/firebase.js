// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Remote Config
import { getRemoteConfig } from "firebase/remote-config";
const remoteConfig = getRemoteConfig(app);

// Set default values
remoteConfig.defaultConfig = {
    "latest_version": "3.0.0",
    "min_required_version": "1.0.0",
    "show_feature_banner": false,
    "feature_banner_text": "New Feature Available!",
    "feature_banner_link": "/about-feature",
    "feature_detail_title": "Introducing SpendWise Premium",
    "feature_detail_description": "Upgrade to unlock unlimited budgets, custom categories, and offline sync. Experience the best of SpendWise today!",
    "feature_detail_image": ""
};

// Development settings (fetch more often)
if (import.meta.env.DEV) {
    remoteConfig.settings.minimumFetchIntervalMillis = 0; // Fetch immediately in dev
} else {
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour in prod
}

export { auth, googleProvider, remoteConfig };
