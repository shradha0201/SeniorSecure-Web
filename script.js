const questions = [
  "What is your full name?",
  "What is your date of birth?",
  "What type of legal form do you need?",
  "Please describe your issue briefly."
];

let currentQuestion = 0;
let answers = [];

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const completeMessage = document.getElementById("complete-message");

function displayQuestion() {
  questionEl.textContent = questions[currentQuestion];
  answerEl.value = answers[currentQuestion] || "";
}

function speakCurrentQuestion() {
  const utterance = new SpeechSynthesisUtterance(questions[currentQuestion]);
  speechSynthesis.speak(utterance);
}

nextBtn.addEventListener("click", () => {
  answers[currentQuestion] = answerEl.value;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    displayQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  answers[currentQuestion] = answerEl.value;
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
});

submitBtn.addEventListener("click", () => {
  answers[currentQuestion] = answerEl.value;
  completeMessage.textContent = "Form completed! You can now download your answers.";
  downloadBtn.classList.remove("hidden");
});

resetBtn.addEventListener("click", () => {
  currentQuestion = 0;
  answers = [];
  completeMessage.textContent = "";
  answerEl.value = "";
  displayQuestion();
  downloadBtn.classList.add("hidden");
});

downloadBtn.addEventListener("click", () => {
  let text = "Your Answers:\n\n";
  questions.forEach((q, i) => {
    text += `${q}\nAnswer: ${answers[i] || "Not answered"}\n\n`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "answers.txt";
  a.click();
});



displayQuestion();
