// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6QJ3uLunEXntFx8pzVV73JGCIUIxhmW4",
  authDomain: "capital-coders.firebaseapp.com",
  projectId: "capital-coders",
  storageBucket: "capital-coders.firebasestorage.app",
  messagingSenderId: "332284931614",
  appId: "1:332284931614:web:b3f9fd35a7a44a8016480f"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);