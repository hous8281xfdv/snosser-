const sourceText = document.getElementById('sourceText');
const outputText = document.getElementById('outputText');
const charCount = document.getElementById('charCount');
const clearBtn = document.getElementById('clearBtn');
const copySourceBtn = document.getElementById('copySourceBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const swapBtn = document.getElementById('swapBtn');
const speakBtn = document.getElementById('speakBtn');
const translationInfo = document.getElementById('translationInfo');
const sourceLangLabel = document.getElementById('sourceLangLabel');
const targetLangLabel = document.getElementById('targetLangLabel');

let sourceLang = 'en';
let targetLang = 'ru';
let debounceTimer;

const navBtns = document.querySelectorAll('.nav-btn');
const translatorSection = document.getElementById('translatorSection');
const quizSection = document.getElementById('quizSection');

navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        navBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tab = this.dataset.tab;
        if (tab === 'translator') {
            translatorSection.classList.add('active');
            quizSection.classList.remove('active');
        } else {
            translatorSection.classList.remove('active');
            quizSection.classList.add('active');
        }
    });
});

async function translateWithAPI(text) {
    if (!text.trim()) return '';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.responseStatus === 200 || data.responseStatus === 403) {
            return data.responseData.translatedText;
        }
        throw new Error('Translation failed');
    } catch (error) {
        return null;
    }
}

async function updateTranslation() {
    const text = sourceText.value.trim();
    if (!text) {
        outputText.innerHTML = '<span class="placeholder-text">Перевод появится здесь...</span>';
        translationInfo.textContent = '';
        return;
    }
    translationInfo.textContent = 'Перевожу...';
    const translated = await translateWithAPI(text);
    if (translated) {
        outputText.innerHTML = translated;
        translationInfo.textContent = 'Переведено';
    } else {
        outputText.innerHTML = '<span class="placeholder-text">Ошибка перевода</span>';
        translationInfo.textContent = '';
    }
}

sourceText.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = length;
    if (length > 5000) {
        this.value = this.value.substring(0, 5000);
        charCount.textContent = 5000;
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateTranslation, 600);
});

clearBtn.addEventListener('click', function() {
    sourceText.value = '';
    charCount.textContent = '0';
    outputText.innerHTML = '<span class="placeholder-text">Перевод появится здесь...</span>';
    translationInfo.textContent = '';
    sourceText.focus();
});

copySourceBtn.addEventListener('click', function() {
    if (sourceText.value) {
        navigator.clipboard.writeText(sourceText.value).then(() => {
            const svg = this.querySelector('svg');
            svg.style.stroke = '#1a1a1a';
            setTimeout(() => { svg.style.stroke = '#8c8c8c'; }, 600);
        });
    }
});

copyOutputBtn.addEventListener('click', function() {
    const text = outputText.textContent.trim();
    if (text && text !== 'Перевод появится здесь...' && text !== 'Ошибка перевода') {
        navigator.clipboard.writeText(text).then(() => {
            const svg = this.querySelector('svg');
            svg.style.stroke = '#1a1a1a';
            setTimeout(() => { svg.style.stroke = '#8c8c8c'; }, 600);
        });
    }
});

swapBtn.addEventListener('click', function() {
    const temp = sourceLang;
    sourceLang = targetLang;
    targetLang = temp;
    const tempLabel = sourceLangLabel.textContent;
    sourceLangLabel.textContent = targetLangLabel.textContent;
    targetLangLabel.textContent = tempLabel;
    const sourceVal = sourceText.value;
    const outputVal = outputText.textContent.trim();
    if (outputVal && outputVal !== 'Перевод появится здесь...' && outputVal !== 'Ошибка перевода') {
        sourceText.value = outputVal;
        outputText.innerHTML = sourceVal;
        charCount.textContent = outputVal.length;
        translationInfo.textContent = 'Переведено';
    }
});

speakBtn.addEventListener('click', function() {
    const text = outputText.textContent.trim();
    if (text && text !== 'Перевод появится здесь...' && text !== 'Ошибка перевода' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang === 'ru' ? 'ru-RU' : 'en-US';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
        const svg = this.querySelector('svg');
        svg.style.stroke = '#1a1a1a';
        utterance.onend = () => { svg.style.stroke = '#8c8c8c'; };
    }
});

