
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3lJmk7RHo6MS3af3CJWLKGjZZf3N-Hb0",
  authDomain: "movie-favs-app.firebaseapp.com",
  projectId: "movie-favs-app",
  storageBucket: "movie-favs-app.firebasestorage.app",
  messagingSenderId: "887607945118",
  appId: "1:887607945118:web:3c43c90ea36b089388588f",
  measurementId: "G-F5R867JBCY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);