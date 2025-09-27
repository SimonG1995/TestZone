// Get the canvas element from the HTML and store it in a variable
const canvas = document.getElementById("gameCanvas");
// Get the 2D drawing context to draw shapes and graphics on the canvas
const ctx = canvas.getContext("2d");

// Keep track of the total frames passed since the game started
let frames = 0;
// Gravity force applied to the bird each frame
const gravity = 0.25;
// The strength of the bird's upward movement when it "flaps"
const jump = 4.6;
// The player's score
let score = 0;
// Flag to track whether the game is currently running
let gameStarted = false;

// Bird object definition
const bird = {
  x: 50,        // Bird’s horizontal position
  y: 150,       // Bird’s vertical position
  width: 34,    // Bird’s width
  height: 26,   // Bird’s height
  velocity: 0,  // Current vertical speed of the bird

  // Draw the bird as a yellow rectangle
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },

  // Update bird’s position each frame
  update() {
    this.velocity += gravity;       // Apply gravity (bird falls down)
    this.y += this.velocity;        // Move bird vertically based on velocity
    if (this.y + this.height >= canvas.height) { // If bird touches the ground
      showGameOver();               // End the game
    }
  },

  // Make the bird jump (go upward)
  flap() {
    this.velocity = -jump;          // Negative velocity makes the bird move up
  }
};

// Array to store all pipes currently on the screen
const pipes = [];
// The width of each pipe
const pipeWidth = 50;
// The vertical gap between top and bottom pipes
const pipeGap = 150;

// Function to create a new pipe with random height
function createPipe() {
  // Random height for the top pipe (leaves space for the gap)
  const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
  pipes.push({
    x: canvas.width,           // Start pipes off-screen on the right
    top: topHeight,            // Top pipe height
    bottom: topHeight + pipeGap // Bottom pipe starts after the gap
  });
}

// Draw all pipes on the canvas
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    // Draw top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    // Draw bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

// Update pipe positions and check for collisions
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2; // Move pipes left each frame

    // Collision detection: bird hits a pipe
    if (
      bird.x < pipe.x + pipeWidth &&          // Bird enters pipe horizontally
      bird.x + bird.width > pipe.x &&         // Bird overlaps pipe horizontally
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) // Bird outside gap
    ) {
      showGameOver(); // End the game if collision occurs
    }

    // Scoring: if bird passes a pipe
    if (pipe.x + pipeWidth === bird.x) {
      score++;
      document.getElementById("score").textContent = "Score: " + score;
    }
  });

  // Remove pipes that have gone off the left side of the screen
  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }

  // Every 100 frames, create a new pipe
  if (frames % 100 === 0) {
    createPipe();
  }
}

// Reset game to starting state
function resetGame() {
  bird.y = 150; // Reset bird’s position
  bird.velocity = 0; // Reset bird’s velocity
  pipes.length = 0; // Clear all pipes
  score = 0; // Reset score
  frames = 0; // Reset frame count
  document.getElementById("score").textContent = "Score: 0";
  document.getElementById("gameOverScreen").style.display = "none"; // Hide game over screen
}

// Show game over screen and update highscore
function showGameOver() {
  // Display final score
  document.getElementById("finalScore").textContent = "Score: " + score;

  // Get stored highscore or default to 0
  let storedHighscore = localStorage.getItem("flappyHighscore") || 0;

  // Update highscore if current score is higher
  if (score > storedHighscore) {
    localStorage.setItem("flappyHighscore", score);
    storedHighscore = score;
  }

  // Display highscore
  document.getElementById("highScore").textContent = "Highscore: " + storedHighscore;

  // Show game over screen
  document.getElementById("gameOverScreen").style.display = "flex";

  // Stop the game loop
  gameStarted = false;
}

// Main game loop
function loop() {
  if (!gameStarted) return; // If game isn’t started, stop
  frames++; // Increase frame count
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the screen
  bird.update(); // Update bird position
  bird.draw();   // Draw the bird
  updatePipes(); // Update pipe positions and check collisions
  drawPipes();   // Draw pipes
  requestAnimationFrame(loop); // Repeat the loop
}

// Start button click: hide start screen and start game
document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  loop();
});

// Restart button click: reset game and start loop
document.getElementById("restartButton").addEventListener("click", () => {
  resetGame();
  gameStarted = true;
  loop();
});

// Keyboard input: Spacebar to flap or start game
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (!gameStarted) {
      document.getElementById("startScreen").style.display = "none";
      gameStarted = true;
      loop();
    } else {
      bird.flap(); // Make the bird jump
    }
  }
});
