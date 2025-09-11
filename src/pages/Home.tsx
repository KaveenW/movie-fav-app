import { useEffect, useState, useRef } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../api/tmdb";
import { GiStarSwirl } from "react-icons/gi";
import { ImSpinner8 } from "react-icons/im";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [searchResults, setSearchResults] = useState<any[]>([]); // Movies to display
  const [loading, setLoading] = useState(false); // Loading state
  const [query, setQuery] = useState(""); // Current search query
  const [page, setPage] = useState(1); // Pagination page
  const [hasMore, setHasMore] = useState(true); // For infinite scroll

  const location = useLocation();
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null); // Temporary welcome message

  // Show welcome message if redirected with state
  useEffect(() => {
    if (location.state?.message) {
      setWelcomeMessage(location.state.message);
      const timer = setTimeout(() => setWelcomeMessage(null), 3000); // Auto-hide
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Filters
  const [genre, setGenre] = useState(""); // Selected genre filter
  const [year, setYear] = useState<number | "">(""); // Selected year filter

  const genresList = [
    // Available genres
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

  // Fetch movies from TMDB
  const fetchMovies = async (searchQuery: string, pageNum: number) => {
    setLoading(true);

    const results = await searchMovies(searchQuery, pageNum, {
      genre: genre || undefined,
      year: year ? Number(year) : undefined,
    });

    let filteredResults = results;

    // Additional client-side filtering for search query
    if (searchQuery && genre) {
      filteredResults = results.filter((movie: { genre_ids: number[] }) =>
        movie.genre_ids.includes(Number(genre))
      );
    }
    if (searchQuery && year) {
      filteredResults = filteredResults.filter(
        (movie: { release_date: string }) =>
          movie.release_date?.startsWith(String(year))
      );
    }

    if (pageNum === 1)
      setSearchResults(filteredResults); // Reset for new search
    else setSearchResults((prev) => [...prev, ...filteredResults]); // Append for infinite scroll

    setHasMore(filteredResults.length > 0); // Check if more results available
    setLoading(false);
  };

  // Trigger search
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    fetchMovies(searchQuery, 1);
  };

  // Apply genre/year filters
  const handleApplyFilters = () => {
    setPage(1);
    fetchMovies(query, 1);
  };

  // Load more movies on scroll
  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(query, nextPage);
  };

  // Infinite scroll listener
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
  }, [page, hasMore, loading, query, genre, year]);

  return (
    <main className="home-container" ref={containerRef}>
      <SearchBar onSearch={handleSearch} />

      {/* Filters */}
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

        <button onClick={handleApplyFilters}>Apply</button>
      </div>

      {/* Welcome Message / Hero Section */}
      {!loading && searchResults.length === 0 && query === "" && (
        <div className="center-piece">
          <GiStarSwirl size={70} color="#f39c12" />
          <h2>Welcome to CineMax</h2>
          <p>Start by selecting a genre or searching for a movie!</p>
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

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-indicator">
          <ImSpinner8 className="spinner" size={30} color="yellow" />
          <p>Loading...</p>
        </div>
      )}

      {/* No results message */}
      {!loading && searchResults.length === 0 && query !== "" && (
        <div className="no-results-section">
          <div className="no-results-icon">🎬</div>
          <h2>No Movies Found</h2>
          <p>Try selecting a different genre or year</p>
        </div>
      )}
    </main>
  );
}
