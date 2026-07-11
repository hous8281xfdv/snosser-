const fullDictionary = {};
const allWords = [];
const DICT_API_KEY = 'dict.1.1.20260711T042159Z.549d1c539fec20b4.acba35a21137df2180ee5737809a2f0f9dcc1c43';
const DICT_CACHE_KEY = 'dict_cache';
let dictCache = {};

async function fetchWordTranslation(word, lang = 'en-ru') {
    const cacheKey = `${lang}:${word.toLowerCase()}`;
    if (dictCache[cacheKey]) return dictCache[cacheKey];
    
    try {
        const response = await fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${DICT_API_KEY}&lang=${lang}&text=${encodeURIComponent(word)}&flags=4`);
        if (!response.ok) return null;
        const data = await response.json();
        if (!data.def || data.def.length === 0) { dictCache[cacheKey] = null; saveDictCache(); return null; }
        
        const result = { t: [], p: "", ex: [], pos: "" };
        data.def.forEach(def => {
            if (def.ts && !result.p) result.p = `/${def.ts}/`;
            if (def.pos && !result.pos) result.pos = def.pos;
            def.tr.forEach(tr => {
                if (tr.text && !result.t.includes(tr.text)) result.t.push(tr.text);
                if (tr.syn) tr.syn.forEach(syn => { if (syn.text && !result.t.includes(syn.text)) result.t.push(syn.text); });
                if (tr.mean) tr.mean.forEach(m => { if (m.text && !result.t.includes(m.text)) result.t.push(m.text); });
                if (tr.ex) tr.ex.forEach(ex => { const ruText = ex.tr ? ex.tr.map(t => t.text).join(', ') : ''; if (ex.text && ruText && !result.ex.find(e => e.en === ex.text)) result.ex.push({ en: ex.text, ru: ruText }); });
            });
        });
        
        if (result.t.length === 0) { dictCache[cacheKey] = null; saveDictCache(); return null; }
        result.ex = result.ex.slice(0, 3);
        dictCache[cacheKey] = result;
        saveDictCache();
        return result;
    } catch(e) { return null; }
}

function saveDictCache() {
    try { const toSave = {}; let count = 0; for (const [key, value] of Object.entries(dictCache)) { if (count < 5000) { toSave[key] = value; count++; } } localStorage.setItem(DICT_CACHE_KEY, JSON.stringify(toSave)); } catch(e) {}
}

function loadDictCache() {
    try { const cached = localStorage.getItem(DICT_CACHE_KEY); if (cached) dictCache = JSON.parse(cached); } catch(e) { dictCache = {}; }
}

async function loadDictionary() {
    loadDictCache();
    try {
        const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt');
        if (response.ok) {
            const text = await response.text();
            const words = text.split('\n').filter(w => w.length >= 3 && w.length <= 20 && /^[a-z]+$/.test(w.trim().toLowerCase())).slice(0, 8000);
            words.forEach(w => { const clean = w.trim().toLowerCase(); if (clean && !allWords.includes(clean)) allWords.push(clean); });
        }
    } catch(e) {}
    allWords.sort();
}

async function getWordData(word) {
    const cacheKey = `en-ru:${word.toLowerCase()}`;
    if (dictCache[cacheKey]) return dictCache[cacheKey];
    const data = await fetchWordTranslation(word);
    if (data) { fullDictionary[word] = data; return data; }
    if (dictCache[cacheKey] === null) return { t: [word], p: "", ex: [] };
    return null;
}

loadDictionary();
