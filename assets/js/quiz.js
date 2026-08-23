const questions = [
    ['AI & Fun', 'What\'s the funniest thing you have used AI for?'],
    ['Dream Skill', 'If you could learn any new skill instantly, what would it be?'],
    ['App Idea', 'If you could invent an app, what would it do?'],
    ['Tech Project', 'If you had \u20B91 lakh to start a tech project, what would you build?'],
    ['Future Gadget', 'What\'s one "smart" gadget you wish existed but doesn\'t yet?'],
    ['Tech Trivia', 'Why was the QWERTY keyboard layout actually designed the way it is?'],
    ['Internet Trivia', 'Roughly what share of all internet traffic comes from bots, not humans?'],
    ['EPIC', 'What is the full form of EPIC?'],
    ['AI Challenge', 'Ask your most-used AI chatbot: "If I were an Indian dessert, what dessert would I be?"'],
    ['Digital Detox', 'How many days do you think you can survive without searching for anything on the internet or using AI?']
];

const card = document.getElementById('quizCard');
const question = document.getElementById('quizQuestion');
const previous = document.getElementById('quizPrevious');
const next = document.getElementById('quizNext');
let current = 0;
let typingTimer;
let isTransitioning = false;
const typingDuration = 2000;

function fitQuestionToTwoLines() {
    question.style.fontSize = '';
    let fontSize = parseFloat(window.getComputedStyle(question).fontSize);

    while (fontSize > 20) {
        const styles = window.getComputedStyle(question);
        const lineHeight = parseFloat(styles.lineHeight);
        if (question.scrollHeight <= lineHeight * 2.1) break;
        fontSize -= 1;
        question.style.fontSize = `${fontSize}px`;
    }
}

function typeQuestion(text) {
    window.clearTimeout(typingTimer);
    question.setAttribute('aria-label', text);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        question.textContent = text;
        question.classList.remove('is-typing');
        fitQuestionToTwoLines();
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
            fitQuestionToTwoLines();
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
        previous.disabled = current === 0;
        next.disabled = current === questions.length - 1;
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
window.addEventListener('resize', fitQuestionToTwoLines);
