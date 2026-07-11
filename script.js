const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        navBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        sections.forEach(s => s.classList.remove('active'));
        const tab = this.dataset.tab;
        document.getElementById(tab + 'Section').classList.add('active');
    });
});

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
const voiceInputBtn = document.getElementById('voiceInputBtn');

let sourceLang = 'en';
let targetLang = 'ru';
let debounceTimer;
let isRecording = false;
let recognition = null;

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
        navigator.clipboard.writeText(sourceText.value);
        const svg = this.querySelector('svg');
        svg.style.stroke = '#1a1a1a';
        setTimeout(() => { svg.style.stroke = '#8c8c8c'; }, 600);
    }
});

copyOutputBtn.addEventListener('click', function() {
    const text = outputText.textContent.trim();
    if (text && text !== 'Перевод появится здесь...' && text !== 'Ошибка перевода') {
        navigator.clipboard.writeText(text);
        const svg = this.querySelector('svg');
        svg.style.stroke = '#1a1a1a';
        setTimeout(() => { svg.style.stroke = '#8c8c8c'; }, 600);
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

voiceInputBtn.addEventListener('click', function() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Голосовой ввод не поддерживается в вашем браузере');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (isRecording) {
        if (recognition) recognition.stop();
        isRecording = false;
        voiceInputBtn.classList.remove('recording');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = sourceLang === 'en' ? 'en-US' : 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        isRecording = true;
        voiceInputBtn.classList.add('recording');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        sourceText.value = transcript;
        charCount.textContent = transcript.length;
        updateTranslation();
    };

    recognition.onerror = function() {
        isRecording = false;
        voiceInputBtn.classList.remove('recording');
    };

    recognition.onend = function() {
        isRecording = false;
        voiceInputBtn.classList.remove('recording');
    };

    recognition.start();
});

const fullDictionary = {
    "hello": {translations: ["привет", "здравствуйте"], phonetic: "/həˈloʊ/", examples: [{en: "Hello, how are you?", ru: "Привет, как дела?"}, {en: "She said hello to everyone.", ru: "Она поздоровалась со всеми."}]},
    "goodbye": {translations: ["до свидания", "пока"], phonetic: "/ɡʊdˈbaɪ/", examples: [{en: "Goodbye, see you tomorrow.", ru: "До свидания, увидимся завтра."}, {en: "He waved goodbye.", ru: "Он помахал на прощание."}]},
    "thank you": {translations: ["спасибо", "благодарю"], phonetic: "/θæŋk juː/", examples: [{en: "Thank you for your help.", ru: "Спасибо за вашу помощь."}, {en: "Thank you very much.", ru: "Большое спасибо."}]},
    "please": {translations: ["пожалуйста", "прошу"], phonetic: "/pliːz/", examples: [{en: "Please sit down.", ru: "Пожалуйста, садитесь."}, {en: "Can I have some water, please?", ru: "Можно воды, пожалуйста?"}]},
    "sorry": {translations: ["извините", "простите", "жаль"], phonetic: "/ˈsɒri/", examples: [{en: "I'm sorry for being late.", ru: "Извините за опоздание."}, {en: "Sorry, I didn't mean that.", ru: "Прости, я не это имел в виду."}]},
    "yes": {translations: ["да"], phonetic: "/jes/", examples: [{en: "Yes, I agree.", ru: "Да, я согласен."}, {en: "Is that correct? Yes, it is.", ru: "Это правильно? Да."}]},
    "no": {translations: ["нет"], phonetic: "/noʊ/", examples: [{en: "No, thank you.", ru: "Нет, спасибо."}, {en: "There is no time left.", ru: "Не осталось времени."}]},
    "love": {translations: ["любовь", "любить"], phonetic: "/lʌv/", examples: [{en: "I love my family.", ru: "Я люблю свою семью."}, {en: "Love is beautiful.", ru: "Любовь прекрасна."}]},
    "friend": {translations: ["друг", "подруга"], phonetic: "/frend/", examples: [{en: "She is my best friend.", ru: "Она моя лучшая подруга."}, {en: "We became friends quickly.", ru: "Мы быстро подружились."}]},
    "family": {translations: ["семья"], phonetic: "/ˈfæməli/", examples: [{en: "Family comes first.", ru: "Семья на первом месте."}, {en: "I have a large family.", ru: "У меня большая семья."}]},
    "home": {translations: ["дом", "жилище"], phonetic: "/hoʊm/", examples: [{en: "I'm going home.", ru: "Я иду домой."}, {en: "Home is where the heart is.", ru: "Дом там, где сердце."}]},
    "work": {translations: ["работа", "работать"], phonetic: "/wɜːrk/", examples: [{en: "I have a lot of work.", ru: "У меня много работы."}, {en: "She works at a bank.", ru: "Она работает в банке."}]},
    "school": {translations: ["школа"], phonetic: "/skuːl/", examples: [{en: "My son goes to school.", ru: "Мой сын ходит в школу."}, {en: "School starts at eight.", ru: "Школа начинается в восемь."}]},
    "book": {translations: ["книга"], phonetic: "/bʊk/", examples: [{en: "I'm reading a good book.", ru: "Я читаю хорошую книгу."}, {en: "This book is interesting.", ru: "Эта книга интересная."}]},
    "water": {translations: ["вода"], phonetic: "/ˈwɔːtər/", examples: [{en: "Can I have a glass of water?", ru: "Можно стакан воды?"}, {en: "Water is essential for life.", ru: "Вода необходима для жизни."}]},
    "food": {translations: ["еда", "пища"], phonetic: "/fuːd/", examples: [{en: "The food here is great.", ru: "Еда здесь отличная."}, {en: "I need to buy some food.", ru: "Мне нужно купить еды."}]},
    "time": {translations: ["время", "раз"], phonetic: "/taɪm/", examples: [{en: "What time is it?", ru: "Который час?"}, {en: "I don't have enough time.", ru: "У меня недостаточно времени."}]},
    "day": {translations: ["день", "сутки"], phonetic: "/deɪ/", examples: [{en: "Have a nice day!", ru: "Хорошего дня!"}, {en: "It's a beautiful day.", ru: "Прекрасный день."}]},
    "night": {translations: ["ночь", "вечер"], phonetic: "/naɪt/", examples: [{en: "Good night!", ru: "Спокойной ночи!"}, {en: "I work at night.", ru: "Я работаю по ночам."}]},
    "today": {translations: ["сегодня"], phonetic: "/təˈdeɪ/", examples: [{en: "Today is Monday.", ru: "Сегодня понедельник."}, {en: "What are you doing today?", ru: "Что ты делаешь сегодня?"}]},
    "tomorrow": {translations: ["завтра"], phonetic: "/təˈmɔːroʊ/", examples: [{en: "See you tomorrow.", ru: "Увидимся завтра."}, {en: "Tomorrow will be better.", ru: "Завтра будет лучше."}]},
    "yesterday": {translations: ["вчера"], phonetic: "/ˈjestərdeɪ/", examples: [{en: "I saw him yesterday.", ru: "Я видел его вчера."}, {en: "Yesterday was sunny.", ru: "Вчера было солнечно."}]},
    "beautiful": {translations: ["красивый", "прекрасный"], phonetic: "/ˈbjuːtɪfəl/", examples: [{en: "You look beautiful.", ru: "Ты выглядишь красиво."}, {en: "What a beautiful view!", ru: "Какой красивый вид!"}]},
    "good": {translations: ["хороший", "добрый"], phonetic: "/ɡʊd/", examples: [{en: "Good morning!", ru: "Доброе утро!"}, {en: "This is a good idea.", ru: "Это хорошая идея."}]},
    "bad": {translations: ["плохой"], phonetic: "/bæd/", examples: [{en: "That's too bad.", ru: "Это очень плохо."}, {en: "The weather is bad today.", ru: "Погода сегодня плохая."}]},
    "big": {translations: ["большой"], phonetic: "/bɪɡ/", examples: [{en: "It's a big house.", ru: "Это большой дом."}, {en: "You have big eyes.", ru: "У тебя большие глаза."}]},
    "small": {translations: ["маленький"], phonetic: "/smɔːl/", examples: [{en: "The room is small.", ru: "Комната маленькая."}, {en: "A small dog.", ru: "Маленькая собака."}]},
    "new": {translations: ["новый"], phonetic: "/nuː/", examples: [{en: "I bought a new car.", ru: "Я купил новую машину."}, {en: "Happy New Year!", ru: "С Новым годом!"}]},
    "old": {translations: ["старый"], phonetic: "/oʊld/", examples: [{en: "This building is old.", ru: "Это здание старое."}, {en: "How old are you?", ru: "Сколько тебе лет?"}]},
    "happy": {translations: ["счастливый", "радостный"], phonetic: "/ˈhæpi/", examples: [{en: "I'm so happy!", ru: "Я так счастлив!"}, {en: "Happy birthday!", ru: "С днём рождения!"}]},
    "sad": {translations: ["грустный", "печальный"], phonetic: "/sæd/", examples: [{en: "Don't be sad.", ru: "Не грусти."}, {en: "It's a sad story.", ru: "Это грустная история."}]},
    "angry": {translations: ["злой", "сердитый"], phonetic: "/ˈæŋɡri/", examples: [{en: "He looks angry.", ru: "Он выглядит злым."}, {en: "Don't get angry.", ru: "Не злись."}]},
    "hungry": {translations: ["голодный"], phonetic: "/ˈhʌŋɡri/", examples: [{en: "I'm very hungry.", ru: "Я очень голоден."}, {en: "Are you hungry?", ru: "Ты голоден?"}]},
    "tired": {translations: ["уставший"], phonetic: "/ˈtaɪərd/", examples: [{en: "I'm too tired to go out.", ru: "Я слишком устал чтобы идти гулять."}, {en: "You look tired.", ru: "Ты выглядишь уставшим."}]},
    "cold": {translations: ["холодный"], phonetic: "/koʊld/", examples: [{en: "It's very cold outside.", ru: "На улице очень холодно."}, {en: "I have a cold.", ru: "У меня простуда."}]},
    "hot": {translations: ["горячий", "жаркий"], phonetic: "/hɒt/", examples: [{en: "The coffee is hot.", ru: "Кофе горячий."}, {en: "It's a hot day.", ru: "Жаркий день."}]},
    "fast": {translations: ["быстрый", "быстро"], phonetic: "/fæst/", examples: [{en: "He runs very fast.", ru: "Он бегает очень быстро."}, {en: "Fast food.", ru: "Быстрая еда."}]},
    "slow": {translations: ["медленный"], phonetic: "/sloʊ/", examples: [{en: "The internet is slow.", ru: "Интернет медленный."}, {en: "Please speak slower.", ru: "Пожалуйста, говорите медленнее."}]},
    "man": {translations: ["мужчина", "человек"], phonetic: "/mæn/", examples: [{en: "He is a good man.", ru: "Он хороший человек."}, {en: "An old man.", ru: "Старый мужчина."}]},
    "woman": {translations: ["женщина"], phonetic: "/ˈwʊmən/", examples: [{en: "She is a strong woman.", ru: "Она сильная женщина."}, {en: "A young woman.", ru: "Молодая женщина."}]},
    "child": {translations: ["ребёнок"], phonetic: "/tʃaɪld/", examples: [{en: "The child is playing.", ru: "Ребёнок играет."}, {en: "I have three children.", ru: "У меня трое детей."}]},
    "world": {translations: ["мир", "свет"], phonetic: "/wɜːrld/", examples: [{en: "The world is beautiful.", ru: "Мир прекрасен."}, {en: "All over the world.", ru: "По всему миру."}]},
    "life": {translations: ["жизнь"], phonetic: "/laɪf/", examples: [{en: "Life is short.", ru: "Жизнь коротка."}, {en: "Enjoy your life.", ru: "Наслаждайся жизнью."}]},
    "money": {translations: ["деньги"], phonetic: "/ˈmʌni/", examples: [{en: "I need more money.", ru: "Мне нужно больше денег."}, {en: "Money isn't everything.", ru: "Деньги это не всё."}]},
    "city": {translations: ["город"], phonetic: "/ˈsɪti/", examples: [{en: "New York is a big city.", ru: "Нью-Йорк большой город."}, {en: "I live in the city.", ru: "Я живу в городе."}]},
    "country": {translations: ["страна", "деревня"], phonetic: "/ˈkʌntri/", examples: [{en: "Russia is a large country.", ru: "Россия большая страна."}, {en: "I love my country.", ru: "Я люблю свою страну."}]},
    "sun": {translations: ["солнце"], phonetic: "/sʌn/", examples: [{en: "The sun is shining.", ru: "Солнце светит."}, {en: "Don't look at the sun.", ru: "Не смотри на солнце."}]},
    "moon": {translations: ["луна"], phonetic: "/muːn/", examples: [{en: "The moon is full tonight.", ru: "Сегодня полнолуние."}, {en: "We walked under the moon.", ru: "Мы гуляли под луной."}]},
    "star": {translations: ["звезда"], phonetic: "/stɑːr/", examples: [{en: "The stars are bright.", ru: "Звёзды яркие."}, {en: "Wish upon a star.", ru: "Загадай желание на звезду."}]},
    "tree": {translations: ["дерево"], phonetic: "/triː/", examples: [{en: "The tree is tall.", ru: "Дерево высокое."}, {en: "An apple tree.", ru: "Яблоня."}]},
    "flower": {translations: ["цветок"], phonetic: "/ˈflaʊər/", examples: [{en: "Beautiful flowers.", ru: "Красивые цветы."}, {en: "She loves flowers.", ru: "Она любит цветы."}]},
    "river": {translations: ["река"], phonetic: "/ˈrɪvər/", examples: [{en: "The river is wide.", ru: "Река широкая."}, {en: "We swam in the river.", ru: "Мы купались в реке."}]},
    "mountain": {translations: ["гора"], phonetic: "/ˈmaʊntən/", examples: [{en: "The mountain is high.", ru: "Гора высокая."}, {en: "We climbed the mountain.", ru: "Мы поднялись на гору."}]},
    "fire": {translations: ["огонь", "пожар"], phonetic: "/ˈfaɪər/", examples: [{en: "The fire is warm.", ru: "Огонь тёплый."}, {en: "Don't play with fire.", ru: "Не играй с огнём."}]},
    "earth": {translations: ["земля", "почва"], phonetic: "/ɜːrθ/", examples: [{en: "The earth is round.", ru: "Земля круглая."}, {en: "Down to earth.", ru: "Приземлённый."}]},
    "air": {translations: ["воздух"], phonetic: "/er/", examples: [{en: "Fresh air.", ru: "Свежий воздух."}, {en: "I need some air.", ru: "Мне нужно подышать воздухом."}]},
    "sky": {translations: ["небо"], phonetic: "/skaɪ/", examples: [{en: "The sky is blue.", ru: "Небо голубое."}, {en: "Birds fly in the sky.", ru: "Птицы летают в небе."}]},
    "hand": {translations: ["рука", "кисть"], phonetic: "/hænd/", examples: [{en: "Give me your hand.", ru: "Дай мне свою руку."}, {en: "Wash your hands.", ru: "Вымой руки."}]},
    "eye": {translations: ["глаз"], phonetic: "/aɪ/", examples: [{en: "She has blue eyes.", ru: "У неё голубые глаза."}, {en: "Close your eyes.", ru: "Закрой глаза."}]},
    "head": {translations: ["голова"], phonetic: "/hed/", examples: [{en: "My head hurts.", ru: "У меня болит голова."}, {en: "Use your head!", ru: "Думай головой!"}]},
    "heart": {translations: ["сердце"], phonetic: "/hɑːrt/", examples: [{en: "My heart beats fast.", ru: "Моё сердце бьётся быстро."}, {en: "Follow your heart.", ru: "Следуй за сердцем."}]},
    "phone": {translations: ["телефон"], phonetic: "/foʊn/", examples: [{en: "My phone is ringing.", ru: "Мой телефон звонит."}, {en: "Call me on my phone.", ru: "Позвони мне на телефон."}]},
    "computer": {translations: ["компьютер"], phonetic: "/kəmˈpjuːtər/", examples: [{en: "I work on a computer.", ru: "Я работаю на компьютере."}, {en: "My computer is slow.", ru: "Мой компьютер медленный."}]},
    "car": {translations: ["машина", "автомобиль"], phonetic: "/kɑːr/", examples: [{en: "I have a new car.", ru: "У меня новая машина."}, {en: "She drives a car.", ru: "Она водит машину."}]},
    "door": {translations: ["дверь"], phonetic: "/dɔːr/", examples: [{en: "Open the door.", ru: "Открой дверь."}, {en: "Close the door.", ru: "Закрой дверь."}]},
    "window": {translations: ["окно"], phonetic: "/ˈwɪndoʊ/", examples: [{en: "Look out the window.", ru: "Посмотри в окно."}, {en: "Close the window.", ru: "Закрой окно."}]},
    "table": {translations: ["стол"], phonetic: "/ˈteɪbəl/", examples: [{en: "Put it on the table.", ru: "Положи это на стол."}, {en: "A wooden table.", ru: "Деревянный стол."}]},
    "chair": {translations: ["стул"], phonetic: "/tʃer/", examples: [{en: "Sit on the chair.", ru: "Сядь на стул."}, {en: "This chair is comfortable.", ru: "Этот стул удобный."}]},
    "house": {translations: ["дом", "здание"], phonetic: "/haʊs/", examples: [{en: "I bought a house.", ru: "Я купил дом."}, {en: "This house is old.", ru: "Этот дом старый."}]},
    "street": {translations: ["улица"], phonetic: "/striːt/", examples: [{en: "I live on this street.", ru: "Я живу на этой улице."}, {en: "Cross the street.", ru: "Перейди улицу."}]},
    "road": {translations: ["дорога"], phonetic: "/roʊd/", examples: [{en: "The road is long.", ru: "Дорога длинная."}, {en: "Take the right road.", ru: "Иди по правой дороге."}]},
    "music": {translations: ["музыка"], phonetic: "/ˈmjuːzɪk/", examples: [{en: "I love music.", ru: "Я люблю музыку."}, {en: "Turn on the music.", ru: "Включи музыку."}]},
    "game": {translations: ["игра"], phonetic: "/ɡeɪm/", examples: [{en: "Let's play a game.", ru: "Давай поиграем в игру."}, {en: "Video games.", ru: "Видеоигры."}]},
    "movie": {translations: ["фильм", "кино"], phonetic: "/ˈmuːvi/", examples: [{en: "Let's watch a movie.", ru: "Давай посмотрим фильм."}, {en: "That's a great movie.", ru: "Это отличный фильм."}]},
    "question": {translations: ["вопрос"], phonetic: "/ˈkwestʃən/", examples: [{en: "I have a question.", ru: "У меня есть вопрос."}, {en: "Ask a question.", ru: "Задай вопрос."}]},
    "answer": {translations: ["ответ", "отвечать"], phonetic: "/ˈænsər/", examples: [{en: "What is the answer?", ru: "Какой ответ?"}, {en: "Please answer me.", ru: "Пожалуйста, ответь мне."}]},
    "problem": {translations: ["проблема"], phonetic: "/ˈprɒbləm/", examples: [{en: "What's the problem?", ru: "В чём проблема?"}, {en: "No problem.", ru: "Без проблем."}]},
    "idea": {translations: ["идея", "мысль"], phonetic: "/aɪˈdiːə/", examples: [{en: "Good idea!", ru: "Хорошая идея!"}, {en: "I have an idea.", ru: "У меня есть идея."}]},
    "way": {translations: ["путь", "способ"], phonetic: "/weɪ/", examples: [{en: "Which way should I go?", ru: "Куда мне идти?"}, {en: "This is the best way.", ru: "Это лучший способ."}]},
    "door": {translations: ["дверь"], phonetic: "/dɔːr/", examples: [{en: "Knock on the door.", ru: "Постучи в дверь."}, {en: "The door is locked.", ru: "Дверь заперта."}]},
    "light": {translations: ["свет", "лёгкий"], phonetic: "/laɪt/", examples: [{en: "Turn on the light.", ru: "Включи свет."}, {en: "This bag is light.", ru: "Эта сумка лёгкая."}]},
    "dark": {translations: ["тёмный", "тьма"], phonetic: "/dɑːrk/", examples: [{en: "It's dark outside.", ru: "На улице темно."}, {en: "I'm afraid of the dark.", ru: "Я боюсь темноты."}]},
    "help": {translations: ["помощь", "помогать"], phonetic: "/help/", examples: [{en: "Can you help me?", ru: "Можешь помочь мне?"}, {en: "I need help.", ru: "Мне нужна помощь."}]},
    "important": {translations: ["важный"], phonetic: "/ɪmˈpɔːrtənt/", examples: [{en: "This is very important.", ru: "Это очень важно."}, {en: "Family is important.", ru: "Семья важна."}]},
    "different": {translations: ["разный", "другой"], phonetic: "/ˈdɪfərənt/", examples: [{en: "We are different.", ru: "Мы разные."}, {en: "Try something different.", ru: "Попробуй что-то другое."}]},
    "same": {translations: ["одинаковый", "тот же"], phonetic: "/seɪm/", examples: [{en: "We think the same.", ru: "Мы думаем одинаково."}, {en: "Same as always.", ru: "Как всегда."}]},
    "always": {translations: ["всегда"], phonetic: "/ˈɔːlweɪz/", examples: [{en: "I will always love you.", ru: "Я всегда буду любить тебя."}, {en: "She is always late.", ru: "Она всегда опаздывает."}]},
    "never": {translations: ["никогда"], phonetic: "/ˈnevər/", examples: [{en: "I never lie.", ru: "Я никогда не лгу."}, {en: "Never give up.", ru: "Никогда не сдавайся."}]},
    "sometimes": {translations: ["иногда"], phonetic: "/ˈsʌmtaɪmz/", examples: [{en: "Sometimes I cook dinner.", ru: "Иногда я готовлю ужин."}, {en: "It happens sometimes.", ru: "Такое иногда случается."}]},
    "often": {translations: ["часто"], phonetic: "/ˈɒfən/", examples: [{en: "I often go there.", ru: "Я часто хожу туда."}, {en: "How often do you exercise?", ru: "Как часто ты занимаешься?"}]},
    "maybe": {translations: ["может быть", "возможно"], phonetic: "/ˈmeɪbi/", examples: [{en: "Maybe tomorrow.", ru: "Может быть завтра."}, {en: "Maybe you're right.", ru: "Возможно ты прав."}]},
    "understand": {translations: ["понимать"], phonetic: "/ˌʌndərˈstænd/", examples: [{en: "I understand you.", ru: "Я понимаю тебя."}, {en: "Do you understand?", ru: "Ты понимаешь?"}]},
    "know": {translations: ["знать"], phonetic: "/noʊ/", examples: [{en: "I know the answer.", ru: "Я знаю ответ."}, {en: "Do you know him?", ru: "Ты знаешь его?"}]},
    "think": {translations: ["думать", "считать"], phonetic: "/θɪŋk/", examples: [{en: "I think so.", ru: "Я так думаю."}, {en: "What do you think?", ru: "Что ты думаешь?"}]},
    "want": {translations: ["хотеть"], phonetic: "/wɒnt/", examples: [{en: "I want a coffee.", ru: "Я хочу кофе."}, {en: "What do you want?", ru: "Чего ты хочешь?"}]},
    "need": {translations: ["нуждаться", "нужно"], phonetic: "/niːd/", examples: [{en: "I need your help.", ru: "Мне нужна твоя помощь."}, {en: "We need to go.", ru: "Нам нужно идти."}]},
    "like": {translations: ["нравиться", "как"], phonetic: "/laɪk/", examples: [{en: "I like pizza.", ru: "Мне нравится пицца."}, {en: "She looks like her mother.", ru: "Она похожа на мать."}]},
    "speak": {translations: ["говорить"], phonetic: "/spiːk/", examples: [{en: "Do you speak English?", ru: "Вы говорите по-английски?"}, {en: "Speak slowly.", ru: "Говори медленно."}]},
    "eat": {translations: ["есть", "кушать"], phonetic: "/iːt/", examples: [{en: "Let's eat.", ru: "Давай поедим."}, {en: "I eat breakfast at seven.", ru: "Я завтракаю в семь."}]},
    "drink": {translations: ["пить", "напиток"], phonetic: "/drɪŋk/", examples: [{en: "I need a drink.", ru: "Мне нужно выпить."}, {en: "Can I have a drink?", ru: "Можно мне напиток?"}]},
    "sleep": {translations: ["спать", "сон"], phonetic: "/sliːp/", examples: [{en: "I need to sleep.", ru: "Мне нужно поспать."}, {en: "Did you sleep well?", ru: "Ты хорошо спал?"}]},
    "run": {translations: ["бегать", "бежать"], phonetic: "/rʌn/", examples: [{en: "I run every morning.", ru: "Я бегаю каждое утро."}, {en: "Run fast!", ru: "Беги быстро!"}]},
    "walk": {translations: ["ходить", "гулять"], phonetic: "/wɔːk/", examples: [{en: "Let's go for a walk.", ru: "Давай прогуляемся."}, {en: "I walk to work.", ru: "Я хожу на работу пешком."}]},
    "read": {translations: ["читать"], phonetic: "/riːd/", examples: [{en: "I love to read.", ru: "Я люблю читать."}, {en: "Read this book.", ru: "Прочитай эту книгу."}]},
    "write": {translations: ["писать"], phonetic: "/raɪt/", examples: [{en: "Please write your name.", ru: "Пожалуйста, напишите своё имя."}, {en: "I write stories.", ru: "Я пишу рассказы."}]},
    "morning": {translations: ["утро"], phonetic: "/ˈmɔːrnɪŋ/", examples: [{en: "Good morning!", ru: "Доброе утро!"}, {en: "I wake up early in the morning.", ru: "Я просыпаюсь рано утром."}]},
    "evening": {translations: ["вечер"], phonetic: "/ˈiːvnɪŋ/", examples: [{en: "Good evening!", ru: "Добрый вечер!"}, {en: "In the evening I watch TV.", ru: "Вечером я смотрю телевизор."}]}
};

const dictionarySearch = document.getElementById('dictionarySearch');
const searchSuggestions = document.getElementById('searchSuggestions');
const dictionaryResult = document.getElementById('dictionaryResult');
const allWords = Object.keys(fullDictionary);

dictionarySearch.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    if (query.length < 1) {
        searchSuggestions.classList.remove('active');
        return;
    }
    const matches = allWords.filter(w => w.startsWith(query)).slice(0, 8);
    if (matches.length === 0) {
        searchSuggestions.classList.remove('active');
        return;
    }
    searchSuggestions.innerHTML = matches.map(w =>
        `<div class="suggestion-item" data-word="${w}">${w}</div>`
    ).join('');
    searchSuggestions.classList.add('active');
});

