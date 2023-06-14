// Quiz Questions
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");

const questions = [
  {
    question: "Commonly used data types do NOT include:",
    choices: ["strings", "Booleans", "alerts", "numbers"],
    correctAnswerIndex: 2,
  },
  {
    question: "The condition in an if/else statement is enclosed within:",
    choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
    correctAnswerIndex: 2,
  },
  {
    question: "Arrays in Javascript can be used to store:",
    choices: ["numbers and strings", "other arrays", "Booleans", "all of the above"],
    correctAnswerIndex: 3,
  },
  {
    question: "String values must be enclosed within _____ when being assigned to variables.",
    choices: ["commas", "curly brackets", "quotes", "parentheses"],
    correctAnswerIndex: 2,
  },
  {
    question: "A useful tool used during development and debugging for printing content to the debugger is:",
    choices: ["Javascript", "terminal", "for loops", "console.log"],
    correctAnswerIndex: 3,
  },
];

// Elements
const startButton = document.getElementById("startButton");
const quizHeading = document.getElementById("quizHeading");
const timerValueElement = document.getElementById("timerValue");
const feedbackElement = document.getElementById("feedback");
const quizContainer = document.getElementById("quizContainer");
const initialsContainer = document.getElementById("initialsContainer");

// Variables
let timeLeft = 75;
let timer;
let currentQuestionIndex = 0;

// Event Listeners
startButton.addEventListener("click", startQuiz);

// Functions

// initializing function
function startQuiz() {
  startButton.style.display = "none";
  quizHeading.style.display = "none";
  displayQuestion();
  startTimer();
}
// Timer starts at 75 seconds and counts down 1 second at a time, stopping at 0
function startTimer() {
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft = Math.max(timeLeft - 1, 0);
  timerValueElement.textContent = timeLeft;

  if (timeLeft === 0) {
    clearInterval(timer);
    endQuiz();
  }
}

// function to show current question and display the answer choices as buttons
function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;

  choicesElement.innerHTML = ""; 

  currentQuestion.choices.forEach((choice, index) => {
    const choiceButton = document.createElement("button");
    choiceButton.textContent = choice;
    choiceButton.classList.add("answerButton");
    choiceButton.addEventListener("click", () => handleAnswerClick(index));
    choicesElement.appendChild(choiceButton);
  });

  questionElement.style.display = "block";
  choicesElement.style.display = "flex";
  feedbackElement.textContent = "";
}

// function to determine what happens when an answer is clicked
function handleAnswerClick(choiceIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  // shows feedback correct/incorrect based on what is selected
  if (currentQuestion.correctAnswerIndex === choiceIndex) {
    showFeedback("correct");
  } else {
    timeLeft -= 15;
    showFeedback("incorrect");
  }
  const answerButtons = document.querySelectorAll(".answerButton");
  answerButtons.forEach((button) => {
    button.classList.remove("selectedAnswer");
  });
  const clickedButton = event.target;
  clickedButton.classList.add("selectedAnswer");
}

function showFeedback(message) {
  feedbackElement.textContent = message;
  feedbackElement.style.display = "inline";
  // feedback flashes up on screen for 1/2 second before moving on to the next question
  setTimeout(() => {
    feedbackElement.style.display = "none";
  }, 500);

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      clearInterval(timer);
      endQuiz();
    }
  }, 500);
}

// Removes all elements from the page and loads a submit form at the end of the quiz
function endQuiz() {
  questionElement.style.display = "none";
  choicesElement.style.display = "none";
  feedbackElement.style.display = "none";
  initialsContainer.style.display = "block";

  let finalScore = timeLeft;

  quizContainer.innerHTML = `
    <h1 id="gameOverText">GAME OVER</h1>
    <p>Your score is ${finalScore}</p>
    <form id="scoreForm">
      <label for="initials">Enter your initials:</label>
      <input type="text" id="initials" placeholder="Your initials" /><br />
      <button type="submit" id="submitScore">submit</button>
    </form>
  `;
// GAME OVER flashes on the screen at the conclusion of the quiz
  const gameOverText = document.getElementById("gameOverText");
  gameOverText.style.background = "linear-gradient(to bottom, #eb4c34, #ebbd34)";
  gameOverText.style.webkitBackgroundClip = "text";
  gameOverText.style.webkitTextFillColor = "transparent";
  gameOverText.style.fontSize = "50px";

  const submitButton = document.getElementById("submitScore");
  submitButton.classList.add("submit-button");

  const scoreForm = document.getElementById("scoreForm");
  scoreForm.addEventListener("submit", submitScore);
}
// submit form which leads to highscores page when user inputs their initials
function submitScore(event) {
  event.preventDefault();

  const initialsInput = document.getElementById("initials");
  let initials = initialsInput.value.trim();

  if (initials === "") {
    alert("Please enter your initials.");
  } else {
    const scoreData = { initials, score: timeLeft };
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScores.push(scoreData);
    localStorage.setItem("highScores", JSON.stringify(highScores));

    displayHighScores();
  }
}

