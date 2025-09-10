// api/auth.ts
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Firebase user object
  } catch (error) {
    console.error("Firebase login error:", error);
    return null;
  }
};

export const register = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = userCredential.user;

    // ✅ Update displayName on Firebase
    await updateProfile(user, { displayName: name });

    return user;
  } catch (error: any) {
    console.error("Firebase registration error:", error);
    throw new Error(error.message || "Failed to register user");
  }
};

// No need for getCurrentUser() or isAuthenticated() anymore
