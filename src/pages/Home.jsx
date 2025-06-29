import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
} from "../services/api";
import MovieRow from "../components/MovieRow";
import HeroSection from "../components/HeroSection";

import "../css/Home.css";
import "../css/HeroSection.css";

const Home = () => {
  const location = useLocation();
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(location.search);
  const searchTerm = params.get("search");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchTerm) {
          const results = await searchMovies(searchTerm);
          setSearchResults(results);

          setNowPlaying([]);
          setPopular([]);
          setTopRated([]);
          setUpcoming([]);
        } else {
          const [nowPlayingData, popularData, topRatedData, upcomingData] =
            await Promise.all([
              getNowPlayingMovies(),
              getPopularMovies(),
              getTopRatedMovies(),
              getUpcomingMovies(),
            ]);
          setNowPlaying(nowPlayingData.slice(0, 20));
          setPopular(popularData.slice(0, 20));
          setTopRated(topRatedData.slice(0, 20));
          setUpcoming(upcomingData.slice(0, 20));
          setSearchResults([]);
        }
      } catch {
        setError("Ein Fehler ist aufgetreten beim Laden der Filme.");
      }
    };

    fetchData();
  }, [searchTerm]);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-page">
      <HeroSection />

      {searchTerm ? (
        <>
          <h2>Suchergebnisse für: "{searchTerm}"</h2>
          <MovieRow title="" movies={searchResults} />
        </>
      ) : (
        <>
          <MovieRow title="Jetzt im Kino" movies={nowPlaying} />
          <MovieRow title="Beliebt" movies={popular} />
          <MovieRow title="Top Bewertet" movies={topRated} />
          <MovieRow title="Demnächst" movies={upcoming} />
        </>
      )}
    </div>
  );
};

export default Home;
