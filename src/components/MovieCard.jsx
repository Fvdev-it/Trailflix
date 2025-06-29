import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, onOpenDetails }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const favorite = isFavorite(movie.id);
  const releaseYear = movie.release_date?.split("-")[0] || "N/A";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.jpg";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  };

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(movie);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className="movie-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyPress={handleKeyPress}
      aria-label={`Details zu ${movie.title}`}
    >
      <div className="movie-poster">
        <img src={posterUrl} alt={movie.title} className="poster-img" />
        <button
          type="button"
          className={`favorite-btn ${favorite ? "active" : ""}`}
          onClick={handleFavoriteClick}
          title={
            user
              ? favorite
                ? "Aus Favoriten entfernen"
                : "Zu Favoriten hinzufügen"
              : "Bitte zuerst einloggen"
          }
          aria-label={
            favorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
          }
        >
          <span className="heart-icon">{favorite ? "♥" : "♡"}</span>
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{releaseYear}</p>
      </div>
    </div>
  );
}

export default MovieCard;