searchSuggestions.addEventListener('click', function(e) {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    const word = item.dataset.word;
    displayWord(word);
    dictionarySearch.value = word;
    searchSuggestions.classList.remove('active');
});

dictionarySearch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const query = this.value.toLowerCase().trim();
        if (fullDictionary[query]) {
            displayWord(query);
        }
        searchSuggestions.classList.remove('active');
    }
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.dictionary-search')) {
        searchSuggestions.classList.remove('active');
    }
});

function displayWord(word) {
    const data = fullDictionary[word];
    dictionaryResult.innerHTML = `
        <div class="word-result">
            <div class="word-header">
                <span class="word-title">${word}</span>
                <span class="word-phonetic">${data.phonetic}</span>
            </div>
            <div class="word-translations">
                ${data.translations.map(t => `<span class="word-translation-tag">${t}</span>`).join('')}
            </div>
            <div class="word-examples">
                <h3>Примеры</h3>
                ${data.examples.map(ex => `
                    <div class="word-example">
                        <div class="word-example-en">${ex.en}</div>
                        <div class="word-example-ru">${ex.ru}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

const cardsStart = document.getElementById('cardsStart');
const cardsActive = document.getElementById('cardsActive');
const cardsCount = document.getElementById('cardsCount');
const flashcard = document.getElementById('flashcard');
const flashcardFront = document.getElementById('flashcardFront');
const flashcardBack = document.getElementById('flashcardBack');
const flipHint = document.getElementById('flipHint');
const difficultyButtons = document.getElementById('difficultyButtons');
const cardProgressFill = document.getElementById('cardProgressFill');
const cardProgressText = document.getElementById('cardProgressText');
const quitCardsBtn = document.getElementById('quitCardsBtn');
const cardsOptions = document.querySelectorAll('.cards-option');

let cardsMode = 'enru';
let cardsWords = [];
let cardIndex = 0;
let isFlipped = false;
let wordDifficulty = {};

cardsCount.textContent = `Доступно слов: ${allWords.length}`;

cardsOptions.forEach(opt => {
    opt.addEventListener('click', function() {
        cardsMode = this.dataset.mode;
        startCardsSession();
    });
});

function startCardsSession() {
    cardsWords = shuffleArray([...allWords]);
    cardIndex = 0;
    wordDifficulty = {};
    cardsWords.forEach(w => { wordDifficulty[w] = 0; });
    cardsStart.style.display = 'none';
    cardsActive.style.display = 'block';
    showCard();
}

function showCard() {
    if (cardIndex >= cardsWords.length) {
        cardIndex = 0;
    }
    isFlipped = false;
    flashcard.classList.remove('flipped');
    flashcardFront.style.display = 'block';
    flashcardBack.style.display = 'none';
    flipHint.style.display = 'block';
    difficultyButtons.style.display = 'none';

    const word = cardsWords[cardIndex];
    if (cardsMode === 'enru') {
        flashcardFront.textContent = word;
        flashcardBack.textContent = fullDictionary[word] ? fullDictionary[word].translations[0] : word;
    } else {
        flashcardFront.textContent = fullDictionary[word] ? fullDictionary[word].translations[0] : word;
        flashcardBack.textContent = word;
    }

    const progress = ((cardIndex) / cardsWords.length) * 100;
    cardProgressFill.style.width = progress + '%';
    cardProgressText.textContent = `${cardIndex + 1} / ${cardsWords.length}`;
}

flashcard.addEventListener('click', function() {
    if (isFlipped) return;
    isFlipped = true;
    flashcard.classList.add('flipped');
    flashcardFront.style.display = 'none';
    flashcardBack.style.display = 'block';
    flipHint.style.display = 'none';
    difficultyButtons.style.display = 'flex';
});

difficultyButtons.addEventListener('click', function(e) {
    const btn = e.target.closest('.diff-btn');
    if (!btn) return;
    const diff = parseInt(btn.dataset.diff);
    const word = cardsWords[cardIndex];
    wordDifficulty[word] = diff;
    cardIndex++;
    showCard();
});

quitCardsBtn.addEventListener('click', function() {
    cardsActive.style.display = 'none';
    cardsStart.style.display = 'block';
});

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const grammarMenu = document.getElementById('grammarMenu');
const grammarActive = document.getElementById('grammarActive');
const grammarResult = document.getElementById('grammarResult');
const grammarQuestion = document.getElementById('grammarQuestion');
const grammarOptions = document.getElementById('grammarOptions');
const grammarNextBtn = document.getElementById('grammarNextBtn');
const grammarProgressFill = document.getElementById('grammarProgressFill');
const grammarProgressText = document.getElementById('grammarProgressText');
const backToGrammarBtn = document.getElementById('backToGrammarBtn');
const grammarRetryBtn = document.getElementById('grammarRetryBtn');
const grammarExerciseBtns = document.querySelectorAll('.grammar-exercise-btn');
const grammarResultIcon = document.getElementById('grammarResultIcon');
const grammarResultTitle = document.getElementById('grammarResultTitle');
const grammarResultScore = document.getElementById('grammarResultScore');

let grammarQuestions = [];
let grammarIndex = 0;
let grammarScore = 0;
let grammarAnswered = false;

const grammarExercises = {
    articles: {
        title: "Артикли a / an / the",
        questions: [
            {sentence: "I saw ___ cat in the garden.", answer: "a", options: ["a", "an", "the", "-"]},
            {sentence: "She is ___ teacher.", answer: "a", options: ["a", "an", "the", "-"]},
            {sentence: "He ate ___ apple.", answer: "an", options: ["a", "an", "the", "-"]},
            {sentence: "___ sun is very bright today.", answer: "the", options: ["a", "an", "the", "-"]},
            {sentence: "I need ___ umbrella.", answer: "an", options: ["a", "an", "the", "-"]},
            {sentence: "___ moon goes around the earth.", answer: "the", options: ["a", "an", "the", "-"]},
            {sentence: "She is ___ honest person.", answer: "an", options: ["a", "an", "the", "-"]},
            {sentence: "We visited ___ Eiffel Tower.", answer: "the", options: ["a", "an", "the", "-"]},
            {sentence: "I want to be ___ engineer.", answer: "an", options: ["a", "an", "the", "-"]},
            {sentence: "___ water in this glass is cold.", answer: "the", options: ["a", "an", "the", "-"]},
            {sentence: "He is ___ university student.", answer: "a", options: ["a", "an", "the", "-"]},
            {sentence: "___ Amazon is a long river.", answer: "the", options: ["a", "an", "the", "-"]},
            {sentence: "Can I have ___ glass of water?", answer: "a", options: ["a", "an", "the", "-"]},
            {sentence: "She has ___ hour to finish.", answer: "an", options: ["a", "an", "the", "-"]},
            {sentence: "___ Queen of England visited.", answer: "the", options: ["a", "an", "the", "-"]},
            {sentence: "This is ___ best day ever.", answer: "the", options: ["a", "an", "the", "-"]},
            {sentence: "I adopted ___ dog yesterday.", answer: "a", options: ["a", "an", "the", "-"]},
            {sentence: "She wore ___ elegant dress.", answer: "an", options: ["a", "an", "the", "-"]},
            {sentence: "___ Alps are beautiful mountains.", answer: "the", options: ["a", "an", "the", "-"]},
            {sentence: "He is ___ European citizen.", answer: "a", options: ["a", "an", "the", "-"]}
        ]
    },
    tenses: {
        title: "Времена глаголов",
        questions: [
            {sentence: "She ___ to school every day.", answer: "goes", options: ["go", "goes", "went", "going"]},
            {sentence: "They ___ football right now.", answer: "are playing", options: ["play", "plays", "are playing", "played"]},
            {sentence: "I ___ my homework yesterday.", answer: "did", options: ["do", "does", "did", "doing"]},
            {sentence: "She ___ in London since 2020.", answer: "has lived", options: ["lived", "lives", "has lived", "living"]},
            {sentence: "We ___ to the cinema tomorrow.", answer: "will go", options: ["go", "went", "will go", "going"]},
            {sentence: "He ___ dinner when I arrived.", answer: "was cooking", options: ["cooked", "cooks", "was cooking", "has cooked"]},
            {sentence: "I ___ never been to Paris.", answer: "have", options: ["has", "have", "had", "having"]},
            {sentence: "By next year, she ___ graduated.", answer: "will have", options: ["will", "will have", "has", "had"]},
            {sentence: "They ___ for two hours before it stopped.", answer: "had been walking", options: ["walked", "had been walking", "were walking", "walk"]},
            {sentence: "I ___ a book at the moment.", answer: "am reading", options: ["read", "reads", "am reading", "was reading"]},
            {sentence: "She ___ her keys and can't find them.", answer: "has lost", options: ["lost", "loses", "has lost", "is losing"]},
            {sentence: "We ___ each other for ten years.", answer: "have known", options: ["know", "knew", "have known", "are knowing"]},
            {sentence: "He ___ when the phone rang.", answer: "was sleeping", options: ["slept", "sleeps", "was sleeping", "has slept"]},
            {sentence: "I ___ you tomorrow at the station.", answer: "will meet", options: ["meet", "met", "will meet", "meeting"]},
            {sentence: "She ___ French before she moved to Paris.", answer: "had studied", options: ["studied", "studies", "had studied", "was studying"]},
            {sentence: "Look! It ___ outside.", answer: "is snowing", options: ["snows", "snowed", "is snowing", "has snowed"]},
            {sentence: "They ___ married next month.", answer: "are getting", options: ["get", "got", "are getting", "will get"]},
            {sentence: "I ___ my work already.", answer: "have finished", options: ["finish", "finished", "have finished", "am finishing"]},
            {sentence: "While she ___, he was cooking.", answer: "was reading", options: ["read", "reads", "was reading", "has read"]},
            {sentence: "By the time we arrived, the movie ___.", answer: "had started", options: ["started", "starts", "had started", "was starting"]}
        ]
    },
    prepositions: {
        title: "Предлоги",
        questions: [
            {sentence: "She arrived ___ the airport at noon.", answer: "at", options: ["in", "at", "on", "to"]},
            {sentence: "The book is ___ the table.", answer: "on", options: ["in", "at", "on", "under"]},
            {sentence: "I live ___ Moscow.", answer: "in", options: ["in", "at", "on", "to"]},
            {sentence: "He is interested ___ music.", answer: "in", options: ["in", "at", "on", "about"]},
            {sentence: "She is good ___ math.", answer: "at", options: ["in", "at", "on", "with"]},
            {sentence: "I'm afraid ___ spiders.", answer: "of", options: ["of", "at", "in", "from"]},
            {sentence: "He apologized ___ being late.", answer: "for", options: ["for", "of", "about", "in"]},
            {sentence: "She is married ___ a doctor.", answer: "to", options: ["to", "with", "at", "for"]},
            {sentence: "I'm waiting ___ the bus.", answer: "for", options: ["for", "to", "at", "on"]},
            {sentence: "He depends ___ his parents.", answer: "on", options: ["on", "at", "in", "from"]},
            {sentence: "We talked ___ the weather.", answer: "about", options: ["about", "for", "in", "on"]},
            {sentence: "She listens ___ music every day.", answer: "to", options: ["to", "at", "for", "on"]},
            {sentence: "I agree ___ you.", answer: "with", options: ["with", "to", "at", "on"]},
            {sentence: "He arrived ___ time.", answer: "on", options: ["on", "in", "at", "by"]},
            {sentence: "The cat jumped ___ the fence.", answer: "over", options: ["over", "in", "at", "on"]},
            {sentence: "She divided the cake ___ four pieces.", answer: "into", options: ["into", "in", "to", "for"]},
            {sentence: "I'm proud ___ you.", answer: "of", options: ["of", "for", "in", "about"]},
            {sentence: "He suffers ___ a rare disease.", answer: "from", options: ["from", "of", "with", "in"]},
            {sentence: "We arrived ___ the hotel late.", answer: "at", options: ["at", "in", "on", "to"]},
            {sentence: "She insisted ___ paying the bill.", answer: "on", options: ["on", "in", "at", "for"]}
        ]
    },
    wordorder: {
        title: "Порядок слов",
        questions: [
            {sentence: "Расставьте слова: I / coffee / like / black", answer: "I like black coffee", options: ["I like black coffee", "I black like coffee", "Coffee I like black", "Like I black coffee"]},
            {sentence: "Расставьте слова: She / to / wants / go / home", answer: "She wants to go home", options: ["She wants to go home", "She to wants go home", "Wants she to go home", "To go home she wants"]},
            {sentence: "Расставьте слова: They / playing / are / football", answer: "They are playing football", options: ["They are playing football", "They playing are football", "Are they playing football", "Football they are playing"]},
            {sentence: "Расставьте слова: He / not / does / like / fish", answer: "He does not like fish", options: ["He does not like fish", "He not does like fish", "Does he not like fish", "He like not does fish"]},
            {sentence: "Расставьте слова: We / to / need / leave / now", answer: "We need to leave now", options: ["We need to leave now", "We to need leave now", "Need we to leave now", "Now we need to leave"]},
            {sentence: "Расставьте слова: Can / you / me / help", answer: "Can you help me", options: ["Can you help me", "You can help me", "Help me you can", "Me can you help"]},
            {sentence: "Расставьте слова: She / been / has / waiting", answer: "She has been waiting", options: ["She has been waiting", "She been has waiting", "Has she been waiting", "Waiting she has been"]},
            {sentence: "Расставьте слова: I / him / saw / yesterday", answer: "I saw him yesterday", options: ["I saw him yesterday", "I him saw yesterday", "Yesterday I saw him", "Saw I him yesterday"]},
            {sentence: "Расставьте слова: There / a / is / problem", answer: "There is a problem", options: ["There is a problem", "There a is problem", "A problem there is", "Is there a problem"]},
            {sentence: "Расставьте слова: She / beautifully / sings", answer: "She sings beautifully", options: ["She sings beautifully", "She beautifully sings", "Beautifully she sings", "Sings she beautifully"]},
            {sentence: "Расставьте слова: I / never / have / been / there", answer: "I have never been there", options: ["I have never been there", "I never have been there", "Never I have been there", "There I have never been"]},
            {sentence: "Расставьте слова: Please / the / open / door", answer: "Please open the door", options: ["Please open the door", "Open please the door", "The door please open", "Door the open please"]},
            {sentence: "Расставьте слова: Would / like / you / some / tea", answer: "Would you like some tea", options: ["Would you like some tea", "You would like some tea", "Some tea you would like", "Like you would some tea"]},
            {sentence: "Расставьте слова: He / always / late / is", answer: "He is always late", options: ["He is always late", "He always is late", "Always he is late", "Late he is always"]},
            {sentence: "Расставьте слова: Let's / to / the / go / park", answer: "Let's go to the park", options: ["Let's go to the park", "Let's to go the park", "Go let's to the park", "To the park let's go"]}
        ]
    }
};

grammarExerciseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const exercise = this.dataset.exercise;
        startGrammarExercise(exercise);
    });
});

