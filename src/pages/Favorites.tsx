import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, X, ArrowLeft } from "lucide-react";
import MovieCard from "../components/MovieCard";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Movie = {
  id: number; // Movie ID
  title: string; // Movie title
  posterUrl: string; // Poster image URL
  year?: string; // Release year (optional)
};

const Favorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]); // Store user's favorite movies
  const [loading, setLoading] = useState(true); // Loading state
  const [userId, setUserId] = useState<string | null>(null); // Firebase user ID
  const navigate = useNavigate();

  // Watch Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid); // Set user ID if logged in
      else {
        setUserId(null); // Reset if logged out
        setFavorites([]); // Clear favorites
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Fetch favorites from Firestore
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const favsRef = collection(db, "users", userId, "favorites");
        const snapshot = await getDocs(favsRef);
        const movies: Movie[] = snapshot.docs.map((doc) => ({
          id: doc.data().id,
          title: doc.data().title,
          posterUrl: doc.data().posterUrl,
          year: doc.data().year,
        }));
        setFavorites(movies); // Update state with fetched favorites
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFavorites();
  }, [userId]);

  // Remove a movie from favorites
  const removeFavorite = async (id: number) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, "users", userId, "favorites", String(id)));
      setFavorites((prev) => prev.filter((movie) => movie.id !== id)); // Update local state
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading your favorites...</p>; // Loading UI
  }

  // If user is not logged in
  if (!userId) {
    return (
      <div className="no-favorites-container">
        <Heart className="no-favorites-heart" />
        <h2 className="no-favorites-title">Login to View Favorites</h2>
        <p className="no-favorites-text">
          Your favorites are saved to your account. Please log in to access
          them.
        </p>
        <Link to="/login" className="no-favorites-button">
          Go to Login
        </Link>
      </div>
    );
  }

  // If user has no favorites
  if (favorites.length === 0) {
    return (
      <div className="no-favorites-container">
        <Heart className="no-favorites-heart" />
        <h2 className="no-favorites-title">No Favorites Yet</h2>
        <p className="no-favorites-text">
          Start building your collection by adding movies to your favorites.
        </p>
        <Link to="/" className="no-favorites-button">
          Discover Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      {/* Back button */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
        title="Go Back"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h2 className="favorites-title">Your Favorites</h2>
      <div className="movie-grid">
        {favorites.map((movie) => (
          <div key={movie.id} className="favorite-movie">
            <MovieCard
              id={movie.id}
              title={movie.title}
              year={movie.year}
              posterUrl={movie.posterUrl}
            />
            {/* Remove favorite button */}
            <button
              className="remove-fav-icon"
              onClick={() => removeFavorite(movie.id)}
              title="Remove from Favorites"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
