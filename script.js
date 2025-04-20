const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensiones fijas para el lienzo
canvas.width = 500; // Ancho del lienzo
canvas.height = 800; // Alto del lienzo

// Variables globales
let playerName = localStorage.getItem('playerName'); // Obtener el nombre del jugador desde localStorage
let bird = { 
  x: 50, 
  y: 300, 
  width: 60, 
  height: 60, 
  gravity: 0.2, 
  lift: -4, 
  velocity: 0 
};
let pipes = [];
let pipeWidth = 50;
let pipeGap = 200; // Espacio vertical más grande entre las tuberías
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;

// Cargar la imagen del pájaro
const birdImage = new Image();
birdImage.src = './assets/vector-donald.png'; // Ruta relativa a la imagen

birdImage.onload = () => {
  console.log('Imagen del pájaro cargada');
};

// Mostrar el menú de inicio
const startMenu = document.getElementById('start-menu');
const startButton = document.getElementById('start-button');
const playerNameInput = document.getElementById('player-name');

if (!playerName) {
  // Si no hay un nombre guardado, mostrar el campo de entrada
  playerNameInput.style.display = 'block';
} else {
  // Si ya hay un nombre guardado, ocultar el campo de entrada
  playerNameInput.style.display = 'none';
}

startButton.addEventListener('click', () => {
  if (!playerName) {
    // Guardar el nombre del jugador si no está guardado
    playerName = playerNameInput.value.trim();
    if (playerName === '') {
      alert('Por favor, ingresa un nombre válido.');
      return;
    }
    localStorage.setItem('playerName', playerName); // Guardar el nombre en localStorage
  }

  startMenu.style.display = 'none'; // Ocultar el menú de inicio
  resetGame(); // Reiniciar el juego
  gameStarted = true; // Marcar que el juego ha comenzado
  gameLoop(); // Iniciar el bucle del juego
});

// Botón de reinicio
const restartMenu = document.getElementById('restart-menu');
const restartButton = document.getElementById('restart-button');
const endGameButton = document.getElementById('end-game-button');

restartButton.addEventListener('click', () => {
  restartMenu.style.display = 'none'; // Ocultar el menú de reinicio
  resetGame(); // Reiniciar el juego
  gameStarted = true; // Marcar que el juego ha comenzado
  gameLoop(); // Iniciar el bucle del juego
});

// Botón para finalizar partida
endGameButton.addEventListener('click', () => {
  restartMenu.style.display = 'none'; // Ocultar el menú de reinicio
  localStorage.removeItem('playerName'); // Eliminar el nombre del jugador almacenado
  location.reload(); // Recargar la página para volver al menú inicial
});

// Función para reiniciar el juego
function resetGame() {
  bird.x = 50;
  bird.y = 300;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
}

// Función para dibujar el pájaro
function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Función para actualizar las tuberías
function updatePipes() {
  if (frame % 150 === 0) { // Intervalo para crear nuevas tuberías
    let topHeight = Math.random() * (canvas.height - pipeGap - 50) + 20;
    pipes.push({ x: canvas.width, top: topHeight });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2; // Mover las tuberías hacia la izquierda
  });

  // Eliminar tuberías fuera de la pantalla
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Función para dibujar las tuberías
function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = pipe.isCollided ? 'red' : 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top); // Parte superior de la tubería
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap); // Parte inferior de la tubería
  });
}

// Función para detectar colisiones
function checkCollision() {
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
    restartMenu.style.display = 'block'; // Mostrar el menú de reinicio
  }

  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {
      gameOver = true;
      pipe.isCollided = true; // Marcar esta tubería como colisionada
      restartMenu.style.display = 'block'; // Mostrar el menú de reinicio
    }
  });
}

// Función principal del juego
function gameLoop() {
  if (!gameStarted || gameOver) return;

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Actualizar elementos del juego
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  updatePipes();
  checkCollision();

  // Dibujar elementos del juego
  drawBird();
  drawPipes();

  // Mostrar puntaje y nombre del jugador
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Jugador: ${playerName}`, 10, 40);

  // Incrementar puntaje si el pájaro pasa una tubería
  pipes.forEach(pipe => {
    if (pipe.x + pipeWidth < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
    }
  });

  frame++;
  requestAnimationFrame(gameLoop);
}

// Evento para hacer que el pájaro vuele
document.addEventListener('keydown', () => {
  if (!gameOver) {
    bird.velocity = bird.lift; // Aplicar el impulso al volar
  }
});