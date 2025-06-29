import "./css/App.css";

// Context Provider
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MovieProvider } from "./contexts/MovieContext";

// React Router
import { Routes, Route } from "react-router-dom";

// Seiten
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

// Komponenten
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <NavBar />

          <main className="main-container">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset" element={<ResetPassword />} />
            </Routes>
          </main>

          <Footer />
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
