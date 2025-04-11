const formTypes = {
  "Power of Attorney": {
    en: [
      "Enter your full name:",
      "Enter the agent's name:",
      "Specify the powers granted:",
      "Effective date of this agreement:"
    ],
    hi: [
      "अपना पूरा नाम दर्ज करें:",
      "एजेंट का नाम दर्ज करें:",
      "प्रदान की गई शक्तियों को निर्दिष्ट करें:",
      "इस समझौते की प्रभावी तिथि:"
    ],
    
  },
  "Rental Agreement": {
    en: [
      "What is your full name?",
      "What is the rental property address?",
      "Start date of the rental?",
      "Monthly rent amount:"
    ],
    hi: [
      "आपका पूरा नाम क्या है?",
      "किराए की संपत्ति का पता क्या है?",
      "किराया कब शुरू होता है?",
      "मासिक किराया राशि:"
    ],
   
  },
  "Will Creation": {
    en: [
      "Enter your full legal name:",
      "Who is your primary beneficiary?",
      "List any special instructions:",
      "Date this will is signed:"
    ],
    hi: [
      "अपना पूरा कानूनी नाम दर्ज करें:",
      "आपके मुख्य लाभार्थी कौन हैं?",
      "कोई विशेष निर्देश दर्ज करें:",
      "यह वसीयत किस तारीख को हस्ताक्षरित की गई है:"
    ],
    
  }
};


let selectedForm = "";
let questions = [];
let currentQuestion = 0;
let answers = [];

const landing = document.getElementById("landing");
const formPicker = document.getElementById("form-picker");
const formSection = document.getElementById("form-section");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const completeMessage = document.getElementById("complete-message");
const chatbot = document.getElementById("chatbot");
const progress = document.getElementById("progress");
const micButton = document.querySelector("button[onclick='startSpeechToText()']");
const languageSelect = document.getElementById("languageSelect");

languageSelect.addEventListener("change", () => {
  if (selectedForm) {
    questions = formTypes[selectedForm][languageSelect.value] || formTypes[selectedForm]['en'];
    displayQuestion();
  }
});


const micInfoMessage = document.createElement("p");
micInfoMessage.textContent = "⚠️ Speech recognition is not supported in this browser.";
micInfoMessage.className = "text-sm text-red-600 mt-2";


function chooseForm(type) {
  const lang = document.getElementById("languageSelect").value;
  selectedForm = type;
  questions = formTypes[type][lang] || formTypes[type]['en'];
  currentQuestion = 0;
  answers = [];
  formPicker.classList.add("hidden");
  formSection.classList.remove("hidden");
  displayQuestion();
  checkSpeechSupport();
}


function checkSpeechSupport() {
  if (!('webkitSpeechRecognition' in window)) {
    if (micButton) micButton.disabled = true;
    if (micButton) micButton.title = "Speech recognition is not supported in this browser";
    micButton.parentNode.appendChild(micInfoMessage);
  }
}

function displayQuestion() {
  questionEl.textContent = questions[currentQuestion];
  progress.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  answerEl.value = answers[currentQuestion] || "";
}

function speakCurrentQuestion() {
  const utterance = new SpeechSynthesisUtterance(questions[currentQuestion]);
  speechSynthesis.speak(utterance);
}

function startSpeechToText() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition not supported in this browser");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    answerEl.value = transcript;
  };
  recognition.start();
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
  let text = `Form Type: ${selectedForm}\n\nYour Answers:\n\n`;
  questions.forEach((q, i) => {
    text += `${q}\nAnswer: ${answers[i] || "Not answered"}\n\n`;
  });
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "form_answers.txt";
  a.click();
});

function toggleChatbot() {
  chatbot.classList.toggle("hidden");
}

document.getElementById("startBtn").addEventListener("click", () => {
  landing.classList.add("hidden");
  formPicker.classList.remove("hidden");
});
// AI Assistant (menu-based legal help)
window.addEventListener("DOMContentLoaded", () => {
  const aiButton = document.createElement("button");
  aiButton.textContent = "🧠 Legal AI Help";
  aiButton.className = "fixed bottom-24 right-5 bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-full shadow-lg z-50";
  aiButton.onclick = () => document.getElementById("ai-help").classList.toggle("hidden");
  document.body.appendChild(aiButton);

  const aiPanel = document.createElement("div");
  aiPanel.id = "ai-help";
  aiPanel.className = "hidden fixed bottom-32 right-5 w-72 p-4 bg-white shadow-xl rounded-xl border z-40";
  aiPanel.innerHTML = `
    <h3 class="text-lg font-semibold mb-2">How can I help?</h3>
    <ul class="text-sm space-y-2">
      <li><button class="underline text-blue-600" data-response="You may want a Will Creation form if you are dividing property or naming a legal heir.">How do I create a will?</button></li>
      <li><button class="underline text-blue-600" data-response="A Power of Attorney form allows someone else to act on your behalf.">What is Power of Attorney?</button></li>
      <li><button class="underline text-blue-600" data-response="Rental Agreements are for documenting terms between landlord and tenant.">When to use Rental Agreement?</button></li>
    </ul>
  `;
  document.body.appendChild(aiPanel);

  aiPanel.querySelectorAll("button[data-response]").forEach(btn => {
    btn.addEventListener("click", () => alert(btn.dataset.response));
  });
});

