import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const { favorites } = useMovieContext();
  const hasFavorites = Array.isArray(favorites) && favorites.length > 0;

  return (
    <section className="favorites">
      <div className="favorites-header">
        <h2>
          {hasFavorites ? "Deine Lieblingsfilme" : "Noch keine Favoriten"}
        </h2>
        {!hasFavorites && (
          <p>Füge Filme zu deinen Favoriten hinzu und sie erscheinen hier!</p>
        )}
      </div>

      {hasFavorites ? (
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <h2>Keine Favoriten gefunden</h2>
          <p>Du hast noch keine Filme zu deinen Favoriten hinzugefügt.</p>
        </div>
      )}
    </section>
  );
}

export default Favorites;
