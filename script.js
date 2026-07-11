function initNavigation() {
    const navBtns = document.querySelectorAll('#mainNav .nav-btn');
    const sections = document.querySelectorAll('.section');
    const level = levelSystem.getLevel(userData.score);

    navBtns.forEach(btn => {
        const tab = btn.dataset.tab;
        btn.classList.remove('locked');
        
        if (tab === 'grammar' && !levelSystem.isUnlocked(level.name, 'grammar_easy')) {
            btn.classList.add('locked');
        }
    });

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('locked')) return;
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            const sectionId = this.dataset.tab + 'Section';
            document.getElementById(sectionId).classList.add('active');
            
            if (this.dataset.tab === 'cards') initCards();
            if (this.dataset.tab === 'grammar') initGrammar();
            if (this.dataset.tab === 'quiz') initQuiz();
        });
    });
}

const dictionarySearch = document.getElementById('dictionarySearch');
const searchSuggestions = document.getElementById('searchSuggestions');
const dictionaryResult = document.getElementById('dictionaryResult');

if (dictionarySearch) {
    dictionarySearch.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (query.length < 1) { searchSuggestions.classList.remove('active'); return; }
        const matches = allWords.filter(w => w.startsWith(query)).slice(0, 8);
        if (matches.length === 0) { searchSuggestions.classList.remove('active'); return; }
        searchSuggestions.innerHTML = matches.map(w => `<div class="suggestion-item" data-word="${w}">${w}</div>`).join('');
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
            if (fullDictionary[query]) displayWord(query);
            searchSuggestions.classList.remove('active');
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-wrapper')) searchSuggestions.classList.remove('active');
    });
}

function displayWord(word) {
    const data = fullDictionary[word];
    if (!data) return;
    dictionaryResult.innerHTML = `
        <div class="word-result">
            <div class="word-header"><span class="word-title">${word}</span><span class="word-phonetic">${data.p}</span></div>
            <div class="word-translations">${data.t.map(t => `<span class="word-tag">${t}</span>`).join('')}</div>
            <div class="word-examples"><h4>Примеры</h4>${data.ex.map(e => `<div class="word-example"><div class="word-example-en">${e.en}</div><div class="word-example-ru">${e.ru}</div></div>`).join('')}</div>
        </div>
    `;
    userData.wordsLearned = (userData.wordsLearned || 0) + 1;
    const newAchs = checkAchievements(userData);
    newAchs.forEach(a => userData.achievements.push(a));
    saveUserData();
    updateLevelDisplay();
}
