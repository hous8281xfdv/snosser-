const fullDictionary = {};
const allWords = [];
const YANDEX_API_KEY = 'dict.1.1.20260711T042159Z.549d1c539fec20b4.acba35a21137df2180ee5737809a2f0f9dcc1c43';
const YANDEX_CACHE_KEY = 'yandex_dict_cache';
let yandexCache = {};

async function fetchFromYandex(word, lang = 'en-ru') {
    const cacheKey = `${lang}:${word.toLowerCase()}`;
    
    if (yandexCache[cacheKey]) {
        return yandexCache[cacheKey];
    }
    
    try {
        const response = await fetch(
            `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${YANDEX_API_KEY}&lang=${lang}&text=${encodeURIComponent(word)}&flags=4`
        );
        
        if (!response.ok) return null;
        
        const data = await response.json();
        
        if (!data.def || data.def.length === 0) {
            yandexCache[cacheKey] = null;
            saveYandexCache();
            return null;
        }
        
        const result = { t: [], p: "", ex: [], pos: "" };
        
        data.def.forEach(def => {
            if (def.ts && !result.p) result.p = `/${def.ts}/`;
            if (def.pos && !result.pos) result.pos = def.pos;
            
            def.tr.forEach(tr => {
                if (tr.text && !result.t.includes(tr.text)) {
                    result.t.push(tr.text);
                }
                
                if (tr.syn) {
                    tr.syn.forEach(syn => {
                        if (syn.text && !result.t.includes(syn.text)) {
                            result.t.push(syn.text);
                        }
                    });
                }
                
                if (tr.mean) {
                    tr.mean.forEach(m => {
                        if (m.text && !result.t.includes(m.text)) {
                            result.t.push(m.text);
                        }
                    });
                }
                
                if (tr.ex) {
                    tr.ex.forEach(ex => {
                        const ruText = ex.tr ? ex.tr.map(t => t.text).join(', ') : '';
                        if (ex.text && ruText && !result.ex.find(e => e.en === ex.text)) {
                            result.ex.push({ en: ex.text, ru: ruText });
                        }
                    });
                }
            });
        });
        
        if (result.t.length === 0) {
            yandexCache[cacheKey] = null;
            saveYandexCache();
            return null;
        }
        
        result.ex = result.ex.slice(0, 3);
        
        yandexCache[cacheKey] = result;
        saveYandexCache();
        
        return result;
    } catch(e) {
        return null;
    }
}

function saveYandexCache() {
    try {
        const toSave = {};
        let count = 0;
        for (const [key, value] of Object.entries(yandexCache)) {
            if (count < 5000) { toSave[key] = value; count++; }
        }
        localStorage.setItem(YANDEX_CACHE_KEY, JSON.stringify(toSave));
    } catch(e) {}
}

function loadYandexCache() {
    try {
        const cached = localStorage.getItem(YANDEX_CACHE_KEY);
        if (cached) {
            yandexCache = JSON.parse(cached);
        }
    } catch(e) {
        yandexCache = {};
    }
}

async function loadDictionary() {
    loadYandexCache();
    
    try {
        const wordListResponse = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt');
        if (wordListResponse.ok) {
            const text = await wordListResponse.text();
            const words = text.split('\n')
                .filter(w => w.length >= 3 && w.length <= 20 && /^[a-z]+$/.test(w.trim().toLowerCase()))
                .slice(0, 8000);
            
            words.forEach(w => {
                const clean = w.trim().toLowerCase();
                if (clean && !allWords.includes(clean)) {
                    allWords.push(clean);
                }
            });
        }
    } catch(e) {
        console.log('Using cached words only');
    }
    
    allWords.sort();
    console.log(`Loaded ${allWords.length} words. Cached translations: ${Object.keys(yandexCache).length}`);
}

async function getWordData(word) {
    const cachedData = yandexCache[`en-ru:${word.toLowerCase()}`];
    if (cachedData) return cachedData;
    
    const yandexData = await fetchFromYandex(word);
    if (yandexData) {
        fullDictionary[word] = yandexData;
        return yandexData;
    }
    
    if (yandexCache[`en-ru:${word.toLowerCase()}`] === null) {
        return { t: [word], p: "", ex: [] };
    }
    
    return null;
}

loadDictionary();
