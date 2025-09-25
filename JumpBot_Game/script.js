let player = document.getElementById("player");
let obstacle = document.getElementById("obstacle");
let scoreDisplay = document.getElementById("score");
let highscoreDisplay = document.getElementById("highscore");
let restartBtn = document.getElementById("restartBtn");

let score = 0;
let highscore = localStorage.getItem("jumpbotHighscore") || 0;
highscoreDisplay.textContent = "Highscore: " + highscore;

let isJumping = false;
let isGameOver = false;

function jump() {
  if (isJumping || isGameOver) return;
  isJumping = true;
  let jumpHeight = 80;
  let jumpDuration = 300;
  player.style.transition = "bottom " + jumpDuration / 2 + "ms ease-out";
  player.style.bottom = jumpHeight + "px";
  setTimeout(() => {
    player.style.transition = "bottom " + jumpDuration / 2 + "ms ease-in";
    player.style.bottom = "0px";
    setTimeout(() => {
      isJumping = false;
    }, jumpDuration / 2);
  }, jumpDuration / 2);
}

function moveObstacle() {
  obstacle.style.right = "-30px";
  obstacle.style.transition = "none";
  setTimeout(() => {
    obstacle.style.transition = "right 2s linear";
    obstacle.style.right = "600px";
  }, 50);
}

function checkCollision() {
  let playerRect = player.getBoundingClientRect();
  let obstacleRect = obstacle.getBoundingClientRect();
  if (
    playerRect.right > obstacleRect.left &&
    playerRect.left < obstacleRect.right &&
    playerRect.bottom > obstacleRect.top &&
    playerRect.top < obstacleRect.bottom
  ) {
    gameOver();
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(gameLoop);
  restartBtn.style.display = "inline-block";
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("jumpbotHighscore", highscore);
    highscoreDisplay.textContent = "Highscore: " + highscore;
  }
}

function restartGame() {
  score = 0;
  scoreDisplay.textContent = "Score: " + score;
  isGameOver = false;
  restartBtn.style.display = "none";
  moveObstacle();
  gameLoop = setInterval(() => {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    checkCollision();
  }, 100);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

document.addEventListener("touchstart", () => {
  jump();
});

restartBtn.addEventListener("click", () => {
  restartGame();
});

moveObstacle();
let gameLoop = setInterval(() => {
  score++;
  scoreDisplay.textContent = "Score: " + score;
  checkCollision();
}, 100);
