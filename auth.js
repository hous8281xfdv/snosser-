let currentUser = null;
let userData = {};

const authScreen = document.getElementById('authScreen');
const goalScreen = document.getElementById('goalScreen');
const mainApp = document.getElementById('mainApp');
const profileScreen = document.getElementById('profileScreen');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

document.getElementById('showRegister').addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.getElementById('loginError').textContent = '';
});
document.getElementById('showLogin').addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    document.getElementById('registerError').textContent = '';
});

document.getElementById('registerBtn').addEventListener('click', () => {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;
    const errorEl = document.getElementById('registerError');
    if (!username || !password) { errorEl.textContent = 'Заполните все поля'; return; }
    if (username.length < 3) { errorEl.textContent = 'Имя должно быть от 3 символов'; return; }
    if (password.length < 4) { errorEl.textContent = 'Пароль должен быть от 4 символов'; return; }
    if (password !== confirm) { errorEl.textContent = 'Пароли не совпадают'; return; }
    if (localStorage.getItem('user_' + username)) { errorEl.textContent = 'Пользователь уже существует'; return; }

    const newUser = {
        username, password, goal: null, score: 0, wordsLearned: 0,
        cardsCompleted: 0, testsCompleted: 0, perfectTests: 0, grammarCompleted: 0,
        achievements: [], mistakes: [], notifications: [], unreadNotifications: 0,
        streak: 0, lastActivityDate: new Date().toDateString(), createdAt: new Date().toISOString(), blocked: false
    };
    localStorage.setItem('user_' + username, JSON.stringify(newUser));
    currentUser = username; userData = newUser;
    localStorage.setItem('currentUser', username);
    showGoalScreen();
});

document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    if (!username || !password) { errorEl.textContent = 'Заполните все поля'; return; }
    const stored = localStorage.getItem('user_' + username);
    if (!stored) { errorEl.textContent = 'Пользователь не найден'; return; }
    const user = JSON.parse(stored);
    if (user.password !== password) { errorEl.textContent = 'Неверный пароль'; return; }
    if (user.blocked) {
        errorEl.textContent = 'Ваш аккаунт заблокирован';
        return;
    }
    currentUser = username; userData = user;
    const today = new Date().toDateString();
    if (userData.lastActivityDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (userData.lastActivityDate === yesterday) userData.streak = (userData.streak || 0) + 1;
        else userData.streak = 1;
        userData.lastActivityDate = today;
        saveUserData();
    }
    localStorage.setItem('currentUser', username);
    if (!userData.goal) showGoalScreen();
    else showMainApp();
});

function showGoalScreen() {
    authScreen.style.display = 'none';
    goalScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    profileScreen.style.display = 'none';
}

function showMainApp() {
    authScreen.style.display = 'none';
    goalScreen.style.display = 'none';
    mainApp.style.display = 'block';
    profileScreen.style.display = 'none';
    document.getElementById('profileName').textContent = currentUser;
    updateLevelDisplay();
    initNavigation();
    initNotifications();
    if (checkAdmin()) {
        const existing = document.querySelector('.admin-panel-btn');
        if (!existing) {
            const adminBtn = document.createElement('button');
            adminBtn.className = 'admin-panel-btn';
            adminBtn.textContent = 'Админ';
            adminBtn.style.cssText = 'padding:8px 14px;background:#c62828;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:500;margin-left:8px;';
            adminBtn.addEventListener('click', initAdminPanel);
            document.querySelector('.header').appendChild(adminBtn);
        }
    }
}

function saveUserData() {
    if (!currentUser) return;
    localStorage.setItem('user_' + currentUser, JSON.stringify(userData));
    localStorage.setItem('currentUser', currentUser);
}

function addScore(points) {
    if (points <= 0) return;
    const currentLevel = levelSystem.getLevel(userData.score);
    if (currentLevel.name === 'A1') points = Math.min(points, 2);
    else if (currentLevel.name === 'A2') points = Math.min(points, 4);
    else if (currentLevel.name === 'B1') points = Math.min(points, 6);
    else if (currentLevel.name === 'B2') points = Math.min(points, 8);
    else if (currentLevel.name === 'C1') points = Math.min(points, 10);
    if (userData.score >= 2500 && currentLevel.name === 'C2') points = Math.round(points * 0.4);
    userData.score = Math.min(10000, userData.score + points);
    const newLevel = levelSystem.getLevel(userData.score);
    if (newLevel.name !== currentLevel.name) {
        showToast(`Повышение уровня! ${currentLevel.name} → ${newLevel.name}`, 'levelup');
        const badge = document.getElementById('levelBadge');
        if (badge) { badge.classList.add('pulse'); setTimeout(() => badge.classList.remove('pulse'), 600); }
    }
    const newAchs = checkAchievements(userData);
    newAchs.forEach(a => { if (!userData.achievements.includes(a)) { userData.achievements.push(a); const achData = achievementsList.find(ac => ac.id === a); if (achData) showToast(`Достижение: ${achData.name}`, 'achievement'); } });
    saveUserData();
    updateLevelDisplay();
}

function addMistake(word, correct) {
    userData.mistakes.push({ word, correct, date: new Date().toISOString() });
    const currentLevel = levelSystem.getLevel(userData.score);
    let penalty = 2;
    if (currentLevel.name === 'C1' || currentLevel.name === 'C2') penalty = 6;
    else if (currentLevel.name === 'B2') penalty = 4;
    else if (currentLevel.name === 'B1') penalty = 3;
    userData.score = Math.max(0, userData.score - penalty);
    saveUserData();
    updateLevelDisplay();
}

function updateLevelDisplay() {
    const level = levelSystem.getLevel(userData.score || 0);
    const badge = document.getElementById('levelBadge');
    if (badge) { badge.textContent = level.name; badge.style.background = level.color; }
}

document.querySelectorAll('.goal-btn').forEach(btn => {
    btn.addEventListener('click', function() { userData.goal = this.dataset.goal; saveUserData(); showMainApp(); });
});

window.addEventListener('load', () => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
        const stored = localStorage.getItem('user_' + saved);
        if (stored) {
            currentUser = saved; userData = JSON.parse(stored);
            if (userData.blocked) {
                authScreen.style.display = 'flex'; goalScreen.style.display = 'none'; mainApp.style.display = 'none';
                document.getElementById('loginError').textContent = 'Ваш аккаунт заблокирован';
                currentUser = null; userData = {}; localStorage.removeItem('currentUser');
                return;
            }
            if (!userData.goal) showGoalScreen();
            else showMainApp();
            return;
        }
    }
    authScreen.style.display = 'flex'; goalScreen.style.display = 'none'; mainApp.style.display = 'none'; profileScreen.style.display = 'none';
});
