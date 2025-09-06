import { FaCalendar, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = {
  id: number; // <-- add the movie ID
  title: string;
  year?: string;
  posterUrl: string;
};

export default function MovieCard({ id, title, year, posterUrl }: Props) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/movie/${id}`, {
      state: { movie: { id, title, year, posterUrl } }, // send movie data to details page
    });
  };

  return (
    <div className="movie-card">
      <div className="poster-container">
        <img src={posterUrl} alt={title} />
        <button className="view-details" onClick={handleViewDetails}>
          <FaEye size={14} />
          <span>View Details</span>
        </button>
      </div>

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
