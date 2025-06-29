import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firebaseApp } from "../firebase/FirebaseConfig";

const db = getFirestore(firebaseApp);

// Favoriten eines Users laden
export const loadFavorites = async (userId) => {
  if (!userId) return [];
  try {
    const docRef = doc(db, "userFavorites", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().favorites || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Fehler beim Laden der Favoriten:", error);
    return [];
  }
};

// Film zu Favoriten hinzufügen
export const addFavorite = async (userId, movie) => {
  if (!userId) return;
  try {
    const docRef = doc(db, "userFavorites", userId);
    // Fügt den Film zum Array hinzu (nur wenn nicht schon vorhanden)
    await updateDoc(docRef, {
      favorites: arrayUnion(movie),
    });
  } catch (error) {
    // Falls das Dokument noch nicht existiert, erstelle es
    if (error.code === "not-found") {
      const docRef = doc(db, "userFavorites", userId);
      await setDoc(docRef, { favorites: [movie] });
    } else {
      console.error("Fehler beim Hinzufügen zum Favoriten:", error);
      throw error;
    }
  }
};

// Film aus Favoriten entfernen
export const removeFavorite = async (userId, movieId) => {
  if (!userId) return;
  try {
    const docRef = doc(db, "userFavorites", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const currentFavorites = docSnap.data().favorites || [];
    // Filmobjekt mit passender ID finden
    const movieToRemove = currentFavorites.find((m) => m.id === movieId);

    if (!movieToRemove) return;

    // Film aus Array entfernen
    await updateDoc(docRef, {
      favorites: arrayRemove(movieToRemove),
    });
  } catch (error) {
    console.error("Fehler beim Entfernen vom Favoriten:", error);
    throw error;
  }
};
