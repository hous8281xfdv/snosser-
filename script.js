const sourceText = document.getElementById('sourceText');
const outputText = document.getElementById('outputText');
const charCount = document.getElementById('charCount');
const clearBtn = document.getElementById('clearBtn');
const copySourceBtn = document.getElementById('copySourceBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const swapBtn = document.getElementById('swapBtn');
const speakBtn = document.getElementById('speakBtn');
const translationInfo = document.getElementById('translationInfo');

let sourceLang = 'en';
let targetLang = 'ru';
let debounceTimer;

async function translateWithAPI(text) {
    if (!text.trim()) {
        return '';
    }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200 || data.responseStatus === 403) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
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
        outputText.innerHTML = '<span class="placeholder-text">Ошибка перевода. Попробуйте ещё раз.</span>';
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
            setTimeout(() => {
                svg.style.stroke = '#666';
            }, 600);
        });
    }
});

copyOutputBtn.addEventListener('click', function() {
    const text = outputText.textContent.trim();
    if (text && text !== 'Перевод появится здесь...' && text !== 'Ошибка перевода. Попробуйте ещё раз.') {
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
    const temp = sourceLang;
    sourceLang = targetLang;
    targetLang = temp;

    const sourceLangElement = document.querySelector('.input-section .lang');
    const targetLangElement = document.querySelector('.output-section .lang');

    const tempText = sourceLangElement.textContent;
    sourceLangElement.textContent = targetLangElement.textContent;
    targetLangElement.textContent = tempText;

    const sourceVal = sourceText.value;
    const outputVal = outputText.textContent.trim();

    if (outputVal && outputVal !== 'Перевод появится здесь...' && outputVal !== 'Ошибка перевода. Попробуйте ещё раз.') {
        sourceText.value = outputVal;
        outputText.innerHTML = sourceVal;
        charCount.textContent = outputVal.length;
        translationInfo.textContent = 'Переведено';
    }
});

speakBtn.addEventListener('click', function() {
    const text = outputText.textContent.trim();
    if (text && text !== 'Перевод появится здесь...' && text !== 'Ошибка перевода. Попробуйте ещё раз.' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang === 'ru' ? 'ru-RU' : 'en-US';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);

        const svg = this.querySelector('svg');
        svg.style.stroke = '#1a1a1a';
        utterance.onend = () => {
            svg.style.stroke = '#666';
        };
    }
});
