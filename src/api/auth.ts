import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";

// Logs in a user with email and password
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return Firebase user object
  } catch (error) {
    console.error("Firebase login error:", error);
    return null; // Return null if login fails
  }
};

// Registers a new user and sets their display name
export const register = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = userCredential.user;

    // Update displayName for the new user
    await updateProfile(user, { displayName: name });

    return user; // Return the registered user
  } catch (error: any) {
    console.error("Firebase registration error:", error);
    throw new Error(error.message || "Failed to register user");
  }
};
