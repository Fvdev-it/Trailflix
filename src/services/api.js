const API_KEY = "KEY";
const BASE_URL = "https://api.themoviedb.org/3";

const BEARER_TOKEN = "";

const authHeaders = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
};

// ✅ Genres abrufen
export const getGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?language=de`,
    authHeaders
  );
  const data = await response.json();
  return data.genres; // Array mit { id, name }
};

// ✅ Jetzt im Kino
export const getNowPlayingMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

// Hero Section (Alias für Klarheit)
export const getNowPlaying = async () => {
  return await getNowPlayingMovies();
};

// ✅ Beliebte Filme
export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

// ✅ Top-bewertete Filme
export const getTopRatedMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

// ✅ Kommende Filme
export const getUpcomingMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

// ✅ Suche
export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.results;
};

// Filmdetails holen (inkl. Genres)
export const getMovieDetails = async (movieId) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

// Trailer-Videos zu Film holen (für Hero Section und MovieDetail)
export const getMovieVideos = async (movieId) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};
