const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const gravity = 0.25;
const jump = 4.6;
let score = 0;
let gameStarted = false;

const bird = {
  x: 50,
  y: 150,
  width: 34,
  height: 26,
  velocity: 0,
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  update() {
    this.velocity += gravity;
    this.y += this.velocity;
    if (this.y + this.height >= canvas.height) {
      showGameOver();
    }
  },
  flap() {
    this.velocity = -jump;
  }
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;

function createPipe() {
  const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + pipeGap
  });
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      showGameOver();
    }

    if (pipe.x + pipeWidth === bird.x) {
      score++;
      document.getElementById("score").textContent = "Score: " + score;
    }
  });

  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }

  if (frames % 100 === 0) {
    createPipe();
  }
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  frames = 0;
  document.getElementById("score").textContent = "Score: 0";
  document.getElementById("gameOverScreen").style.display = "none";
}

function showGameOver() {
  document.getElementById("finalScore").textContent = "Score: " + score;
  let storedHighscore = localStorage.getItem("flappyHighscore") || 0;
  if (score > storedHighscore) {
    localStorage.setItem("flappyHighscore", score);
    storedHighscore = score;
  }
  document.getElementById("highScore").textContent = "Highscore: " + storedHighscore;
  document.getElementById("gameOverScreen").style.display = "flex";
  gameStarted = false;
}

function loop() {
  if (!gameStarted) return;
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.update();
  bird.draw();
  updatePipes();
  drawPipes();
  requestAnimationFrame(loop);
}

document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  loop();
});

document.getElementById("restartButton").addEventListener("click", () => {
  resetGame();
  gameStarted = true;
  loop();
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (!gameStarted) {
      document.getElementById("startScreen").style.display = "none";
      gameStarted = true;
      loop();
    } else {
      bird.flap();
    }
  }
});
