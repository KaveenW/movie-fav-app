import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

interface UserContextType {
  user: User | null; // Currently logged-in user
  setUser: (user: User | null) => void; // Update user state
  welcomeMessage: string | null; // Optional welcome message
  setWelcomeMessage: (msg: string | null) => void; // Update welcome message
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  welcomeMessage: null,
  setWelcomeMessage: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Track logged-in user
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null); // Track welcome message
  const [loading, setLoading] = useState(true); // Loading state while checking auth

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
      setLoading(false); // Stop loading once auth state is known
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>; // Show loading UI
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, welcomeMessage, setWelcomeMessage }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to consume UserContext
export const useUser = () => useContext(UserContext);
