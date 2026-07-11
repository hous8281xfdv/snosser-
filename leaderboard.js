function initLeaderboard() {
    const container = document.getElementById('leaderboardContent');
    if (!container) return;
    
    const users = getAllUsers().sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20);
    
    container.innerHTML = `
        <h2 style="font-size:20px;font-weight:600;margin-bottom:16px;color:var(--text);">Топ пользователей</h2>
        <div style="display:flex;flex-direction:column;gap:8px;">
            ${users.map((u, i) => `
                <div class="leaderboard-row" data-user="${u.username}" style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border);border-radius:12px;cursor:pointer;transition:all 0.2s;">
                    <span style="font-weight:700;font-size:18px;width:30px;color:${i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--text-secondary)'};">#${i + 1}</span>
                    <div>
                        <span style="font-weight:500;">${u.username}</span>
                        <span style="color:var(--text-secondary);font-size:12px;margin-left:4px;">Уровень ${levelSystem.getLevel(u.score || 0).name}</span>
                    </div>
                    <span style="margin-left:auto;font-weight:600;">${u.score || 0} очков</span>
                </div>
            `).join('')}
        </div>
    `;
    
    container.querySelectorAll('.leaderboard-row').forEach(row => {
        row.addEventListener('mouseenter', function() { this.style.borderColor = 'var(--border-dark)'; });
        row.addEventListener('mouseleave', function() { this.style.borderColor = 'var(--border)'; });
        row.addEventListener('click', function() {
            const username = this.dataset.user;
            showUserProfile(username);
        });
    });
}

function showUserProfile(username) {
    const stored = localStorage.getItem('user_' + username);
    if (!stored) return;
    const user = JSON.parse(stored);
    const level = levelSystem.getLevel(user.score || 0);
    
    const existing = document.getElementById('userProfilePopup');
    if (existing) existing.remove();
    
    const popup = document.createElement('div');
    popup.id = 'userProfilePopup';
    popup.className = 'profile-screen';
    popup.innerHTML = `
        <div class="profile-card" style="max-width:400px;">
            <button id="closeUserProfile" class="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div class="profile-header">
                <h2>${user.username}</h2>
                <p>${level.name} - ${level.nameFull}</p>
                <p style="font-size:32px;font-weight:700;">${user.score || 0}</p>
            </div>
            <div class="profile-stats">
                <div class="stat"><span>${user.wordsLearned || 0}</span><span>слов</span></div>
                <div class="stat"><span>${user.cardsCompleted || 0}</span><span>карточек</span></div>
                <div class="stat"><span>${user.testsCompleted || 0}</span><span>тестов</span></div>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById('closeUserProfile').addEventListener('click', () => popup.remove());
    popup.addEventListener('click', (e) => { if (e.target === popup) popup.remove(); });
}
