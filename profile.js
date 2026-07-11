document.getElementById('profileBtn').addEventListener('click', () => {
    profileScreen.style.display = 'flex';
    document.getElementById('profileTitle').textContent = currentUser;
    const level = levelSystem.getLevel(userData.score);
    document.getElementById('profileLevel').textContent = `${level.name} - ${level.nameFull}`;
    const pct = userData.score;
    document.getElementById('scoreCircle').setAttribute('stroke-dashoffset', 283 - (283 * pct / 100));
    document.getElementById('scoreText').textContent = userData.score;
    document.getElementById('statWords').textContent = userData.wordsLearned;
    document.getElementById('statCards').textContent = userData.cardsCompleted;
    document.getElementById('statTests').textContent = userData.testsCompleted;
    
    const achContainer = document.getElementById('achievementsList');
    achContainer.innerHTML = achievementsList.map(a => {
        const earned = userData.achievements.includes(a.id);
        return `<div class="achievement-badge${earned ? '' : ' locked'}">${earned ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'} ${a.name}</div>`;
    }).join('');
    
    const mistContainer = document.getElementById('mistakesList');
    if (userData.mistakes.length === 0) {
        mistContainer.innerHTML = '<p style="color:#8c8c8c;font-size:13px;">Ошибок пока нет</p>';
    } else {
        mistContainer.innerHTML = userData.mistakes.slice(-10).reverse().map(m => `<div class="mistake-item">${m.word} → ${m.correct}</div>`).join('');
    }
});

document.getElementById('closeProfile').addEventListener('click', () => { profileScreen.style.display = 'none'; });
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    currentUser = null; userData = {};
    profileScreen.style.display = 'none'; mainApp.style.display = 'none'; goalScreen.style.display = 'none';
    authScreen.style.display = 'flex';
    document.getElementById('loginUsername').value = ''; document.getElementById('loginPassword').value = '';
});
