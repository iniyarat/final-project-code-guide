let quiz;
let questionsData = [];

// CLASS
class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.currentIndex = 0;
    this.score = 0;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  nextQuestion() {
    this.currentIndex++;
  }
}

// SUBCLASS
class MultipleChoiceQuiz extends Quiz {
  checkAnswer(selected) {
    if (selected === this.getCurrentQuestion().answer) {
      this.score++;
      return true;
    }
    return false;
  }
}

// ELEMENTS
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");

const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");
const resultScreen = document.getElementById("result-screen");

// LOAD QUESTIONS (FETCH)
async function loadQuestions() {
  let response = await fetch("questions.json");
  questionsData = await response.json();
}

// START QUIZ
startBtn.addEventListener("click", async () => {
  await loadQuestions();

  quiz = new MultipleChoiceQuiz(questionsData);

  startScreen.style.display = "none";
  quizContainer.style.display = "block";

  showQuestion();
});

// SHOW QUESTION
function showQuestion() {
  answersEl.innerHTML = "";
  nextBtn.disabled = true; // disable next until answered

  let current = quiz.getCurrentQuestion();
  questionEl.textContent = current.question;

  let answered = false;

  for (let i = 0; i < current.options.length; i++) {
    let btn = document.createElement("button");
    btn.textContent = current.options[i];

    btn.addEventListener("click", () => {
      if (answered) return; // prevent multiple answers
      answered = true;

      let correct = quiz.checkAnswer(current.options[i]);

      if (correct) {
        btn.style.backgroundColor = "green";
      } else {
        btn.style.backgroundColor = "red";
      }

      // show correct answer + disable all buttons
      let buttons = answersEl.querySelectorAll("button");
      for (let b of buttons) {
        if (b.textContent === current.answer) {
          b.style.backgroundColor = "green";
        }
        b.disabled = true;
      }

      nextBtn.disabled = false; // allow moving forward
    });

    answersEl.appendChild(btn);
  }
}

// NEXT QUESTION
nextBtn.addEventListener("click", () => {
  quiz.nextQuestion();

  if (quiz.currentIndex < quiz.questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// SHOW RESULT
function showResult() {
  quizContainer.style.display = "none";
  resultScreen.style.display = "block";

  scoreEl.textContent = `You scored ${quiz.score} out of ${quiz.questions.length}`;

  // SAVE SCORE (DLC)
  localStorage.setItem("lastScore", JSON.stringify(quiz.score));
}

// RESTART
restartBtn.addEventListener("click", () => {
  location.reload();
});