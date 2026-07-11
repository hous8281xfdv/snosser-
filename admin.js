const ADMIN_USERNAME = 'admin123';
const ADMIN_PASSWORD = 'banan12d';
let isAdmin = false;

function checkAdmin() {
    if (currentUser === ADMIN_USERNAME) {
        const stored = localStorage.getItem('user_' + ADMIN_USERNAME);
        if (stored && JSON.parse(stored).password === ADMIN_PASSWORD) {
            isAdmin = true;
            return true;
        }
    }
    return false;
}

function initAdminPanel() {
    const existingPanel = document.getElementById('adminPanelScreen');
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'adminPanelScreen';
    panel.className = 'profile-screen';
    panel.style.display = 'flex';
    panel.innerHTML = `
        <div class="profile-card" style="max-width:700px;">
            <button id="closeAdminPanel" class="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 style="font-size:22px;font-weight:600;margin-bottom:20px;">Админ-панель</h2>
            <div class="admin-stats" style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
                <div class="stat"><span id="adminTotalUsers">0</span><span>пользователей</span></div>
                <div class="stat"><span id="adminActiveToday">0</span><span>сегодня</span></div>
                <div class="stat"><span id="adminTotalWords">0</span><span>слов изучено</span></div>
            </div>
            <div style="margin-bottom:20px;">
                <h3 style="font-size:14px;font-weight:600;text-transform:uppercase;color:#8c8c8c;margin-bottom:8px;">Отправить уведомление</h3>
                <select id="adminNotifyTarget" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-family:inherit;margin-bottom:8px;background:var(--bg-card);color:var(--text);">
                    <option value="all">Всем пользователям</option>
                </select>
                <input type="text" id="adminNotifyTitle" placeholder="Заголовок уведомления" class="auth-input" style="margin-bottom:8px;">
                <textarea id="adminNotifyMessage" placeholder="Текст уведомления" class="auth-input" style="min-height:80px;resize:vertical;"></textarea>
                <button id="adminSendNotify" class="next-btn">Отправить</button>
            </div>
            <div style="margin-bottom:20px;">
                <h3 style="font-size:14px;font-weight:600;text-transform:uppercase;color:#8c8c8c;margin-bottom:8px;">Пользователи</h3>
                <div id="adminUsersList" style="max-height:300px;overflow-y:auto;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    
    document.getElementById('closeAdminPanel').addEventListener('click', () => panel.remove());
    document.getElementById('adminSendNotify').addEventListener('click', sendAdminNotification);
    
    loadAdminStats();
    loadAdminUsers();
}

function loadAdminStats() {
    const users = getAllUsers();
    document.getElementById('adminTotalUsers').textContent = users.length;
    const today = new Date().toDateString();
    const activeToday = users.filter(u => u.lastActivityDate === today).length;
    document.getElementById('adminActiveToday').textContent = activeToday;
    const totalWords = users.reduce((sum, u) => sum + (u.wordsLearned || 0), 0);
    document.getElementById('adminTotalWords').textContent = totalWords;
    
    const targetSelect = document.getElementById('adminNotifyTarget');
    users.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.username;
        opt.textContent = u.username;
        targetSelect.appendChild(opt);
    });
}

function loadAdminUsers() {
    const users = getAllUsers();
    const container = document.getElementById('adminUsersList');
    container.innerHTML = users.map(u => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;">
            <div>
                <span style="font-weight:500;">${u.username}</span>
                <span style="color:var(--text-secondary);font-size:12px;margin-left:8px;">Очки: ${u.score || 0}</span>
                <span style="color:var(--text-secondary);font-size:12px;margin-left:4px;">Слов: ${u.wordsLearned || 0}</span>
            </div>
            <div style="display:flex;gap:6px;">
                <button class="admin-block-btn" data-user="${u.username}" style="padding:4px 10px;border:1px solid #c62828;border-radius:6px;background:none;color:#c62828;cursor:pointer;font-family:inherit;font-size:12px;">${u.blocked ? 'Разблокировать' : 'Блокировать'}</button>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.admin-block-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const username = this.dataset.user;
            const stored = localStorage.getItem('user_' + username);
            if (stored) {
                const user = JSON.parse(stored);
                user.blocked = !user.blocked;
                localStorage.setItem('user_' + username, JSON.stringify(user));
                loadAdminUsers();
                showToast(user.blocked ? `${username} заблокирован` : `${username} разблокирован`, 'error');
            }
        });
    });
}

function sendAdminNotification() {
    const target = document.getElementById('adminNotifyTarget').value;
    const title = document.getElementById('adminNotifyTitle').value.trim();
    const message = document.getElementById('adminNotifyMessage').value.trim();
    if (!title || !message) { showToast('Заполните заголовок и текст', 'error'); return; }
    
    const notification = { title, message, date: new Date().toISOString(), from: 'Lingua', verified: true };
    
    if (target === 'all') {
        const users = getAllUsers();
        users.forEach(u => {
            u.notifications = u.notifications || [];
            u.notifications.unshift(notification);
            if (u.notifications.length > 50) u.notifications = u.notifications.slice(0, 50);
            u.unreadNotifications = (u.unreadNotifications || 0) + 1;
            localStorage.setItem('user_' + u.username, JSON.stringify(u));
        });
    } else {
        const stored = localStorage.getItem('user_' + target);
        if (stored) {
            const user = JSON.parse(stored);
            user.notifications = user.notifications || [];
            user.notifications.unshift(notification);
            if (user.notifications.length > 50) user.notifications = user.notifications.slice(0, 50);
            user.unreadNotifications = (user.unreadNotifications || 0) + 1;
            localStorage.setItem('user_' + target, JSON.stringify(user));
        }
    }
    
    document.getElementById('adminNotifyTitle').value = '';
    document.getElementById('adminNotifyMessage').value = '';
    showToast('Уведомление отправлено', 'success');
    if (currentUser === target || target === 'all') {
        userData.notifications = userData.notifications || [];
        userData.notifications.unshift(notification);
        userData.unreadNotifications = (userData.unreadNotifications || 0) + 1;
        saveUserData();
        updateNotificationBadge();
    }
}

function getAllUsers() {
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user_')) {
            try {
                const user = JSON.parse(localStorage.getItem(key));
                if (user.username) users.push(user);
            } catch(e) {}
        }
    }
    return users;
}
