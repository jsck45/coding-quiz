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

const quizHeading = document.getElementById("quizHeading");

function startQuiz() {
  startButton.style.display = "none";
  quizHeading.style.display = "none";
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
    showFeedback("correct");
  } else {
    timeLeft -= 15;
    showFeedback("incorrect");
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
    <h1 id=gameOverText>GAME OVER</h1>
    <p>Your score is ${finalScore}</p>
    <form id="scoreForm">
      <label for="initials">Enter your initials:</label>
      <input type="text" id="initials" placeholder="Your initials" />
      <br> 
      <button type="submit" id="submitScore" style="margin-top: 20px;">submit</button>
    </form>
    `;

    //GAME OVER text styling
    const gameOverText = document.getElementById("gameOverText");
    gameOverText.style.background = "linear-gradient(to bottom, #eb4c34, #ebbd34)";
    gameOverText.style.webkitBackgroundClip = "text";
    gameOverText.style.webkitTextFillColor = "transparent";
    gameOverText.style.fontSize = "50px";

    let isHidden = false;
    
    const flickerInterval = setInterval(() => {
      isHidden = !isHidden;
      gameOverText.style.visibility = isHidden ? "hidden" : "visible";
    }, 600);
    
    setTimeout(() => {
      clearInterval(flickerInterval);
      gameOverText.style.visibility = "visible"; 
    }, 4000);

    //SUBMIT BUTTON styling
    const submitButton = document.getElementById("submitScore");
    submitButton.style.background = "aqua";
    submitButton.style.color = "#eb9334";
    submitButton.style.borderColor = "aqua";
    submitButton.style.fontFamily = "Bagel Fat One, cursive";
    submitButton.style.borderRadius = "10px";
    submitButton.style.fontSize = "18px";

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
    timerValueElement.style.display = "none"; 

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
    heading.textContent = "high scores";
    highScoresContainer.appendChild(heading);
    heading.style.fontFamily = "Orbit, sans-serif";
    heading.style.fontSize = "40px";
  
    const list = document.createElement("ol");
    list.style.padding = "0"; // Remove the default padding
    list.style.textAlign = "center"; // Center the list
    list.style.listStyle = "none";

    for (let i = 0; i < highScores.length; i++) {
      const scoreData = highScores[i];
      const listItem = document.createElement("li");
      listItem.style.display = "flex"; // Use flex display for better positioning
      listItem.style.justifyContent = "center"; // Center the content horizontally
      listItem.style.alignItems = "center"; // Center the content vertically
      listItem.style.marginBottom = "10px"; // Add some vertical spacing between items
    
      const listItemNumber = document.createElement("span");
      listItemNumber.style.fontWeight = "bold"; // Make the number bold
      listItemNumber.style.marginRight = "10px"; // Add spacing between the number and text
      listItemNumber.textContent = `${i + 1}.`; // Set the number
      listItem.appendChild(listItemNumber);
    
    
      const listItemText = document.createElement("span");
      listItemText.textContent = `${scoreData.initials}: ${scoreData.score}`;
      listItem.appendChild(listItemText);
      
      list.appendChild(listItem);
    };
  
    highScoresContainer.appendChild(list);
    quizContainer.appendChild(highScoresContainer);

  
    // Add "Go Back" button
    const goBackButton = document.createElement("button");
    goBackButton.textContent = "go back";
    goBackButton.addEventListener("click", refreshGame);
    quizContainer.appendChild(goBackButton);

    goBackButton.style.margin = "10px";
    goBackButton.style.backgroundColor = "aqua";
    goBackButton.style.borderColor = "aqua";
    goBackButton.style.borderRadius = "10px";
    goBackButton.style.color = "#eb9334";
    goBackButton.style.fontFamily = "Bagel Fat One, cursive";
    goBackButton.style.fontSize = "20px";

    // Add "Clear High Scores" button
    const clearHighScoresButton = document.createElement("button");
    clearHighScoresButton.textContent = "clear high scores";
    clearHighScoresButton.addEventListener("click", clearHighScores);
    quizContainer.appendChild(clearHighScoresButton);

    clearHighScoresButton.style.margin = "10px";
    clearHighScoresButton.style.backgroundColor = "aqua";
    clearHighScoresButton.style.borderColor = "aqua";
    clearHighScoresButton.style.borderRadius = "10px";
    clearHighScoresButton.style.color = "#eb9334";
    clearHighScoresButton.style.fontFamily = "Bagel Fat One, cursive";
    clearHighScoresButton.style.fontSize = "20px";

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

// HIGHSCORE

const highscoresHeading = document.getElementById("highscoresHeading");
highscoresHeading.addEventListener("click", displayHighScores);

function displayHighestScore() {
  // Retrieve high scores from localStorage
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  // Sort high scores in descending order
  highScores.sort((a, b) => b.score - a.score);

  // Check if there are any high scores
  if (highScores.length > 0) {
    // Get the highest score
    let highestScore = highScores[0].score;

    // Display the highest score in the span
    const highestScoreSpan = document.getElementById("highestScore");
    highestScoreSpan.textContent = highestScore;
  }
}

displayHighestScore();
