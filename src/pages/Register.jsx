import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Unser eigener Auth-Context (z. B. Firebase-Wrapper)
import { useNavigate, useLocation } from "react-router-dom"; // Navigation & URL-Infos
import { updateProfile, getAuth } from "firebase/auth";
import "../css/Login.css"; // Styling für die Seite

const Register = () => {
  const { register, sendVerification } = useAuth(); // Registrierung und Verifizierungs-Mail aus dem Context
  const navigate = useNavigate();
  const location = useLocation();

  // Form-Eingaben
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Passwort sichtbar machen (z. B. beim Eintippen)
  const [error, setError] = useState(""); // Fehleranzeige

  // Wenn jemand z. B. über /register?redirect=/checkout kommt, merken wir uns das
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  // Regeln für ein sicheres Passwort – alles was erfüllt sein muss
  const passwordValidations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_\-+=<>?{}[\]~]/.test(password),
  };

  // Alles okay, wenn jede einzelne Bedingung erfüllt ist
  const allValid = Object.values(passwordValidations).every(Boolean);

  // Wird aufgerufen, wenn der/die Nutzer:in das Formular abschickt
  const handleSubmit = async (e) => {
    e.preventDefault(); // Verhindert das Neuladen der Seite
    setError(""); // Fehler zurücksetzen

    // Bevor wir zur Registrierung gehen, erstmal das Passwort prüfen
    if (!allValid) {
      setError("Bitte erfülle alle Passwortbedingungen.");
      return;
    }

    try {
      const auth = getAuth();

      // Nutzer:in registrieren
      const userCredential = await register(email, password);

      // Direkt den Anzeigenamen (Nickname) setzen
      await updateProfile(userCredential.user, {
        displayName: nickname.trim(),
      });

      // Aktualisierte Nutzerdaten laden
      await auth.currentUser.reload();

      // Verifizierungs-Mail schicken
      await sendVerification();

      // Danach geht’s zur Login-Seite – mit Hinweis, dass jetzt verifiziert werden muss
      navigate("/login?verify=true");
    } catch (err) {
      console.error("❌ Registrierung fehlgeschlagen:", err);

      // Je nach Fehlercode eine passende Meldung anzeigen
      if (err.code === "auth/email-already-in-use") {
        setError("Diese E-Mail ist bereits registriert.");
      } else if (err.code === "auth/invalid-email") {
        setError("Die E-Mail-Adresse ist ungültig.");
      } else if (err.code === "auth/weak-password") {
        setError("Das Passwort ist zu schwach.");
      } else {
        setError("Registrierung fehlgeschlagen. Bitte versuche es erneut.");
      }
    }
  };

  return (
    <div className="main-content">
      <h2>Registrieren</h2>

      {/* Falls jemand gerade erst sein Konto erstellt hat und zurückgeleitet wurde */}
      {location.search.includes("verify=true") && (
        <div className="auth-info">
          ✔ Konto erstellt! Bitte bestätige deine E-Mail-Adresse über den Link
          in deinem Posteingang.
        </div>
      )}

      {/* Registrierungsformular */}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Passwortfeld mit "Augen-Icon" aka „Passwort anzeigen“ */}
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

        {/* Zeigt live an, ob das Passwort stark genug ist */}
        <div className="password-feedback">
          <p className={passwordValidations.length ? "valid" : "invalid"}>
            • Mindestens 8 Zeichen
          </p>
          <p className={passwordValidations.uppercase ? "valid" : "invalid"}>
            • Mindestens 1 Großbuchstabe
          </p>
          <p className={passwordValidations.number ? "valid" : "invalid"}>
            • Mindestens 1 Zahl
          </p>
          <p className={passwordValidations.special ? "valid" : "invalid"}>
            • Mindestens 1 Sonderzeichen
          </p>
        </div>

        {/* Fehlermeldung, falls was schiefging */}
        {error && <div className="auth-error">{error}</div>}

        {/* Nur klickbar, wenn Passwort sicher ist */}
        <button type="submit" disabled={!allValid}>
          Konto erstellen
        </button>
      </form>
    </div>
  );
};

export default Register;