// User initials + high score are saved to local storage which is then displayed on the high scores page as an ordered list
function displayHighScores() {
  startButton.style.display = "none";
  questionElement.style.display = "none";
  choicesElement.style.display = "none";
  feedbackElement.style.display = "none";
  initialsContainer.style.display = "none";
  timerValueElement.style.display = "none";

  const headingElements = document.querySelectorAll(".container h2");
  headingElements.forEach((headingElement) => {
    headingElement.parentNode.removeChild(headingElement);
  });

  quizContainer.innerHTML = "";

  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  highScores.sort((a, b) => b.score - a.score);

  const highScoresContainer = document.createElement("div");
  highScoresContainer.classList.add("highscore-container");

  const heading = document.createElement("h2");
  heading.textContent = "high scores";
  highScoresContainer.appendChild(heading);
  heading.style.fontFamily = "Orbit, sans-serif";
  heading.style.fontSize = "45px";

  const list = document.createElement("ol");
  list.classList.add("highscoreList");
  list.style.padding = "0";
  list.style.textAlign = "center";
  list.style.listStyle = "none";

  for (let i = 0; i < highScores.length; i++) {
    const scoreData = highScores[i];
    const listItem = document.createElement("li");
    listItem.style.display = "flex";
    listItem.style.justifyContent = "center";
    listItem.style.alignItems = "center";
    listItem.style.marginBottom = "10px";

    const listItemNumber = document.createElement("span");
    listItemNumber.style.fontWeight = "bold";
    listItemNumber.style.marginRight = "10px";
    listItemNumber.textContent = `${i + 1}.`;
    listItem.appendChild(listItemNumber);

    const listItemText = document.createElement("span");
    listItemText.textContent = `${scoreData.initials}: ${scoreData.score}`;
    listItem.appendChild(listItemText);

    list.appendChild(listItem);
  }

  highScoresContainer.appendChild(list);
  quizContainer.appendChild(highScoresContainer);

  // 2 buttons under the list of high scores - go back takes you back to the start of the game, clear high scores removes the local storage of high scores and clears the page
  const goBackButton = document.createElement("button");
  goBackButton.textContent = "go back";
  goBackButton.classList.add("go-back-button");
  goBackButton.addEventListener("click", refreshGame);
  quizContainer.appendChild(goBackButton);

  const clearHighScoresButton = document.createElement("button");
  clearHighScoresButton.textContent = "clear high scores";
  clearHighScoresButton.classList.add("clear-highscores-button");
  clearHighScoresButton.addEventListener("click", clearHighScores);
  quizContainer.appendChild(clearHighScoresButton);
}

function refreshGame() {
  location.reload();
}

function clearHighScores() {
  localStorage.removeItem("highScores");

  const highScoresList = document.querySelector(".highscore-container ol");
  if (highScoresList) {
    highScoresList.parentNode.removeChild(highScoresList);
  }
}

const highscoresHeading = document.getElementById("highscoresHeading");
highscoresHeading.addEventListener("click", displayHighScores);
// hi-score heading on top left corner displays the current highest score and when clicked, leads to the high score page
function displayHighestScore() {
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  highScores.sort((a, b) => b.score - a.score);

  if (highScores.length > 0) {
    let highestScore = highScores[0].score;

    const highestScoreSpan = document.getElementById("highestScore");
    highestScoreSpan.textContent = highestScore;
  }
}

displayHighestScore();
