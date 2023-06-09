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

// START QUIZ
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startQuiz);

function startQuiz() {
  startButton.style.display = "none";
  displayQuestion();
  startTimer();
}

// TIMER
const timerValueElement = document.getElementById("timerValue");
let timeLeft = 75;
let timer;

function startTimer() {
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  if (timeLeft < 0) {
    timeLeft = 0;
  }
  timerValueElement.textContent = timeLeft;

  if (timeLeft === 0) {
    clearInterval(timer);
    endQuiz();
  }
}




// QUIZ PROGRESSION
const feedbackElement = document.getElementById("feedback");
let currentQuestionIndex = 0;

function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;

  choicesElement.innerHTML = ""; // Clear previous choices

  // Create a button for each answer choice
  currentQuestion.choices.forEach((choice, index) => {
    const choiceButton = document.createElement("button");
    choiceButton.textContent = choice;
    choiceButton.classList.add("answerButton");
    choiceButton.addEventListener("click", () => handleAnswerClick(index));
    choicesElement.appendChild(choiceButton);
  });

  // Show the question and choices
  questionElement.style.display = "block";
  choicesElement.style.display = "block";
  feedbackElement.textContent = ""; // Clear previous feedback
}

function handleAnswerClick(choiceIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  if (currentQuestion.correctAnswerIndex === choiceIndex) {
    showFeedback("Correct");
  } else {
    timeLeft -= 15;
    showFeedback("Incorrect");
  }
}

function showFeedback(message) {
  feedbackElement.textContent = message;
  feedbackElement.style.display = "inline";

  setTimeout(() => {
    feedbackElement.style.display = "none";
  }, 400);

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      clearInterval(timer);
      endQuiz();
    }
  }, 400);

  timeLeft = Math.max(timeLeft, 0);
}

// QUIZ END
const quizContainer = document.getElementById("quizContainer");
const initialsContainer = document.getElementById("initialsContainer");

function endQuiz() {
  questionElement.style.display = "none";
  choicesElement.style.display = "none";
  feedbackElement.style.display = "none";
  initialsContainer.style.display = "block";

  let finalScore = timeLeft;

  quizContainer.innerHTML = `
    <h1>All done!</h1>
    <p>Your score is ${finalScore}</p>
    <form id="scoreForm">
      <label for="initials">Enter your initials:</label>
      <input type="text" id="initials" placeholder="Your initials" />
      <button type="submit" id="submitScore">Submit</button>
    </form>
    `;

  const scoreForm = document.getElementById("scoreForm");
  scoreForm.addEventListener("submit",submitScore);

  function submitScore(event) {
    event.preventDefault();
  
    const initialsInput = document.getElementById("initials");
    let initials = initialsInput.value.trim();
  
    if (initials === "") {
      alert("Please enter your initials.");
    } else {
      const scoreData = { initials, score: finalScore };
      let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
      highScores.push(scoreData);
      localStorage.setItem("highScores", JSON.stringify(highScores));
  
      // Display high scores
      displayHighScores();
    }
  }  
}
function displayHighScores() {

  startButton.style.display = "none";
    questionElement.style.display = "none";
    choicesElement.style.display = "none";
    feedbackElement.style.display = "none";
    initialsContainer.style.display = "none";
    timerValueElement.style.display = "none"; // Hide the timer
  
    const headingElements = document.querySelectorAll(".container h2");
    headingElements.forEach((headingElement) => {
      const parentElement = headingElement.parentNode;
      parentElement.removeChild(headingElement);
    });
  
    quizContainer.innerHTML = "";
  
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  
    highScores.sort((a, b) => b.score - a.score);
  
    const highScoresContainer = document.createElement("div");
    highScoresContainer.classList.add("highscore-container");
  
    const heading = document.createElement("h2");
    heading.textContent = "Highscores";
    highScoresContainer.appendChild(heading);
  
    const list = document.createElement("ol");
    highScores.forEach((scoreData) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${scoreData.initials}: ${scoreData.score}`;
      list.appendChild(listItem);
    });
  
    highScoresContainer.appendChild(list);
    quizContainer.appendChild(highScoresContainer);
  
    // Add "Go Back" button
    const goBackButton = document.createElement("button");
    goBackButton.textContent = "Go Back";
    goBackButton.addEventListener("click", refreshGame);
    quizContainer.appendChild(goBackButton);
  
    // Add "Clear High Scores" button
    const clearHighScoresButton = document.createElement("button");
    clearHighScoresButton.textContent = "Clear High Scores";
    clearHighScoresButton.addEventListener("click", clearHighScores);
    quizContainer.appendChild(clearHighScoresButton);
  }
  
  // Refresh the game
  function refreshGame() {
    location.reload();
  }
  
  function clearHighScores() {
    localStorage.removeItem("highScores");
  
    // Remove the high scores list from the page
    const highScoresList = document.querySelector(".highscore-container ol");
    if (highScoresList) {
      highScoresList.parentNode.removeChild(highScoresList);
    }
  }

  // Highscore 

const highscoresHeading = document.getElementById("highscoresHeading");
highscoresHeading.addEventListener("click", displayHighScores);