const quizStart = document.getElementById('quizStart');
const quizActive = document.getElementById('quizActive');
const quizResult = document.getElementById('quizResult');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const questionText = document.getElementById('questionText');
const optionsList = document.getElementById('optionsList');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const quitQuizBtn = document.getElementById('quitQuizBtn');
const retryBtn = document.getElementById('retryBtn');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultScore = document.getElementById('resultScore');
const resultDetails = document.getElementById('resultDetails');

let currentLevel = 1;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let answered = false;

const wordBank = {
    1: [
        {ru: "привет", en: "hello", options: ["hello", "goodbye", "please", "sorry"]},
        {ru: "спасибо", en: "thank you", options: ["please", "thank you", "excuse me", "good night"]},
        {ru: "да", en: "yes", options: ["no", "yes", "maybe", "never"]},
        {ru: "нет", en: "no", options: ["yes", "no", "maybe", "always"]},
        {ru: "книга", en: "book", options: ["table", "book", "chair", "door"]},
        {ru: "вода", en: "water", options: ["fire", "water", "earth", "air"]},
        {ru: "дом", en: "house", options: ["car", "house", "tree", "street"]},
        {ru: "друг", en: "friend", options: ["family", "friend", "enemy", "teacher"]},
        {ru: "хороший", en: "good", options: ["bad", "good", "big", "small"]},
        {ru: "большой", en: "big", options: ["small", "big", "new", "old"]},
        {ru: "новый", en: "new", options: ["old", "new", "fast", "slow"]},
        {ru: "счастливый", en: "happy", options: ["sad", "angry", "happy", "tired"]},
        {ru: "сегодня", en: "today", options: ["tomorrow", "yesterday", "today", "tonight"]},
        {ru: "завтра", en: "tomorrow", options: ["today", "tomorrow", "yesterday", "morning"]},
        {ru: "ночь", en: "night", options: ["day", "night", "week", "month"]},
        {ru: "время", en: "time", options: ["money", "time", "work", "life"]},
        {ru: "работа", en: "work", options: ["school", "home", "work", "park"]},
        {ru: "школа", en: "school", options: ["university", "school", "office", "library"]},
        {ru: "семья", en: "family", options: ["friend", "family", "group", "team"]},
        {ru: "любовь", en: "love", options: ["hate", "love", "fear", "joy"]},
        {ru: "красивый", en: "beautiful", options: ["ugly", "beautiful", "strange", "common"]},
        {ru: "быстрый", en: "fast", options: ["slow", "fast", "heavy", "light"]},
        {ru: "холодный", en: "cold", options: ["hot", "cold", "warm", "cool"]},
        {ru: "голодный", en: "hungry", options: ["thirsty", "hungry", "tired", "bored"]},
        {ru: "деньги", en: "money", options: ["time", "money", "gold", "paper"]},
        {ru: "город", en: "city", options: ["village", "city", "country", "island"]},
        {ru: "улица", en: "street", options: ["road", "street", "avenue", "path"]},
        {ru: "солнце", en: "sun", options: ["moon", "sun", "star", "sky"]},
        {ru: "звезда", en: "star", options: ["planet", "star", "moon", "cloud"]},
        {ru: "небо", en: "sky", options: ["earth", "sky", "sea", "ground"]}
    ],
    2: [
        {ru: "путешествие", en: "journey", options: ["trip", "journey", "travel", "voyage"]},
        {ru: "возможность", en: "opportunity", options: ["chance", "opportunity", "possibility", "option"]},
        {ru: "правительство", en: "government", options: ["parliament", "government", "authority", "state"]},
        {ru: "образование", en: "education", options: ["learning", "education", "teaching", "training"]},
        {ru: "окружающая среда", en: "environment", options: ["nature", "environment", "surroundings", "climate"]},
        {ru: "технология", en: "technology", options: ["science", "technology", "engineering", "digital"]},
        {ru: "значительный", en: "significant", options: ["important", "significant", "serious", "major"]},
        {ru: "необходимый", en: "necessary", options: ["required", "necessary", "essential", "vital"]},
        {ru: "впечатляющий", en: "impressive", options: ["amazing", "impressive", "incredible", "wonderful"]},
        {ru: "предпочтение", en: "preference", options: ["choice", "preference", "option", "selection"]},
        {ru: "достижение", en: "achievement", options: ["success", "achievement", "progress", "victory"]},
        {ru: "ответственность", en: "responsibility", options: ["duty", "responsibility", "obligation", "task"]},
        {ru: "соревнование", en: "competition", options: ["contest", "competition", "challenge", "match"]},
        {ru: "исследование", en: "research", options: ["study", "research", "investigation", "analysis"]},
        {ru: "производительность", en: "performance", options: ["result", "performance", "output", "efficiency"]},
        {ru: "рекомендация", en: "recommendation", options: ["advice", "recommendation", "suggestion", "proposal"]},
        {ru: "обстоятельство", en: "circumstance", options: ["situation", "circumstance", "condition", "context"]},
        {ru: "любопытный", en: "curious", options: ["interested", "curious", "strange", "eager"]},
        {ru: "доступный", en: "available", options: ["free", "available", "open", "ready"]},
        {ru: "надёжный", en: "reliable", options: ["trusted", "reliable", "dependable", "honest"]},
        {ru: "выдающийся", en: "outstanding", options: ["excellent", "outstanding", "remarkable", "notable"]},
        {ru: "подходящий", en: "appropriate", options: ["suitable", "appropriate", "proper", "fitting"]},
        {ru: "немедленно", en: "immediately", options: ["quickly", "immediately", "instantly", "suddenly"]},
        {ru: "постепенно", en: "gradually", options: ["slowly", "gradually", "steadily", "gently"]},
        {ru: "определённо", en: "definitely", options: ["surely", "definitely", "certainly", "absolutely"]},
        {ru: "в основном", en: "generally", options: ["mostly", "generally", "usually", "commonly"]},
        {ru: "относительно", en: "relatively", options: ["fairly", "relatively", "comparatively", "rather"]},
        {ru: "следовательно", en: "therefore", options: ["thus", "therefore", "hence", "accordingly"]},
        {ru: "тем не менее", en: "nevertheless", options: ["however", "nevertheless", "nonetheless", "still"]},
        {ru: "вместо этого", en: "instead", options: ["rather", "instead", "otherwise", "alternatively"]}
    ],
    3: [
        {ru: "снисходительный", en: "condescending", options: ["arrogant", "condescending", "humble", "polite"]},
        {ru: "добросовестный", en: "conscientious", options: ["careful", "conscientious", "careless", "lazy"]},
        {ru: "проницательный", en: "insightful", options: ["shallow", "insightful", "ignorant", "dull"]},
        {ru: "непредубеждённый", en: "unprejudiced", options: ["biased", "unprejudiced", "unfair", "partial"]},
        {ru: "целеустремлённый", en: "persevering", options: ["lazy", "persevering", "quitting", "weak"]},
        {ru: "поверхностный", en: "superficial", options: ["deep", "superficial", "thorough", "detailed"]},
        {ru: "неизбежный", en: "inevitable", options: ["avoidable", "inevitable", "optional", "uncertain"]},
        {ru: "правдоподобный", en: "plausible", options: ["unlikely", "plausible", "impossible", "doubtful"]},
        {ru: "существенный", en: "substantial", options: ["minor", "substantial", "trivial", "slight"]},
        {ru: "противоречивый", en: "controversial", options: ["agreed", "controversial", "settled", "peaceful"]},
        {ru: "неоднозначный", en: "ambiguous", options: ["clear", "ambiguous", "obvious", "precise"]},
        {ru: "убедительный", en: "compelling", options: ["weak", "compelling", "feeble", "lame"]},
        {ru: "преобладающий", en: "predominant", options: ["rare", "predominant", "scarce", "minor"]},
        {ru: "тщательный", en: "thorough", options: ["careless", "thorough", "hasty", "sloppy"]},
        {ru: "своеобразный", en: "peculiar", options: ["normal", "peculiar", "common", "ordinary"]},
        {ru: "нелепый", en: "preposterous", options: ["sensible", "preposterous", "reasonable", "logical"]},
        {ru: "изысканный", en: "exquisite", options: ["plain", "exquisite", "rough", "crude"]},
        {ru: "чрезвычайный", en: "extraordinary", options: ["ordinary", "extraordinary", "average", "usual"]},
        {ru: "беспрецедентный", en: "unprecedented", options: ["common", "unprecedented", "regular", "normal"]},
        {ru: "изобретательный", en: "ingenious", options: ["stupid", "ingenious", "dumb", "simple"]},
        {ru: "снисхождение", en: "indulgence", options: ["strictness", "indulgence", "harshness", "severity"]},
        {ru: "последствие", en: "repercussion", options: ["cause", "repercussion", "source", "origin"]},
        {ru: "заблуждение", en: "misconception", options: ["truth", "misconception", "fact", "reality"]},
        {ru: "красноречие", en: "eloquence", options: ["silence", "eloquence", "mumble", "stutter"]},
        {ru: "стойкость", en: "resilience", options: ["weakness", "resilience", "fragility", "delicacy"]},
        {ru: "доблесть", en: "valor", options: ["cowardice", "valor", "fear", "timidity"]},
        {ru: "осмотрительность", en: "prudence", options: ["recklessness", "prudence", "carelessness", "rashness"]},
        {ru: "смирение", en: "humility", options: ["pride", "humility", "arrogance", "vanity"]},
        {ru: "недомогание", en: "malaise", options: ["comfort", "malaise", "health", "vigor"]},
        {ru: "затруднение", en: "predicament", options: ["solution", "predicament", "ease", "comfort"]}
    ]
};

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateQuestions(level) {
    const bank = wordBank[level];
    const shuffled = shuffleArray(bank);
    return shuffled.slice(0, 30).map(item => ({
        ru: item.ru,
        en: item.en,
        options: shuffleArray(item.options)
    }));
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }
    answered = false;
    selectedOption = null;
    nextBtn.disabled = true;
    const question = questions[currentQuestionIndex];
    questionText.textContent = `Как переводится "${question.ru}" на английский?`;
    optionsList.innerHTML = '';
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => selectOption(btn, option, question));
        optionsList.appendChild(btn);
    });
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
}

