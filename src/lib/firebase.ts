import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "xxxx",
  authDomain: "splitquick-a447c.firebaseapp.com",
  projectId: "splitquick-a447c",
  storageBucket: "splitquick-a447c.firebasestorage.app",
  messagingSenderId: "xx",
  appId: "xxx",
  measurementId: "xx",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
