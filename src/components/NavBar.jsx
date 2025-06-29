import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/NavBar.css";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/?category=${category}`);
  };

  const getCategoryFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "popular";
  };

  const currentCategory = getCategoryFromURL();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Trailflix
        </Link>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Film suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" type="submit">
          Suchen
        </button>
      </form>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-greeting">
              Hallo, {user.displayName || user.email}
            </span>

            <button
              className="favorites-button"
              onClick={() => navigate("/favorites")}
            >
              Favorites
            </button>

            <button
              className="auth-button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="auth-button" onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="auth-button"
              onClick={() => navigate("/register")}
            >
              Registrieren
            </button>
          </>
        )}

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
