import { FaCalendar, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = {
  id: number; // Movie ID for navigation
  title: string; // Movie title
  year?: string; // Release year (optional)
  posterUrl: string; // URL of movie poster
};

export default function MovieCard({ id, title, year, posterUrl }: Props) {
  const navigate = useNavigate();

  // Navigate to movie details page with movie data in state
  const handleViewDetails = () => {
    navigate(`/movie/${id}`, {
      state: { movie: { id, title, year, posterUrl } },
    });
  };

  return (
    <div className="movie-card">
      {/* Poster image with "View Details" button */}
      <div className="poster-container">
        <img src={posterUrl} alt={title} />
        <button className="view-details" onClick={handleViewDetails}>
          <FaEye size={14} />
          <span>View Details</span>
        </button>
      </div>

      {/* Movie title and release year */}
      <div className="movie-info">
        <h3>{title}</h3>
        <div className="movie-year">
          <FaCalendar size={14} />
          <span>{year || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