function startGrammarExercise(type) {
    grammarQuestions = shuffleArray([...grammarExercises[type].questions]);
    grammarIndex = 0;
    grammarScore = 0;
    grammarAnswered = false;
    grammarMenu.style.display = 'none';
    grammarResult.style.display = 'none';
    grammarActive.style.display = 'block';
    grammarNextBtn.textContent = 'Далее';
    showGrammarQuestion();
}

function showGrammarQuestion() {
    if (grammarIndex >= grammarQuestions.length) {
        showGrammarResult();
        return;
    }
    grammarAnswered = false;
    grammarNextBtn.disabled = true;
    const q = grammarQuestions[grammarIndex];
    grammarQuestion.innerHTML = q.sentence.replace('___', '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    grammarOptions.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => selectGrammarOption(btn, opt, q));
        grammarOptions.appendChild(btn);
    });
    const progress = (grammarIndex / grammarQuestions.length) * 100;
    grammarProgressFill.style.width = progress + '%';
    grammarProgressText.textContent = `${grammarIndex + 1} / ${grammarQuestions.length}`;
}

function selectGrammarOption(btn, selected, question) {
    if (grammarAnswered) return;
    grammarAnswered = true;
    const allOpts = grammarOptions.querySelectorAll('.option-btn');
    allOpts.forEach(opt => {
        opt.classList.remove('selected');
        opt.disabled = true;
    });
    btn.classList.add('selected');
    allOpts.forEach(opt => {
        if (opt.textContent === question.answer) {
            opt.classList.add('correct');
        }
    });
    if (selected === question.answer) {
        grammarScore++;
    } else {
        btn.classList.add('incorrect');
    }
    grammarNextBtn.disabled = false;
    if (grammarIndex === grammarQuestions.length - 1) {
        grammarNextBtn.textContent = 'Завершить';
    }
}

function showGrammarResult() {
    grammarActive.style.display = 'none';
    grammarResult.style.display = 'block';
    const percentage = Math.round((grammarScore / grammarQuestions.length) * 100);
    grammarResultScore.textContent = `${grammarScore} / ${grammarQuestions.length}`;
    if (percentage >= 80) {
        grammarResultIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>`;
        grammarResultTitle.textContent = 'Отлично';
    } else if (percentage >= 50) {
        grammarResultIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e65100" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        grammarResultTitle.textContent = 'Хорошо';
    } else {
        grammarResultIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c62828" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
        grammarResultTitle.textContent = 'Попробуйте ещё';
    }
}

grammarNextBtn.addEventListener('click', function() {
    grammarIndex++;
    showGrammarQuestion();
    grammarNextBtn.textContent = 'Далее';
});

backToGrammarBtn.addEventListener('click', function() {
    grammarActive.style.display = 'none';
    grammarResult.style.display = 'none';
    grammarMenu.style.display = 'block';
});

grammarRetryBtn.addEventListener('click', function() {
    grammarActive.style.display = 'none';
    grammarResult.style.display = 'none';
    grammarMenu.style.display = 'block';
});
