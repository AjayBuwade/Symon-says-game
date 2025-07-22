const buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let strictMode = false;
let difficulty = 1000; // default speed

document.getElementById("high-score").textContent = highScore;

// Start button
document.getElementById("startBtn").addEventListener("click", startGame);

// Strict mode toggle
document.getElementById("strictMode").addEventListener("change", (e) => {
  strictMode = e.target.checked;
});

// Difficulty
document.getElementById("difficulty").addEventListener("change", (e) => {
  difficulty = parseInt(e.target.value);
});

// Theme toggle
document.getElementById("toggleTheme").addEventListener("click", toggleTheme);

// Color button clicks
document.querySelectorAll(".color-btn").forEach(button => {
  button.addEventListener("click", function () {
    if (!started) return;
    const userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
  });
});

function startGame() {
  score = 0;
  level = 0;
  gamePattern = [];
  started = true;
  document.getElementById("score").textContent = score;
  document.getElementById("level-title").textContent = "Level " + level;
  nextSequence();
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    playSound("wrong");
    document.getElementById("game-card").classList.add("game-over");
    document.getElementById("level-title").textContent = "Game Over!";
    setTimeout(() => document.getElementById("game-card").classList.remove("game-over"), 400);
    
    updateHighScore();

    if (strictMode) {
      started = false;
    } else {
      userClickedPattern = [];
    }
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  document.getElementById("level-title").textContent = "Level " + level;
  const randomColor = buttonColors[Math.floor(Math.random() * 4)];
  gamePattern.push(randomColor);

  const button = document.getElementById(randomColor);
  setTimeout(() => {
    button.classList.add("pressed");
    playSound(randomColor);
    setTimeout(() => button.classList.remove("pressed"), 300);
  }, 300);

  score++;
  document.getElementById("score").textContent = score;
}

function playSound(color) {
  const audio = document.getElementById(color + "-sound");
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function animatePress(currentColor) {
  const button = document.getElementById(currentColor);
  button.classList.add("pressed");
  setTimeout(() => button.classList.remove("pressed"), 100);
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("high-score").textContent = highScore;
  }
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");
  document.getElementById("toggleTheme").textContent =
    document.body.classList.contains("light-theme") ? "Dark Mode" : "Light Mode";
}