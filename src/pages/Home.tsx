// src/pages/Home.tsx
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import { useState } from "react";
import { searchMovies } from "../api/tmdb";

export default function Home() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    const results = await searchMovies(query);
    setSearchResults(results);
    setLoading(false);
  };

  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <SearchBar onSearch={handleSearch} />

      {loading && <p>Loading...</p>}

      {!loading && searchResults.length === 0 && (
        <div style={{ marginTop: "50px", opacity: 0.8 }}>
          <img
            src="https://img.icons8.com/?size=512&id=O5hC0QfI3nmm&format=png"
            alt="star"
            style={{ width: "60px", marginBottom: "10px" }}
          />
          <h2>Welcome to CineMax</h2>
          <p>
            Start by searching for your favorite movies. Discover new films,
            explore details, and create your personal watchlist.
          </p>
        </div>
      )}

      <div className="movie-grid">
        {searchResults.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            year={movie.release_date?.split("-")[0]}
            posterUrl={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Image"
            }
            id={0}
          />
        ))}
      </div>
    </main>
  );
}
