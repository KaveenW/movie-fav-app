import { useEffect, useState, useRef } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../api/tmdb";
import { GiStarSwirl } from "react-icons/gi";
import { ImSpinner8 } from "react-icons/im";

export default function Home() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">("");

  const genresList = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMovies = async (searchQuery: string, pageNum: number) => {
    setLoading(true);

    const results = await searchMovies(searchQuery, pageNum, {
      genre: genre || undefined,
      year: year ? Number(year) : undefined,
      minRating: rating ? Number(rating) : undefined,
    });

    if (pageNum === 1) setSearchResults(results);
    else setSearchResults((prev) => [...prev, ...results]);

    setHasMore(results.length > 0);
    setLoading(false);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    fetchMovies(searchQuery, 1);
  };

  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(query, nextPage);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading, query, genre, year, rating]);

  return (
    <main className="home-container" ref={containerRef}>
      <SearchBar onSearch={handleSearch} />

      {/* Filters only appear after first search */}
      {query && (
        <div className="filters">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            {genresList.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value) || "")}
          />

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value) || "")}
          >
            <option value="">All Ratings</option>
            <option value={5}>5+ ⭐</option>
            <option value={6}>6+ ⭐</option>
            <option value={7}>7+ ⭐</option>
            <option value={8}>8+ ⭐</option>
          </select>

          <button onClick={() => handleSearch(query)}>Apply</button>
        </div>
      )}

      {/* Welcome Message */}
      {!loading && searchResults.length === 0 && query === "" && (
        <div className="center-piece">
          <GiStarSwirl size={70} color="#f39c12" />
          <h2>Welcome to CineMax</h2>
          <p>
            Start by searching for your favorite movies and discover new ones!
          </p>
        </div>
      )}

      {/* Movie Grid */}
      <div className="movie-grid">
        {searchResults.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            year={movie.release_date?.split("-")[0]}
            posterUrl={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Image"
            }
          />
        ))}
      </div>

      {loading && (
        <div className="loading-indicator">
          <ImSpinner8 className="spinner" size={30} color="yellow" />
          <p>Loading...</p>
        </div>
      )}

      {!loading && searchResults.length === 0 && query !== "" && (
        <div className="no-results-section">
          <div className="no-results-icon">🎬</div>
          <h2>No Movies Found</h2>
          <p>
            Try searching for a different movie title or check your spelling
          </p>
        </div>
      )}
    </main>
  );
}
