import React, { useState } from "react";
import "../css/MovieDetail.css";
import { getMovieVideos } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";

const MovieDetail = ({ movie, onClose }) => {
  const backgroundUrl = `https://image.tmdb.org/t/p/original${
    movie.backdrop_path || movie.poster_path
  }`;
  const genres = movie.genres ? movie.genres.map((g) => g.name) : [];

  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handlePlayClick = async () => {
    const videos = await getMovieVideos(movie.id);
    const trailer = videos.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );
    if (trailer) {
      setTrailerKey(trailer.key);
      setIsTrailerOpen(true);
    } else {
      alert("Kein Trailer verfügbar.");
    }
  };

  const closeTrailer = () => {
    setIsTrailerOpen(false);
    setTrailerKey(null);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>

        <div
          className="movie-backdrop"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
          aria-label={`Backdrop for ${movie.title || movie.name}`}
        >
          <div className="movie-backdrop-overlay" />
        </div>

        <div className="movie-info">
          <h1 className="movie-title">{movie.title || movie.name}</h1>

          <div className="movie-genres">
            {genres.map((genre) => (
              <span key={genre} className="genre-badge">
                {genre}
              </span>
            ))}
          </div>

          <div className="movie-buttons">
            <button className="btn play-btn" onClick={handlePlayClick}>
              ▶ Abspielen
            </button>

            <button
              className={`btn favorite-btn ${favorite ? "active" : ""}`}
              onClick={handleFavoriteClick}
              aria-label={
                favorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
              }
            >
              {favorite ? "♥" : "♡"}
            </button>
          </div>

          <div className="more-info">
            <p>
              <strong>Erscheinungsjahr:</strong>{" "}
              {movie.release_date?.split("-")[0]}
            </p>
            <p>
              <strong>Bewertung:</strong> {movie.vote_average} / 10
            </p>
            <p>
              <strong>Laufzeit:</strong> {movie.runtime} Minuten
            </p>
            <p>
              <strong>Sprache:</strong> {movie.original_language?.toUpperCase()}
            </p>
            <p>
              <strong>Übersicht:</strong> {movie.overview}
            </p>
          </div>
        </div>

        {isTrailerOpen && (
          <div className="trailer-modal" onClick={closeTrailer}>
            <div
              className="trailer-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-trailer" onClick={closeTrailer}>
                ×
              </button>
              <iframe
                width="100%"
                height="600"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
