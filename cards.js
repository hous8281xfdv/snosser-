function initCards() {
    const container = document.getElementById('cardsContent');
    if (!container) return;
    
    container.innerHTML = `
        <h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">Карточки для запоминания</h2>
        <div class="progress-bar"><div class="progress-fill" id="cardsProgressFill" style="width:0%"></div></div>
        <div class="flashcard-container">
            <div class="flashcard" id="flashcardEl">
                <div class="flashcard-front" id="flashcardFront"></div>
                <div class="flashcard-back" id="flashcardBack"></div>
            </div>
            <p class="flip-hint" id="flipHint" style="text-align:center;color:var(--text-placeholder);font-size:12px;margin-top:12px;">Нажмите чтобы перевернуть</p>
        </div>
        <div class="diff-buttons" id="diffButtons" style="display:none;">
            <button class="diff-btn again" data-diff="0">Сложно</button>
            <button class="diff-btn hard" data-diff="1">Нормально</button>
            <button class="diff-btn good" data-diff="2">Легко</button>
        </div>
        <button id="quitCards" style="width:100%;padding:10px;background:none;border:1px solid var(--border);border-radius:10px;font-family:inherit;cursor:pointer;margin-top:12px;color:var(--text);">Завершить</button>
    `;

    let cardsWords = [...allWords].filter(w => w.length >= 3 && w.length <= 15);
    let cardIndex = 0;
    let flipped = false;
    let currentTranslation = '';

    function shuffle(a) { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
    shuffle(cardsWords);
    cardsWords = cardsWords.slice(0, 50);

    const flashcard = document.getElementById('flashcardEl');
    const front = document.getElementById('flashcardFront');
    const back = document.getElementById('flashcardBack');
    const hint = document.getElementById('flipHint');
    const diffs = document.getElementById('diffButtons');
    const fill = document.getElementById('cardsProgressFill');

    function showCard() {
        if (cardIndex >= cardsWords.length) {
            container.innerHTML = `<div style="text-align:center;padding:40px;"><h2 style="color:var(--text);">Отлично!</h2><p style="color:var(--text-secondary);">Вы прошли все карточки</p><button id="cardsRestart" class="next-btn" style="margin-top:16px;">Начать заново</button></div>`;
            document.getElementById('cardsRestart').addEventListener('click', initCards);
            return;
        }
        flipped = false;
        currentTranslation = '';
        flashcard.classList.remove('flipped');
        front.style.display = 'flex';
        back.style.display = 'none';
        hint.style.display = 'block';
        diffs.style.display = 'none';
        const word = cardsWords[cardIndex];
        front.innerHTML = `<span>${word}</span>`;
        back.innerHTML = `<span>${word}</span>`;
        fill.style.width = ((cardIndex / cardsWords.length) * 100) + '%';
        
        fetchWordTranslation(word).then(data => {
            if (data && data.t.length > 0) {
                currentTranslation = data.t[0];
            } else {
                currentTranslation = word;
            }
        });
    }

    flashcard.addEventListener('click', () => {
        if (flipped) return;
        flipped = true;
        flashcard.classList.add('flipped');
        front.style.display = 'none';
        back.style.display = 'flex';
        hint.style.display = 'none';
        back.innerHTML = `<span>${currentTranslation || cardsWords[cardIndex]}</span>`;
        diffs.style.display = 'flex';
    });

    document.getElementById('diffButtons').addEventListener('click', (e) => {
        if (!e.target.classList.contains('diff-btn')) return;
        const diff = parseInt(e.target.dataset.diff);
        let points = 0;
        if (diff === 2) points = 2;
        else if (diff === 1) points = 1;
        if (points > 0) addScore(points);
        userData.cardsCompleted++;
        saveUserData();
        updateLevelDisplay();
        cardIndex++;
        showCard();
    });

    document.getElementById('quitCards').addEventListener('click', () => {
        container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">Сессия завершена. Возвращайтесь!</p>';
    });

    showCard();
}