function selectOption(btn, selected, question) {
    if (answered) return;
    answered = true;
    selectedOption = selected;
    const allOptions = optionsList.querySelectorAll('.option-btn');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    btn.classList.add('selected');
    allOptions.forEach(opt => {
        if (opt.textContent === question.en) {
            opt.classList.add('correct');
        }
    });
    if (selected === question.en) {
        score++;
    } else {
        btn.classList.add('incorrect');
    }
    allOptions.forEach(opt => opt.disabled = true);
    nextBtn.disabled = false;
}

function showResult() {
    quizActive.style.display = 'none';
    quizResult.style.display = 'block';
    const percentage = Math.round((score / questions.length) * 100);
    resultScore.textContent = `${score} / ${questions.length}`;
    if (percentage >= 90) {
        resultIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>`;
        resultTitle.textContent = 'Отлично';
        resultDetails.textContent = `Вы набрали ${percentage}% правильных ответов`;
    } else if (percentage >= 60) {
        resultIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e65100" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        resultTitle.textContent = 'Хорошо';
        resultDetails.textContent = `Вы набрали ${percentage}% правильных ответов`;
    } else {
        resultIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c62828" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
        resultTitle.textContent = 'Попробуйте ещё';
        resultDetails.textContent = `Вы набрали ${percentage}% правильных ответов`;
    }
}

function startQuiz(level) {
    currentLevel = level;
    questions = generateQuestions(level);
    currentQuestionIndex = 0;
    score = 0;
    quizStart.style.display = 'none';
    quizResult.style.display = 'none';
    quizActive.style.display = 'block';
    showQuestion();
}

function resetQuiz() {
    quizActive.style.display = 'none';
    quizResult.style.display = 'none';
    quizStart.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
}

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const level = parseInt(this.dataset.level);
        startQuiz(level);
    });
});

nextBtn.addEventListener('click', function() {
    currentQuestionIndex++;
    showQuestion();
});

quitQuizBtn.addEventListener('click', function() {
    resetQuiz();
});

retryBtn.addEventListener('click', function() {
    resetQuiz();
});
