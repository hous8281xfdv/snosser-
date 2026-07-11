function initGrammar() {
    const container = document.getElementById('grammarContent');
    if (!container) return;

    const level = levelSystem.getLevel(userData.score);
    const exercises = [];

    if (levelSystem.isUnlocked(level.name, 'grammar_easy')) {
        exercises.push({
            title: 'Present Simple',
            q: [
                {s:"She ___ to school every day.",a:"goes",o:["go","goes","went","going"]},
                {s:"They ___ football.",a:"play",o:["play","plays","played","playing"]},
                {s:"He ___ coffee.",a:"likes",o:["like","likes","liked","liking"]},
                {s:"I ___ a student.",a:"am",o:["am","is","are","be"]},
                {s:"We ___ in Moscow.",a:"live",o:["live","lives","lived","living"]},
                {s:"The sun ___ in the east.",a:"rises",o:["rise","rises","rose","rising"]},
                {s:"Cats ___ milk.",a:"like",o:["like","likes","liked","liking"]},
                {s:"He ___ not understand.",a:"does",o:["do","does","is","are"]}
            ]
        });
    }

    if (levelSystem.isUnlocked(level.name, 'grammar_medium')) {
        exercises.push({
            title: 'Past Simple',
            q: [
                {s:"I ___ him yesterday.",a:"saw",o:["see","saw","seen","seeing"]},
                {s:"She ___ to Paris.",a:"went",o:["go","goes","went","gone"]},
                {s:"They ___ dinner.",a:"ate",o:["eat","eats","ate","eaten"]},
                {s:"He ___ a book.",a:"read",o:["read","reads","reading","red"]},
                {s:"We ___ happy.",a:"were",o:["was","were","been","are"]},
                {s:"She ___ a letter.",a:"wrote",o:["write","writes","wrote","written"]},
                {s:"They ___ home late.",a:"came",o:["come","comes","came","coming"]}
            ]
        });
    }

    if (levelSystem.isUnlocked(level.name, 'grammar_hard')) {
        exercises.push({
            title: 'Present Perfect',
            q: [
                {s:"I ___ my keys.",a:"have lost",o:["lost","have lost","loses","losing"]},
                {s:"She ___ to London.",a:"has been",o:["was","has been","went","goes"]},
                {s:"They ___ the movie.",a:"have seen",o:["saw","seen","have seen","seeing"]},
                {s:"He ___ his homework.",a:"has finished",o:["finished","has finished","finishes","finishing"]},
                {s:"We ___ here for 5 years.",a:"have lived",o:["lived","have lived","live","living"]}
            ]
        });
    }

    if (exercises.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">Достигните уровня A2 для доступа к грамматике</p>';
        return;
    }

    let currentEx = 0;
    let currentQ = 0;
    let score = 0;
    let answered = false;
    let exQuestions = [];

    function renderMenu() {
        container.innerHTML = '<h2 style="font-size:20px;font-weight:600;margin-bottom:16px;color:var(--text);">Грамматика</h2>' +
            exercises.map((ex, i) => `<button class="grammar-ex-btn" data-i="${i}" style="width:100%;text-align:left;padding:16px;border:1px solid var(--border);border-radius:12px;background:var(--bg-card);font-family:inherit;cursor:pointer;margin-bottom:8px;font-size:15px;transition:all 0.2s;color:var(--text);">${ex.title} (${ex.q.length} вопросов)</button>`).join('');
        container.querySelectorAll('.grammar-ex-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                currentEx = parseInt(this.dataset.i);
                currentQ = 0;
                score = 0;
                exQuestions = [...exercises[currentEx].q];
                shuffleArray(exQuestions);
                renderQuestion();
            });
            btn.addEventListener('mouseenter', function() { this.style.borderColor = 'var(--border-dark)'; });
            btn.addEventListener('mouseleave', function() { this.style.borderColor = 'var(--border)'; });
        });
    }

    function renderQuestion() {
        if (currentQ >= exQuestions.length) {
            const pct = Math.round((score / exQuestions.length) * 100);
            container.innerHTML = `<div style="text-align:center;"><h2 style="color:var(--text);">Результат</h2><p style="font-size:40px;font-weight:700;color:var(--text);">${score}/${exQuestions.length}</p><button id="grammarBack" class="next-btn" style="margin-top:16px;">Назад</button></div>`;
            document.getElementById('grammarBack').addEventListener('click', renderMenu);
            userData.grammarCompleted += exQuestions.length;
            
            let earnedPoints = 0;
            if (pct >= 90) earnedPoints = score * 2;
            else if (pct >= 70) earnedPoints = score;
            else if (pct >= 50) earnedPoints = Math.round(score * 0.5);
            else earnedPoints = 0;
            
            addScore(earnedPoints);
            return;
        }
        answered = false;
        const q = exQuestions[currentQ];
        container.innerHTML = `
            <div class="progress-bar"><div class="progress-fill" style="width:${(currentQ/exQuestions.length)*100}%"></div></div>
            <p style="font-size:16px;font-weight:500;margin-bottom:16px;color:var(--text);">${q.s.replace('___', '<span style="border-bottom:2px solid var(--text);padding:0 8px;">______</span>')}</p>
            <div id="grammarOptions"></div>
            <button id="grammarNext" class="next-btn" disabled>Далее</button>
        `;
        const optsContainer = document.getElementById('grammarOptions');
        q.o.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectGrammarAnswer(btn, opt, q));
            optsContainer.appendChild(btn);
        });
    }

    function selectGrammarAnswer(btn, selected, q) {
        if (answered) return;
        answered = true;
        const all = document.querySelectorAll('#grammarOptions .option-btn');
        all.forEach(o => o.disabled = true);
        all.forEach(o => { if (o.textContent === q.a) o.classList.add('correct'); });
        if (selected === q.a) { score++; btn.classList.add('selected'); }
        else { btn.classList.add('incorrect'); }
        document.getElementById('grammarNext').disabled = false;
    }

    container.addEventListener('click', (e) => {
        if (e.target.id === 'grammarNext') { currentQ++; renderQuestion(); }
    });

    function shuffleArray(a) { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} }

    renderMenu();
}
