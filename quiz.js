function initQuiz() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    const level = levelSystem.getLevel(userData.score);
    let quizWords = [...allWords].filter(w => w.length >= 3 && w.length <= 15);
    
    function shuffle(a) { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
    shuffle(quizWords);
    
    const count = level.minScore < 100 ? 10 : level.minScore < 300 ? 15 : level.minScore < 700 ? 20 : 30;
    quizWords = quizWords.slice(0, count);
    
    let currentQ = 0;
    let score = 0;
    let answered = false;
    let questionCache = {};

    async function prepareQuestions() {
        container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">Подготовка вопросов...</p>';
        
        const promises = quizWords.map(async (word) => {
            if (!questionCache[word]) {
                const data = await fetchFromYandex(word);
                questionCache[word] = data && data.t.length > 0 ? data.t[0] : word;
            }
        });
        
        await Promise.all(promises);
        renderStart();
    }

    function renderStart() {
        container.innerHTML = `
            <h2 style="font-size:20px;font-weight:600;margin-bottom:12px;color:var(--text);">Тест на перевод</h2>
            <p style="color:var(--text-secondary);margin-bottom:20px;">${quizWords.length} вопросов</p>
            <button id="startQuiz" class="next-btn">Начать тест</button>
        `;
        document.getElementById('startQuiz').addEventListener('click', () => {
            currentQ = 0; score = 0;
            renderQuestion();
        });
    }

    function renderQuestion() {
        if (currentQ >= quizWords.length) {
            const pct = Math.round((score / quizWords.length) * 100);
            container.innerHTML = `
                <div style="text-align:center;">
                    <h2 style="color:var(--text);">Результат</h2>
                    <p style="font-size:40px;font-weight:700;color:var(--text);">${score}/${quizWords.length}</p>
                    <p style="color:var(--text-secondary);">${pct}%</p>
                    <button id="quizRetry" class="next-btn" style="margin-top:16px;">Пройти заново</button>
                </div>
            `;
            document.getElementById('quizRetry').addEventListener('click', () => prepareQuestions());
            userData.testsCompleted++;
            if (pct === 100) userData.perfectTests++;
            
            let earnedPoints = 0;
            if (pct >= 90) earnedPoints = Math.round(pct / 10) * 2;
            else if (pct >= 70) earnedPoints = Math.round(pct / 10);
            else if (pct >= 50) earnedPoints = Math.round(pct / 20);
            else earnedPoints = 0;
            
            addScore(earnedPoints);
            return;
        }
        
        answered = false;
        const word = quizWords[currentQ];
        const correct = questionCache[word] || word;
        
        const options = new Set([correct]);
        const otherWords = allWords.filter(w => w !== word && questionCache[w] && questionCache[w] !== correct);
        shuffle(otherWords);
        
        for (const w of otherWords) {
            if (options.size >= 4) break;
            options.add(questionCache[w]);
        }
        
        while (options.size < 4) {
            options.add(`вариант ${options.size + 1}`);
        }
        
        const optsArr = [...options];
        shuffle(optsArr);

        container.innerHTML = `
            <div class="progress-bar"><div class="progress-fill" style="width:${(currentQ/quizWords.length)*100}%"></div></div>
            <p style="font-size:18px;font-weight:500;margin-bottom:16px;color:var(--text);">Как переводится "<b>${word}</b>"?</p>
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

    prepareQuestions();
}
