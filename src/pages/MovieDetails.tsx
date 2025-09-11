import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Clock, Heart, Users } from "lucide-react";
import {
  getMovieDetails,
  getMovieCredits,
  getRecommendedMovies,
  getImageUrl,
  getBackdropUrl,
} from "../api/tmdb";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};
type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number;
  overview: string;
  tagline?: string;
  genres: { id: number; name: string }[];
};

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadMovieDetails(parseInt(id));
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId || !movie) return;
      try {
        const favRef = doc(db, "users", userId, "favorites", String(movie.id));
        const favSnap = await getDoc(favRef);
        setIsFav(favSnap.exists());
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };
    checkFavorite();
  }, [userId, movie]);

  const loadMovieDetails = async (movieId: number) => {
    try {
      setIsLoading(true);
      const [movieResponse, creditsResponse, recommendationsResponse] =
        await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getRecommendedMovies(movieId),
        ]);
      setMovie(movieResponse);
      setCast(creditsResponse.cast.slice(0, 5));
      setRecommendations(recommendationsResponse.results.slice(0, 12));
    } catch (error) {
      console.error("Error loading movie details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRuntime = (minutes: number) =>
    !minutes ? "N/A" : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  const formatYear = (dateString: string) =>
    dateString ? new Date(dateString).getFullYear() : "N/A";
  const formatRating = (rating: number) => (rating ? rating.toFixed(1) : "N/A");

  const toggleFavorite = async () => {
    if (!movie || !userId) {
      alert("Please log in to save favorites.");
      return;
    }

    const favRef = doc(db, "users", userId, "favorites", String(movie.id));

    try {
      if (isFav) {
        await deleteDoc(favRef);
        setIsFav(false);
      } else {
        await setDoc(favRef, {
          id: movie.id,
          title: movie.title,
          posterUrl: getImageUrl(movie.poster_path ?? "", "w500"),
          year: formatYear(movie.release_date),
        });
        setIsFav(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (isLoading)
    return (
      <div className="movie-details-loading">
        <div className="loading-text">Loading...</div>
      </div>
    );

  if (!movie)
    return (
      <div className="movie-details-loading">
        <div className="not-found">
          <h1>Movie Not Found</h1>
          <button onClick={() => navigate(-1)} className="btn-netflix">
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="movie-details-page">
      <main>
        <div
          className="movie-hero"
          style={{
            backgroundImage: `url(${getBackdropUrl(
              movie.backdrop_path ?? ""
            )})`,
          }}
        >
          <div className="movie-hero-overlay">
            <div className="movie-hero-content">
              <img
                src={getImageUrl(movie.poster_path ?? "", "w500")}
                alt={movie.title}
                className="movie-hero-poster"
              />
              <div className="movie-hero-info">
                <div className="movie-hero-header">
                  <h1>{movie.title}</h1>
                </div>

                {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}
                <div className="movie-genres">
                  {movie.genres.map((g) => (
                    <span key={g.id}>{g.name}</span>
                  ))}
                </div>
                <div className="movie-stats">
                  <span>
                    <Star /> {formatRating(movie.vote_average)} (
                    {movie.vote_count})
                  </span>
                  <span>
                    <Calendar /> {formatYear(movie.release_date)}
                  </span>
                  <span>
                    <Clock /> {formatRuntime(movie.runtime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Back Button */}
        <div className="back-link">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft /> Back
          </button>
        </div>

        <div className="fav-section">
          {userId && (
            <button
              className={`fav-button ${isFav ? "active" : ""}`}
              onClick={toggleFavorite}
            >
              <Heart className="heart-icon" />
              {isFav ? "Added to Favorites" : "Add to Favorites"}
            </button>
          )}
        </div>
        <section className="movie-info-section">
          <h2>Overview</h2>
          <p className="movie-overview">{movie.overview}</p>
        </section>

        {cast.length > 0 && (
          <section className="cast-section">
            <h2>
              <Users /> Cast
            </h2>
            <div className="cast-grid">
              {cast.map((actor) => (
                <div key={actor.id} className="cast-card">
                  <img
                    src={
                      actor.profile_path
                        ? getImageUrl(actor.profile_path, "w185")
                        : "/placeholder.svg"
                    }
                    alt={actor.name}
                  />
                  <h3>{actor.name}</h3>
                  <p>{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {recommendations.length > 0 && (
          <section className="recommendations-section">
            <h2>More Like This</h2>
            <div className="movie-grid">
              {recommendations.map((rec) => (
                <MovieCard
                  key={rec.id}
                  id={rec.id}
                  title={rec.title}
                  year={rec.release_date?.split("-")[0]}
                  posterUrl={
                    rec.poster_path
                      ? `https://image.tmdb.org/t/p/w200${rec.poster_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
