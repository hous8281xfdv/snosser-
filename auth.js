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
});
document.getElementById('showLogin').addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

document.getElementById('registerBtn').addEventListener('click', () => {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;
    const errorEl = document.getElementById('registerError');

    if (!username || !password) {
        errorEl.textContent = 'Заполните все поля';
        return;
    }
    if (password !== confirm) {
        errorEl.textContent = 'Пароли не совпадают';
        return;
    }
    if (localStorage.getItem('user_' + username)) {
        errorEl.textContent = 'Пользователь уже существует';
        return;
    }

    const newUser = {
        username,
        password,
        goal: null,
        score: 0,
        wordsLearned: 0,
        cardsCompleted: 0,
        testsCompleted: 0,
        perfectTests: 0,
        grammarCompleted: 0,
        achievements: [],
        mistakes: [],
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('user_' + username, JSON.stringify(newUser));
    currentUser = username;
    userData = newUser;
    localStorage.setItem('currentUser', username);
    showGoalScreen();
});

document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    const stored = localStorage.getItem('user_' + username);
    if (!stored) {
        errorEl.textContent = 'Пользователь не найден';
        return;
    }
    const user = JSON.parse(stored);
    if (user.password !== password) {
        errorEl.textContent = 'Неверный пароль';
        return;
    }

    currentUser = username;
    userData = user;
    localStorage.setItem('currentUser', username);
    if (!userData.goal) {
        showGoalScreen();
    } else {
        showMainApp();
    }
});

function showGoalScreen() {
    authScreen.style.display = 'none';
    goalScreen.style.display = 'flex';
    mainApp.style.display = 'none';
}

function showMainApp() {
    authScreen.style.display = 'none';
    goalScreen.style.display = 'none';
    mainApp.style.display = 'block';
    profileScreen.style.display = 'none';
    document.getElementById('profileName').textContent = currentUser;
    updateLevelDisplay();
    initNavigation();
}

function saveUserData() {
    if (!currentUser) return;
    localStorage.setItem('user_' + currentUser, JSON.stringify(userData));
    localStorage.setItem('currentUser', currentUser);
}

function addScore(points) {
    if (points <= 0) return;
    userData.score = Math.min(100, userData.score + points);
    const newAchs = checkAchievements(userData);
    newAchs.forEach(a => userData.achievements.push(a));
    saveUserData();
    updateLevelDisplay();
}

function addMistake(word, correct) {
    userData.mistakes.push({ word, correct, date: new Date().toISOString() });
    userData.score = Math.max(0, userData.score - 2);
    saveUserData();
    updateLevelDisplay();
}

function updateLevelDisplay() {
    const level = levelSystem.getLevel(userData.score);
    document.getElementById('levelBadge').textContent = level.name;
    document.getElementById('levelBadge').style.background = level.color;
}

document.querySelectorAll('.goal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        userData.goal = this.dataset.goal;
        saveUserData();
        showMainApp();
    });
});

window.addEventListener('load', () => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
        const stored = localStorage.getItem('user_' + saved);
        if (stored) {
            currentUser = saved;
            userData = JSON.parse(stored);
            if (!userData.goal) {
                showGoalScreen();
            } else {
                showMainApp();
            }
            return;
        }
    }
    authScreen.style.display = 'flex';
    goalScreen.style.display = 'none';
    mainApp.style.display = 'none';
});
