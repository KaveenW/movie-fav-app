import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";

type Movie = {
  id: number;
  title: string;
  year?: string;
  posterUrl: string;
  runtime?: string;
  genres?: string[];
  plot?: string;
  imdbRating?: number;
  tmdbRating?: number;
  cast?: string[];
  director?: string;
  released?: string;
  language?: string;
  country?: string;
};

export default function MovieDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie: Movie = location.state?.movie;

  if (!movie) {
    navigate("/");
    return null;
  }

  return (
    <main className="movie-details">
      {/* Back Button */}
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Search
      </div>

      {/* Poster */}
      <div className="poster-wrapper">
        <img src={movie.posterUrl} alt={movie.title} />
      </div>

      {/* Details */}
      <div className="details-wrapper">
        {/* Title + Favorites */}
        <div className="title-row">
          <h1>{movie.title}</h1>
          <button className="favorite-btn">Add to Favorites</button>
        </div>

        {/* Year + Runtime */}
        <div className="meta-row">
          <span>{movie.year}</span>
          <span>{movie.runtime || "N/A"}</span>
        </div>

        {/* Genres */}
        <div className="genres">
          {movie.genres?.map((g) => (
            <span key={g} className="genre">
              {g}
            </span>
          ))}
        </div>

        {/* Plot */}
        <div className="plot">
          <h2>Plot</h2>
          <p>{movie.plot}</p>
        </div>

        {/* Ratings */}
        <div className="ratings">
          <div>
            <FaStar />
            {movie.imdbRating || "N/A"}/10 IMDb
          </div>
          <div>
            <FaStar />
            {movie.tmdbRating || "N/A"}/10 TMDb
          </div>
        </div>

        {/* Cast */}
        <div className="cast">
          <h2>Cast</h2>
          <ul>
            {movie.cast?.map((actor) => (
              <li key={actor}>{actor}</li>
            ))}
          </ul>
        </div>

        {/* Extra Details */}
        <div className="details-card">
          <h2>Details</h2>
          <p>
            <span>Director:</span> {movie.director || "N/A"}
          </p>
          <p>
            <span>Released:</span> {movie.released || "N/A"}
          </p>
          <p>
            <span>Language:</span> {movie.language || "N/A"}
          </p>
          <p>
            <span>Country:</span> {movie.country || "N/A"}
          </p>
        </div>
      </div>
    </main>
  );
}
