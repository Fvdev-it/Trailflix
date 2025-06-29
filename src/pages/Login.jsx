import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
  const verifyMessage = new URLSearchParams(location.search).get("verify");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate(redirectPath);
    } catch {
      setError("Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.");
    }
  };

  return (
    <div className="main-content">
      <h2>Login</h2>

      {verifyMessage && (
        <div className="auth-info">
          Bitte bestätige deine E-Mail-Adresse. Eine Verifizierungs-Mail wurde gesendet.
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Passwort anzeigen
          </label>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit">Einloggen</button>
      </form>
    </div>
  );
};

export default Login;
