function initCards() {
    const container = document.getElementById('cardsContent');
    if (!container) return;
    
    container.innerHTML = `
        <h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">Карточки для запоминания</h2>
        <div id="cardsProgress" class="progress-bar"><div class="progress-fill" id="cardsProgressFill" style="width:0%"></div></div>
        <div class="flashcard" id="flashcardEl">
            <div id="flashcardFront" style="font-size:28px;"></div>
            <div id="flashcardBack" style="display:none;font-size:28px;"></div>
            <p style="color:#c4c0b8;font-size:12px;margin-top:12px;" id="flipHint">Нажмите чтобы перевернуть</p>
        </div>
        <div class="diff-buttons" id="diffButtons" style="display:none;">
            <button class="diff-btn again" data-diff="0">Сложно</button>
            <button class="diff-btn hard" data-diff="1">Нормально</button>
            <button class="diff-btn good" data-diff="2">Легко</button>
        </div>
        <button id="quitCards" style="width:100%;padding:10px;background:none;border:1px solid #e8e5e1;border-radius:10px;font-family:inherit;cursor:pointer;margin-top:12px;">Завершить</button>
    `;

    let cardsWords = [...allWords];
    let cardIndex = 0;
    let flipped = false;

    function shuffle(a) { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
    shuffle(cardsWords);

    const flashcard = document.getElementById('flashcardEl');
    const front = document.getElementById('flashcardFront');
    const back = document.getElementById('flashcardBack');
    const hint = document.getElementById('flipHint');
    const diffs = document.getElementById('diffButtons');
    const fill = document.getElementById('cardsProgressFill');

    function showCard() {
        if (cardIndex >= cardsWords.length) cardIndex = 0;
        flipped = false;
        flashcard.classList.remove('flipped');
        front.style.display = 'block';
        back.style.display = 'none';
        hint.style.display = 'block';
        diffs.style.display = 'none';
        const word = cardsWords[cardIndex];
        front.textContent = word;
        const data = fullDictionary[word];
        back.textContent = data ? data.t[0] : word;
        fill.style.width = ((cardIndex / cardsWords.length) * 100) + '%';
    }

    flashcard.addEventListener('click', () => {
        if (flipped) return;
        flipped = true;
        flashcard.classList.add('flipped');
        front.style.display = 'none';
        back.style.display = 'block';
        hint.style.display = 'none';
        diffs.style.display = 'flex';
    });

    document.getElementById('diffButtons').addEventListener('click', (e) => {
        if (!e.target.classList.contains('diff-btn')) return;
        const diff = parseInt(e.target.dataset.diff);
        if (diff === 2) {
            userData.score = Math.min(100, userData.score + 2);
        } else if (diff === 1) {
            userData.score = Math.min(100, userData.score + 1);
        }
        userData.cardsCompleted++;
        saveUserData();
        updateLevelDisplay();
        cardIndex++;
        showCard();
    });

    document.getElementById('quitCards').addEventListener('click', () => {
        container.innerHTML = '<p style="text-align:center;color:#8c8c8c;">Сессия завершена</p>';
    });

    showCard();
}
