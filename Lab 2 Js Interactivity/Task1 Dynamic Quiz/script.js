// 1. Define correct answers (normalized to lowercase)
const correctAnswers = {
    q1: "<h1>",
    q2: "#",
    q3: "no",
    q4: "color",
    q5: "const"
};

// 2. Individual Answer Check Function
function getPoints(id) {
    const userInput = document.getElementById(id).value.trim().toLowerCase();
    return userInput === correctAnswers[id] ? 1 : 0;
}

// 3. Main Calculation Function
function calculateScore() {
    let totalScore = 0;
    
    // Check all 5 questions
    totalScore += getPoints('q1');
    totalScore += getPoints('q2');
    totalScore += getPoints('q3');
    totalScore += getPoints('q4');
    totalScore += getPoints('q5');

    showResults(totalScore);
}

// 4. Display Results with Conditional Logic
function showResults(score) {
    const quizContent = document.getElementById('quiz-content');
    const resultArea = document.getElementById('result-area');
    const scoreNum = document.getElementById('score-number');
    const feedback = document.getElementById('feedback-msg');

    // Toggle Visibility
    quizContent.classList.add('hidden');
    resultArea.classList.remove('hidden');

    // Update DOM
    scoreNum.innerText = score;

    // Conditional Messages
    if (score === 5) {
        feedback.innerText = "🏆 Absolute Genius!";
        feedback.style.color = "#2ecc71";
    } else if (score >= 3) {
        feedback.innerText = "🥈 Great job, keep it up!";
        feedback.style.color = "#3498db";
    } else {
        feedback.innerText = "📚 Time to hit the docs!";
        feedback.style.color = "#e67e22";
    }
}

// 5. Reset Function
function resetQuiz() {
    // Clear all inputs
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`q${i}`).value = "";
    }

    // Reset visibility
    document.getElementById('quiz-content').classList.remove('hidden');
    document.getElementById('result-area').classList.add('hidden');
}