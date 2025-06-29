import "../css/HeroSection.css";
import { useEffect, useState } from "react";
import {
  getNowPlaying,
  getGenres,
  getMovieVideos,
  getMovieDetails,
} from "../services/api";

function HeroSection() {
  const [movies, setMovies] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const moviesData = await getNowPlaying();
      const genresData = await getGenres();

      setMovies(moviesData);
      setGenresList(genresData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    // Timer nur setzen, wenn kein Trailer offen ist
    if (!isTrailerOpen) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setShowInfoModal(false);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [movies, isTrailerOpen]);

  if (movies.length === 0) return null;

  const movie = movies[currentIndex];
  const backgroundUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  const movieGenres = movie.genre_ids
    .map((id) => {
      const genre = genresList.find((g) => g.id === id);
      return genre ? genre.name : null;
    })
    .filter(Boolean);

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

  const handleInfoClick = async () => {
    const details = await getMovieDetails(movie.id);
    setMovieDetails(details);
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setMovieDetails(null);
  };

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="hero-overlay">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-genres">
          {movieGenres.map((genre) => (
            <span key={genre} className="genre-badge">
              {genre}
            </span>
          ))}
        </p>
        <p className="hero-description">{movie.overview}</p>

        <div className="hero-buttons">
          <button className="hero-play" onClick={handlePlayClick}>
            ▶ Abspielen
          </button>
          <button className="hero-info" onClick={handleInfoClick}>
            Weitere Infos
          </button>
        </div>
      </div>

      {isTrailerOpen && (
        <div className="trailer-modal" onClick={closeTrailer}>
          <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
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

      {showInfoModal && movieDetails && (
        <div className="modal-overlay" onClick={closeInfoModal}>
          <div
            className="modal-content info-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={closeInfoModal}
              aria-label="Close details"
            >
              ×
            </button>
            <h2>{movieDetails.title}</h2>
            <p>
              <strong>Erscheinungsjahr:</strong>{" "}
              {movieDetails.release_date?.split("-")[0]}
            </p>
            <p>
              <strong>Bewertung:</strong> {movieDetails.vote_average} / 10
            </p>
            <p>
              <strong>Laufzeit:</strong> {movieDetails.runtime} Minuten
            </p>
            <p>
              <strong>Sprache:</strong>{" "}
              {movieDetails.original_language.toUpperCase()}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {movieDetails.genres.map((g) => g.name).join(", ")}
            </p>
            <p>
              <strong>Übersicht:</strong> {movieDetails.overview}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default HeroSection;
