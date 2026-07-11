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
const searchSpinner = document.getElementById('searchSpinner');

if (dictionarySearch) {
    dictionarySearch.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (query.length < 2) { searchSuggestions.classList.remove('active'); return; }
        const matches = allWords.filter(w => w.startsWith(query)).slice(0, 10);
        if (matches.length === 0) { searchSuggestions.classList.remove('active'); return; }
        searchSuggestions.innerHTML = matches.map(w => `<div class="suggestion-item" data-word="${w}">${w}</div>`).join('');
        searchSuggestions.classList.add('active');
    });

    searchSuggestions.addEventListener('click', async function(e) {
        const item = e.target.closest('.suggestion-item');
        if (!item) return;
        const word = item.dataset.word;
        dictionarySearch.value = word;
        searchSuggestions.classList.remove('active');
        dictionaryResult.innerHTML = '<div class="skeleton skeleton-word"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line short"></div>';
        searchSpinner.classList.add('active');
        await displayWord(word);
        searchSpinner.classList.remove('active');
    });

    dictionarySearch.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            const query = this.value.toLowerCase().trim();
            if (!query) return;
            searchSuggestions.classList.remove('active');
            dictionaryResult.innerHTML = '<div class="skeleton skeleton-word"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line short"></div>';
            searchSpinner.classList.add('active');
            await displayWord(query);
            searchSpinner.classList.remove('active');
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-wrapper')) searchSuggestions.classList.remove('active');
    });
}

async function displayWord(word) {
    const data = await getWordData(word);
    
    if (!data || data.t[0] === word) {
        dictionaryResult.innerHTML = `
            <div class="word-result" style="text-align:center;padding:40px;">
                <p style="font-size:24px;font-weight:600;margin-bottom:8px;">${word}</p>
                <p style="color:#c62828;">Слово не найдено в словаре</p>
                <p style="color:#8c8c8c;font-size:13px;margin-top:8px;">Попробуйте другое слово</p>
            </div>
        `;
        return;
    }
    
    dictionaryResult.innerHTML = `
        <div class="word-result">
            <div class="word-header">
                <span class="word-title">${word}</span>
                ${data.p ? `<span class="word-phonetic">${data.p}</span>` : ''}
                ${data.pos ? `<span style="color:#8c8c8c;font-size:12px;">${data.pos}</span>` : ''}
            </div>
            <div class="word-translations">
                ${data.t.map(t => `<span class="word-tag">${t}</span>`).join('')}
            </div>
            ${data.ex.length > 0 ? `
                <div class="word-examples">
                    <h4>Примеры</h4>
                    ${data.ex.map(e => `
                        <div class="word-example">
                            <div class="word-example-en">${e.en}</div>
                            <div class="word-example-ru">${e.ru}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    userData.wordsLearned = (userData.wordsLearned || 0) + 1;
    if (userData.wordsLearned % 10 === 0) addScore(2);
    if (userData.wordsLearned % 50 === 0) addScore(4);
    if (userData.wordsLearned % 100 === 0) addScore(8);
    
    const newAchs = checkAchievements(userData);
    newAchs.forEach(a => {
        if (!userData.achievements.includes(a)) userData.achievements.push(a);
    });
    saveUserData();
    updateLevelDisplay();
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
        error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        achievement: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
        levelup: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
    };
    
    toast.innerHTML = `${icons[type] || icons.success} ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateLevelDisplay() {
    const level = levelSystem.getLevel(userData.score || 0);
    const badge = document.getElementById('levelBadge');
    badge.textContent = level.name;
    badge.style.background = level.color;
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}
