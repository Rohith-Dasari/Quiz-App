const questions = [
  {
    id: "q1",
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "22"],
    answer: 1
  },
  {
    id: "q2",
    question: "Which language runs in the browser?",
    options: ["Python", "Java", "C++", "JavaScript"],
    answer: 3
  },
  {
    id: "q3",
    question: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Cascading Simple Sheets",
      "Cars SUVs Sailboats"
    ],
    answer: 1
  },
  {
    id: "q4",
    question: "What is 7*5?",
    options: ["30", "35", "40", "47"],
    answer: 1
  },
  {
    id: "q5",
    question: "What is the DOM?",
    options: [
      "Document Object Model",
      "Data Object Model",
      "Desktop Object Model",
      "Document Oriented Map"
    ],
    answer: 0
  }
];

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);
let markedForReview = new Array(questions.length).fill(false);
const total=questions.length


const questionBox = document.getElementById("question-box");
const navBox = document.getElementById("question-nav");
const resultBox = document.getElementById("result");
const statsBox = document.getElementById("q-stats");
const markBtn = document.getElementById("mark-btn");

function updateMarkBtn() {
  markBtn.innerText = markedForReview[currentQuestion]
    ? "Unmark Review"
    : "Mark for Review";
}

function getStats() {
  return {
    answered: userAnswers.filter(a => a !== null).length,
    review: markedForReview.filter(Boolean).length
  };
}

function updateSidebar() {
  const buttons = navBox.querySelectorAll(".question-btn");
  buttons.forEach((btn, i) => {
    btn.className = "question-btn"; 
    if (markedForReview[i]) btn.classList.add("review");
    else if (userAnswers[i] !== null) btn.classList.add("answered");
    else btn.classList.add("default");

    if (i === currentQuestion) btn.classList.add("active");
  });

  const {answered, review } = getStats();
  statsBox.innerHTML = `
  <span>Answered: ${answered} / ${total}</span>
  <span>Review: ${review}</span>
`;
}

function loadSidebar() {
  navBox.innerHTML = "";
  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.innerText = i + 1;
    btn.classList.add("question-btn");
    btn.dataset.index = i;
    btn.addEventListener("click", () => {
      currentQuestion = i;
      loadQuestion(currentQuestion);
    });
    navBox.appendChild(btn);
  });
  updateSidebar();
}

function loadQuestion(index) {
  const q = questions[index];
  questionBox.innerHTML = `
    <h2>Q${index + 1}. ${q.question}</h2>
    <div class="options">
      ${q.options
        .map(
          (opt, i) => `
        <label>
          <input type="radio" name="option" value="${i}" ${
            userAnswers[index] === i ? "checked" : ""
          }>
          ${opt}
        </label>
      `
        )
        .join("")}
    </div>
  `;

  questionBox.querySelectorAll("input[name='option']").forEach(inp => {
    inp.addEventListener("change", () => {
      userAnswers[currentQuestion] = +inp.value;
      updateSidebar();
    });
  });

  updateMarkBtn();
  updateSidebar();
}

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion(currentQuestion);
  }
});

document.getElementById("clear-btn").addEventListener("click", () => {
  userAnswers[currentQuestion] = null;
  loadQuestion(currentQuestion); 
});

markBtn.addEventListener("click", () => {
  markedForReview[currentQuestion] = !markedForReview[currentQuestion];
  loadQuestion(currentQuestion); 
});

document.getElementById("submit-btn").addEventListener("click", () => {
  let score = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });

  const { total, answered, review } = getStats();
  resultBox.innerHTML = `
    <div>You scored <strong>${score}</strong> / ${total}</div>
    <div>Answered: ${answered} | Marked for review: ${review}</div>
    <div class="summary" style="margin-top:8px">
      ${questions
        .map((q, i) => {
          const ua = userAnswers[i];
          const correct = q.answer;
          const status =
            ua === null
              ? "Unanswered"
              : ua === correct
              ? "Correct"
              : "Wrong";
          return `<div>
            Q${i + 1}: ${status} ${
            ua !== null ? `(Your: ${q.options[ua]})` : ""
          } ${
            status !== "Correct" ? ` - Ans: ${q.options[correct]}` : ""
          }
          </div>`;
        })
        .join("")}
    </div>
  `;
});

loadSidebar();
loadQuestion(currentQuestion);
