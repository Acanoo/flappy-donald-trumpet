// Importa Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDexokjOL0Al3E9h-cQEQ30Ya8mGzLWVDM",
  authDomain: "flappy-donald-trumpet.firebaseapp.com",
  projectId: "flappy-donald-trumpet",
  storageBucket: "flappy-donald-trumpet.firebasestorage.app",
  messagingSenderId: "46007776185",
  appId: "1:46007776185:web:1bf42ba182c079cf98bc68",
  measurementId: "G-K5MRV5CCZK"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };