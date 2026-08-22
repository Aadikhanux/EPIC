const questions = [
    ['AI & Fun', 'What\'s the funniest thing you have used AI for?'],
    ['Dream Skill', 'If you could learn any new skill instantly, what would it be?'],
    ['App Idea', 'If you could invent an app, what would it do?'],
    ['Tech Project', 'If you had ₹1 lakh to start a tech project, what would you build?'],
    ['Future Gadget', 'What\'s one "smart" gadget you wish existed but doesn\'t yet?'],
    ['Tech Trivia', 'Why was the QWERTY keyboard layout actually designed the way it is?'],
    ['Internet Trivia', 'Roughly what share of all internet traffic comes from bots, not humans?'],
    ['EPIC', 'What is the full form of EPIC?'],
    ['AI Challenge', 'Ask your most-used AI chatbot: "If I were an Indian dessert, what dessert would I be?"'],
    ['Digital Detox', 'How many days do you think you can survive without searching for anything on the internet or using AI?']
];

const card = document.getElementById('quizCard');
const category = document.getElementById('quizCategory');
const number = document.getElementById('quizNumber');
const question = document.getElementById('quizQuestion');
const previous = document.getElementById('quizPrevious');
const next = document.getElementById('quizNext');
const dots = document.getElementById('quizDots');
let current = 0;

dots.innerHTML = questions.map((_, index) => `<span class="quiz-dot${index === 0 ? ' active' : ''}"></span>`).join('');

function renderQuestion(index) {
    if (index < 0 || index >= questions.length || index === current) return;
    card.classList.add('is-changing');
    window.setTimeout(() => {
        current = index;
        category.textContent = questions[current][0];
        question.textContent = questions[current][1];
        number.textContent = `${String(current + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
        previous.disabled = current === 0;
        next.disabled = current === questions.length - 1;
        dots.querySelectorAll('.quiz-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
        card.classList.remove('is-changing');
    }, 220);
}

previous.disabled = true;
previous.addEventListener('click', () => renderQuestion(current - 1));
next.addEventListener('click', () => renderQuestion(current + 1));
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') renderQuestion(current - 1);
    if (event.key === 'ArrowRight') renderQuestion(current + 1);
});
