const questions = [
    { category: 'Web', question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'HighText Machine Language', 'Hyper Transfer Markup Link', 'Home Tool Markup Language'], answer: 0 },
    { category: 'Programming', question: 'Which value is used for a JavaScript constant?', options: ['var', 'let', 'const', 'static'], answer: 2 },
    { category: 'CSS', question: 'Which CSS property changes text color?', options: ['font-color', 'text-color', 'foreground', 'color'], answer: 3 },
    { category: 'Git', question: 'Which command creates a local copy of a remote repository?', options: ['git clone', 'git copy', 'git fetch-all', 'git init-copy'], answer: 0 },
    { category: 'Python', question: 'Which symbol starts a comment in Python?', options: ['//', '#', '<!--', '**'], answer: 1 },
    { category: 'Computer Science', question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Utility', 'Core Program User', 'Central Program Utility'], answer: 0 },
    { category: 'Web', question: 'Which protocol is commonly used for secure websites?', options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'], answer: 2 },
    { category: 'Algorithms', question: 'Which search requires a sorted list?', options: ['Linear search', 'Binary search', 'Random search', 'Depth-first search'], answer: 1 }
];

let current = 0;
let score = 0;
let answered = false;
const get = id => document.getElementById(id);

function renderQuestion() {
    answered = false;
    const item = questions[current];
    get('quizProgress').textContent = `Question ${current + 1} of ${questions.length}`;
    get('quizScore').textContent = `Score: ${score}`;
    get('quizProgressBar').style.width = `${((current + 1) / questions.length) * 100}%`;
    get('quizCategory').textContent = item.category;
    get('quizQuestion').textContent = item.question;
    get('quizFeedback').textContent = '';
    get('quizNext').disabled = true;
    get('quizNext').innerHTML = current === questions.length - 1 ? 'See result <i class="fa-solid fa-arrow-right"></i>' : 'Next question <i class="fa-solid fa-arrow-right"></i>';
    get('quizOptions').innerHTML = item.options.map((option, index) => `<button class="quiz-option" type="button" data-index="${index}">${option}</button>`).join('');
    get('quizOptions').querySelectorAll('button').forEach(button => button.addEventListener('click', chooseAnswer));
}

function chooseAnswer(event) {
    if (answered) return;
    answered = true;
    const selected = Number(event.currentTarget.dataset.index);
    const correct = questions[current].answer;
    if (selected === correct) {
        score++;
        event.currentTarget.classList.add('correct');
        get('quizFeedback').textContent = 'Correct — nicely done!';
    } else {
        event.currentTarget.classList.add('wrong');
        get('quizOptions').children[correct].classList.add('correct');
        get('quizFeedback').textContent = `The correct answer is ${questions[current].options[correct]}.`;
    }
    [...get('quizOptions').children].forEach(button => button.disabled = true);
    get('quizScore').textContent = `Score: ${score}`;
    get('quizNext').disabled = false;
}

get('quizNext').addEventListener('click', () => {
    if (current < questions.length - 1) { current++; renderQuestion(); return; }
    get('quizCard').hidden = true;
    get('quizResult').hidden = false;
    const percent = Math.round((score / questions.length) * 100);
    get('resultTitle').textContent = percent >= 75 ? 'Excellent work!' : percent >= 50 ? 'Good effort!' : 'Keep learning!';
    get('resultScore').textContent = `You scored ${score} out of ${questions.length} (${percent}%).`;
});

get('quizRestart').addEventListener('click', () => {
    current = 0; score = 0;
    get('quizResult').hidden = true;
    get('quizCard').hidden = false;
    renderQuestion();
});

renderQuestion();
