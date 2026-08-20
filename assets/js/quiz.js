const questions = [
    ['Web', 'What does HTML stand for?'],
    ['Programming', 'Which keyword is used to declare a JavaScript constant?'],
    ['CSS', 'Which CSS property changes the color of text?'],
    ['Git', 'Which Git command creates a local copy of a remote repository?'],
    ['Python', 'Which symbol starts a comment in Python?'],
    ['Computer Science', 'What does CPU stand for?'],
    ['Web', 'Which protocol is commonly used for secure websites?'],
    ['Algorithms', 'Which search algorithm requires a sorted list?']
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
