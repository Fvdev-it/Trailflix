import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../css/Login.css";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await resetPassword(email);
      setMessage("E-Mail zum Zurücksetzen wurde gesendet.");
    } catch (err) {
      setError("Fehler beim Senden. E-Mail korrekt?");
    }
  };

  return (
    <div className="main-content">
      <h2>Passwort zurücksetzen</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message && <div className="auth-info">{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Zurücksetzen</button>
      </form>
    </div>
  );
};

export default ResetPassword;
