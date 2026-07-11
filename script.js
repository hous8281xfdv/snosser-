const sourceText = document.getElementById('sourceText');
const outputText = document.getElementById('outputText');
const charCount = document.getElementById('charCount');
const clearBtn = document.getElementById('clearBtn');
const copySourceBtn = document.getElementById('copySourceBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const swapBtn = document.getElementById('swapBtn');
const speakBtn = document.getElementById('speakBtn');
const translationInfo = document.getElementById('translationInfo');

const dictionary = {
    "hello": "привет",
    "hi": "привет",
    "hey": "эй",
    "goodbye": "до свидания",
    "bye": "пока",
    "good morning": "доброе утро",
    "good evening": "добрый вечер",
    "good night": "спокойной ночи",
    "thank you": "спасибо",
    "thanks": "спасибо",
    "please": "пожалуйста",
    "sorry": "извините",
    "excuse me": "простите",
    "yes": "да",
    "no": "нет",
    "maybe": "может быть",
    "never": "никогда",
    "always": "всегда",
    "sometimes": "иногда",
    "often": "часто",
    "love": "любовь",
    "hate": "ненависть",
    "friend": "друг",
    "family": "семья",
    "home": "дом",
    "work": "работа",
    "school": "школа",
    "university": "университет",
    "book": "книга",
    "water": "вода",
    "food": "еда",
    "time": "время",
    "day": "день",
    "night": "ночь",
    "week": "неделя",
    "month": "месяц",
    "year": "год",
    "today": "сегодня",
    "tomorrow": "завтра",
    "yesterday": "вчера",
    "big": "большой",
    "small": "маленький",
    "good": "хороший",
    "bad": "плохой",
    "beautiful": "красивый",
    "ugly": "уродливый",
    "new": "новый",
    "old": "старый",
    "fast": "быстрый",
    "slow": "медленный",
    "hot": "горячий",
    "cold": "холодный",
    "happy": "счастливый",
    "sad": "грустный",
    "angry": "злой",
    "tired": "уставший",
    "hungry": "голодный",
    "thirsty": "жаждущий",
    "man": "мужчина",
    "woman": "женщина",
    "child": "ребёнок",
    "people": "люди",
    "person": "человек",
    "world": "мир",
    "life": "жизнь",
    "death": "смерть",
    "hand": "рука",
    "eye": "глаз",
    "head": "голова",
    "heart": "сердце",
    "mind": "разум",
    "problem": "проблема",
    "question": "вопрос",
    "answer": "ответ",
    "idea": "идея",
    "way": "путь",
    "car": "машина",
    "house": "дом",
    "door": "дверь",
    "window": "окно",
    "table": "стол",
    "chair": "стул",
    "phone": "телефон",
    "computer": "компьютер",
    "money": "деньги",
    "city": "город",
    "country": "страна",
    "street": "улица",
    "road": "дорога",
    "river": "река",
    "mountain": "гора",
    "tree": "дерево",
    "flower": "цветок",
    "sun": "солнце",
    "moon": "луна",
    "star": "звезда",
    "sky": "небо",
    "fire": "огонь",
    "earth": "земля",
    "air": "воздух",
    "how are you": "как дела",
    "what is your name": "как вас зовут",
    "my name is": "меня зовут",
    "i am": "я",
    "you are": "ты",
    "he is": "он",
    "she is": "она",
    "it is": "это",
    "we are": "мы",
    "they are": "они",
    "i have": "у меня есть",
    "i want": "я хочу",
    "i need": "мне нужно",
    "i like": "мне нравится",
    "i love": "я люблю",
    "i can": "я могу",
    "i will": "я буду",
    "i think": "я думаю",
    "i know": "я знаю",
    "i understand": "я понимаю",
    "i don't understand": "я не понимаю",
    "i speak": "я говорю",
    "i don't speak": "я не говорю",
    "i don't know": "я не знаю",
    "nice to meet you": "приятно познакомиться",
    "see you later": "увидимся позже",
    "take care": "береги себя",
    "good luck": "удачи",
    "have a nice day": "хорошего дня",
    "i'm sorry": "мне жаль",
    "no problem": "без проблем",
    "you're welcome": "пожалуйста",
    "of course": "конечно",
    "excuse me": "извините",
    "how much": "сколько",
    "where is": "где находится",
    "what is": "что такое",
    "who is": "кто",
    "when": "когда",
    "where": "где",
    "why": "почему",
    "how": "как",
    "what": "что",
    "which": "который",
    "the": "",
    "a": "",
    "an": "",
    "is": "",
    "are": "",
    "am": "",
    "was": "",
    "were": "",
    "be": "",
    "been": "",
    "being": "",
    "have": "",
    "has": "",
    "had": "",
    "do": "",
    "does": "",
    "did": "",
    "will": "",
    "would": "",
    "could": "",
    "should": "",
    "may": "",
    "might": "",
    "must": "",
    "shall": "",
    "can": "",
    "to": "",
    "of": "",
    "in": "",
    "for": "",
    "on": "",
    "with": "",
    "at": "",
    "by": "",
    "from": "",
    "as": "",
    "into": "",
    "through": "",
    "during": "",
    "before": "",
    "after": "",
    "above": "",
    "below": "",
    "between": "",
    "and": "",
    "but": "",
    "or": "",
    "because": "",
    "so": "",
    "if": "",
    "than": "",
    "that": "",
    "this": "",
    "these": "",
    "those": "",
    "it": "",
    "its": ""
};

function translate(text) {
    if (!text.trim()) {
        return '';
    }

    const words = text.toLowerCase().split(/\s+/);
    const translatedWords = words.map(word => {
        const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
        const punctuation = word.match(/[.,!?;:'"()]/g);
        const translated = dictionary[cleanWord];
        
        if (translated === undefined) {
            return cleanWord;
        }
        
        if (translated === '') {
            return '';
        }
        
        if (punctuation) {
            return translated + punctuation.join('');
        }
        
        return translated;
    });

    let result = translatedWords.filter(word => word !== '').join(' ');
    
    const phrases = [
        "how are you", "what is your name", "my name is", "nice to meet you",
        "see you later", "take care", "good luck", "have a nice day",
        "i'm sorry", "no problem", "you're welcome", "of course",
        "good morning", "good evening", "good night", "thank you",
        "excuse me", "i don't understand", "i don't know", "i don't speak"
    ];

    for (const phrase of phrases) {
        if (text.toLowerCase().includes(phrase)) {
            const phraseTranslation = dictionary[phrase];
            if (phraseTranslation) {
                result = result.replace(new RegExp(phraseTranslation.split(' ').join('\\s+'), 'gi'), phraseTranslation);
            }
        }
    }

    return result || text;
}

function updateTranslation() {
    const text = sourceText.value;
    const translated = translate(text);
    
    if (translated) {
        outputText.innerHTML = translated;
        translationInfo.textContent = 'Переведено';
    } else {
        outputText.innerHTML = '<span class="placeholder-text">Перевод появится здесь...</span>';
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
    
    updateTranslation();
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
            setTimeout(() => {
                svg.style.stroke = '#666';
            }, 600);
        });
    }
});

