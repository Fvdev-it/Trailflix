import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { 
  loadFavorites, 
  addFavorite, 
  removeFavorite 
} from "../services/favorites"; // Firestore-Funktionen für Favoriten

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavorites([]); // Kein User = keine Favoriten anzeigen
      return;
    }

    // Favoriten aus Firestore laden, wenn User vorhanden
    const fetchFavorites = async () => {
      try {
        const favs = await loadFavorites(user.uid);
        setFavorites(favs || []);
      } catch (error) {
        console.error("Fehler beim Laden der Favoriten:", error);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [user]);

  const addToFavorites = async (movie) => {
    if (!user) return;
    try {
      await addFavorite(user.uid, movie);
      setFavorites((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev; // Doppelte vermeiden
        return [...prev, movie];
      });
    } catch (error) {
      console.error("Fehler beim Hinzufügen zu Favoriten:", error);
    }
  };

  const removeFromFavorites = async (movieId) => {
    if (!user) return;
    try {
      await removeFavorite(user.uid, movieId);
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error("Fehler beim Entfernen aus Favoriten:", error);
    }
  };

  const isFavorite = (movieId) => favorites.some((movie) => movie.id === movieId);

  return (
    <MovieContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </MovieContext.Provider>
  );
};
