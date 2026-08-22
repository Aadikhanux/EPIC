const questions = [
    ['AI & Tech', "What's the most funniest thing you have used AI for?"],
    ['AI & Tech', 'If you could learn any new skill instantly, what would it be?'],
    ['AI & Tech', 'If you could invent an app, what would it do?'],
    ['AI & Tech', 'If you had ₹1 lakh to start a tech project, what would you build?'],
    ['AI & Tech', 'What\'s one "smart" gadget you wish existed but doesn\'t yet?'],
    ['AI & Tech', 'Why was the QWERTY keyboard layout actually designed the way it is?'],
    ['AI & Tech', 'Roughly what share of all internet traffic comes from bots, not humans?'],
    ['AI & Tech', 'What is the full form of EPIC?'],
    ['AI & Tech', 'Ask your most-used AI chatbot: "If I were an Indian dessert, what dessert would I be?"'],
    ['AI & Tech', 'How many days do you think you can survive without searching anything on the internet or using AI?']
];

const card = document.getElementById('quizCard');
const category = document.getElementById('quizCategory');
const number = document.getElementById('quizNumber');
const question = document.getElementById('quizQuestion');
const previous = document.getElementById('quizPrevious');
const next = document.getElementById('quizNext');
const dots = document.getElementById('quizDots');
let current = 0;
let typingTimer;
let isTransitioning = false;
const typingDuration = 3500;

dots.innerHTML = questions.map((_, index) => `<span class="quiz-dot${index === 0 ? ' active' : ''}"></span>`).join('');

function typeQuestion(text) {
    window.clearTimeout(typingTimer);
    question.setAttribute('aria-label', text);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        question.textContent = text;
        question.classList.remove('is-typing');
        return;
    }

    let characterIndex = 0;
    question.textContent = '';
    question.classList.add('is-typing');

    const typeNextCharacter = () => {
        characterIndex += 1;
        question.textContent = text.slice(0, characterIndex);

        if (characterIndex < text.length) {
            typingTimer = window.setTimeout(typeNextCharacter, typingDuration / text.length);
        } else {
            question.classList.remove('is-typing');
        }
    };

    typeNextCharacter();
}

function renderQuestion(index) {
    if (index < 0 || index >= questions.length || index === current || isTransitioning) return;
    isTransitioning = true;
    window.clearTimeout(typingTimer);
    question.classList.remove('is-typing');
    card.classList.add('is-changing');
    window.setTimeout(() => {
        current = index;
        category.textContent = questions[current][0];
        number.textContent = `${String(current + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
        previous.disabled = current === 0;
        next.disabled = current === questions.length - 1;
        dots.querySelectorAll('.quiz-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
        card.classList.remove('is-changing');
        typeQuestion(questions[current][1]);
        isTransitioning = false;
    }, 220);
}

previous.disabled = true;
typeQuestion(questions[current][1]);
previous.addEventListener('click', () => renderQuestion(current - 1));
next.addEventListener('click', () => renderQuestion(current + 1));
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') renderQuestion(current - 1);
    if (event.key === 'ArrowRight') renderQuestion(current + 1);
});
