function initQuiz() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    const level = levelSystem.getLevel(userData.score);
    let quizWords = allWords.slice(0, level.minScore < 20 ? 10 : level.minScore < 40 ? 20 : 30);
    let currentQ = 0;
    let score = 0;
    let answered = false;

    function renderStart() {
        container.innerHTML = `
            <h2 style="font-size:20px;font-weight:600;margin-bottom:12px;">Тест на перевод</h2>
            <p style="color:#8c8c8c;margin-bottom:20px;">${quizWords.length} вопросов</p>
            <button id="startQuiz" class="next-btn">Начать тест</button>
        `;
        document.getElementById('startQuiz').addEventListener('click', () => {
            currentQ = 0; score = 0;
            shuffleArray(quizWords);
            renderQuestion();
        });
    }

    function renderQuestion() {
        if (currentQ >= quizWords.length) {
            const pct = Math.round((score / quizWords.length) * 100);
            container.innerHTML = `
                <div style="text-align:center;">
                    <h2>Результат</h2>
                    <p style="font-size:40px;font-weight:700;">${score}/${quizWords.length}</p>
                    <p style="color:#8c8c8c;">${pct}%</p>
                    <button id="quizRetry" class="next-btn" style="margin-top:16px;">Пройти заново</button>
                </div>
            `;
            document.getElementById('quizRetry').addEventListener('click', renderStart);
            userData.testsCompleted++;
            if (pct === 100) userData.perfectTests++;
            addScore(Math.round(pct / 10) * 2);
            return;
        }
        answered = false;
        const word = quizWords[currentQ];
        const data = fullDictionary[word];
        if (!data) { currentQ++; renderQuestion(); return; }
        const correct = data.t[0];
        const options = new Set([correct]);
        while (options.size < 4) {
            const rw = allWords[Math.floor(Math.random() * allWords.length)];
            const rd = fullDictionary[rw];
            if (rd && rd.t[0] !== correct) options.add(rd.t[0]);
        }
        const optsArr = [...options];
        shuffleArray(optsArr);

        container.innerHTML = `
            <div class="progress-bar"><div class="progress-fill" style="width:${(currentQ/quizWords.length)*100}%"></div></div>
            <p style="font-size:18px;font-weight:500;margin-bottom:16px;">Как переводится "<b>${word}</b>"?</p>
            <div id="quizOptions"></div>
            <button id="quizNext" class="next-btn" disabled>Далее</button>
        `;
        const optsContainer = document.getElementById('quizOptions');
        optsArr.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectQuizAnswer(btn, opt, correct));
            optsContainer.appendChild(btn);
        });
    }

    function selectQuizAnswer(btn, selected, correct) {
        if (answered) return;
        answered = true;
        const all = document.querySelectorAll('#quizOptions .option-btn');
        all.forEach(o => o.disabled = true);
        all.forEach(o => { if (o.textContent === correct) o.classList.add('correct'); });
        if (selected === correct) { score++; btn.classList.add('selected'); }
        else { btn.classList.add('incorrect'); addMistake(quizWords[currentQ], correct); }
        document.getElementById('quizNext').disabled = false;
    }

    container.addEventListener('click', (e) => {
        if (e.target.id === 'quizNext') { currentQ++; renderQuestion(); }
    });

    function shuffleArray(a) { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} }

    renderStart();
}
