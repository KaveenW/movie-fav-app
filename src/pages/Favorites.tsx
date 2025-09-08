import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, X } from "lucide-react";
import MovieCard from "../components/MovieCard";

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  year?: string;
};

const Favorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  const loadFavorites = () => {
    const stored = localStorage.getItem("favorites");
    setFavorites(stored ? JSON.parse(stored) : []);
  };

  // Load favorites on mount and whenever localStorage changes
  useEffect(() => {
    loadFavorites();
    const handleStorageChange = () => loadFavorites();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((movie) => movie.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0)
    return (
      <div className="no-favorites-container">
        <Heart className="no-favorites-heart" />
        <h2 className="no-favorites-title">No Favorites Yet</h2>
        <p className="no-favorites-text">
          Start building your collection by adding movies to your favorites.
          Click the heart icon on any movie card to add it here.
        </p>
        <Link to="/" className="no-favorites-button">
          Discover Movies
        </Link>
      </div>
    );

  return (
    <div className="favorites-page">
      <h2>Your Favorites</h2>
      <div className="movie-grid">
        {favorites.map((movie) => (
          <div key={movie.id} className="favorite-movie">
            <MovieCard
              id={movie.id}
              title={movie.title}
              year={movie.year}
              posterUrl={movie.posterUrl}
            />
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
