import { db } from "./firebaseConfig.js"; 


import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";


// Función para enviar el puntaje a Firebase
export async function sendScore(playerName, score) {
  try {
    await addDoc(collection(db, "scores"), {
      player_name: playerName,
      score: score,
      timestamp: new Date(),
    });
    console.log("Puntaje enviado correctamente");
  } catch (error) {
    console.error("Error al enviar puntaje:", error);
  }
}


// Función para obtener el Top 10 de puntajes
export async function getTopScores() {
  try {
    const q = query(
      collection(db, "scores"),
      orderBy("score", "desc"), // Ordena por puntaje descendente
      limit(10) // Limita a los 10 mejores
    );

    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });

    return scores;
  } catch (error) {
    console.error("Error al obtener puntajes:", error);
    return [];
  }
}

// Función para mostrar el Top 10
export async function showLeaderboard() {
  const topScores = await getTopScores();
  let leaderboardHTML = "<h2>Top 10 Jugadores</h2><ol>";
  if (topScores.length === 0) {
    leaderboardHTML += "<li>No hay puntajes disponibles</li>";
  } else {
    topScores.forEach((entry) => {
      leaderboardHTML += `<li>${entry.player_name}: ${entry.score}</li>`;
    });
  }
  leaderboardHTML += "</ol>";
  
  // Actualiza el contenido del panel de puntajes
  const leaderboardDiv = document.getElementById("leaderboard");
  if (leaderboardDiv) {
    leaderboardDiv.innerHTML = leaderboardHTML;
  } else {
    console.error("El contenedor #leaderboard no existe.");
  }
}


// Llama a esta función cuando cargues la página
window.addEventListener("load", () => {
  showLeaderboard();
});