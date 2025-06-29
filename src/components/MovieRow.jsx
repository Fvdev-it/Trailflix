import { useRef, useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import MovieDetail from "./MovieDetail";
import { getMovieDetails } from "../services/api";
import "../css/MovieRow.css";

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const row = rowRef.current;

    const handleWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      row.scrollBy({ left: e.deltaY < 0 ? -100 : 100 });
    };

    row.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      row.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    const details = await getMovieDetails(movie.id);
    setMovieDetails(details);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  return (
    <section className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="movie-row-scroll" ref={rowRef}>
        {movies.map((movie) => (
          <div key={movie.id} onClick={() => handleMovieClick(movie)}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {movieDetails && (
        <MovieDetail movie={movieDetails} onClose={closeModal} />
      )}
    </section>
  );
};

export default MovieRow;