copyOutputBtn.addEventListener('click', function() {
    const text = outputText.textContent.trim();
    if (text && text !== 'Перевод появится здесь...') {
        navigator.clipboard.writeText(text).then(() => {
            const svg = this.querySelector('svg');
            svg.style.stroke = '#1a1a1a';
            setTimeout(() => {
                svg.style.stroke = '#666';
            }, 600);
        });
    }
});

swapBtn.addEventListener('click', function() {
    const source = sourceText.value;
    const output = outputText.textContent.trim();
    
    if (output && output !== 'Перевод появится здесь...') {
        sourceText.value = output;
        outputText.innerHTML = source;
        charCount.textContent = output.length;
        translationInfo.textContent = 'Переведено';
    }
    
    const sourceLang = document.querySelector('.input-section .lang');
    const targetLang = document.querySelector('.output-section .lang');
    
    const tempLang = sourceLang.textContent;
    sourceLang.textContent = targetLang.textContent;
    targetLang.textContent = tempLang;
});

speakBtn.addEventListener('click', function() {
    const text = outputText.textContent.trim();
    if (text && text !== 'Перевод появится здесь...' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
        
        const svg = this.querySelector('svg');
        svg.style.stroke = '#1a1a1a';
        utterance.onend = () => {
            svg.style.stroke = '#666';
        };
    }
});

sourceText.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        updateTranslation();
    }
});
