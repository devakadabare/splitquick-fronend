import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmNAU3WumRH9hvjdQpWHN9M54RAZxmyhk",
  authDomain: "splitquick.online",
  projectId: "splitquick-a447c",
  storageBucket: "splitquick-a447c.firebasestorage.app",
  messagingSenderId: "838703610330",
  appId: "1:838703610330:web:f2a5c31f5629e0ec0068e3",
  measurementId: "G-2HRG5ENJG2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
