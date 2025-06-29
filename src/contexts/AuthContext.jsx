import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseApp } from "../firebase/FirebaseConfig";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Beobachtet den Login-Zustand und lädt User-Profil neu (z.B. displayName)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser(auth.currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Login mit Email/Passwort & User neu laden (displayName)
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await res.user.reload();
    setUser(auth.currentUser);
    return res;
  };

  // Registrierung & User setzen (updateProfile ggf. separat aufrufen)
  const register = async (email, password, displayName = null) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // Falls displayName angegeben, Profil aktualisieren
    if (displayName) {
      await updateProfile(res.user, { displayName });
      await res.user.reload();
    }

    setUser(auth.currentUser);
    return res;
  };

  // Logout
  const logout = () => signOut(auth);

  // Passwort zurücksetzen
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // E-Mail-Bestätigung senden
  const sendVerification = () => {
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        resetPassword,
        sendVerification,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
