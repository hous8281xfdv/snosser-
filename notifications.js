function initNotifications() {
    const bell = document.getElementById('notificationBell');
    if (!bell) return;
    
    bell.addEventListener('click', showNotificationPanel);
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    const count = userData.unreadNotifications || 0;
    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function showNotificationPanel() {
    const existing = document.getElementById('notificationPanel');
    if (existing) { existing.remove(); return; }
    
    userData.unreadNotifications = 0;
    userData.notifications = userData.notifications || [];
    saveUserData();
    updateNotificationBadge();
    
    const panel = document.createElement('div');
    panel.id = 'notificationPanel';
    panel.style.cssText = 'position:fixed;top:80px;right:20px;width:360px;max-height:500px;overflow-y:auto;background:var(--bg-card);border:1px solid var(--border);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.12);z-index:150;padding:16px;';
    
    if (userData.notifications.length === 0) {
        panel.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:20px;">Нет уведомлений</p>';
    } else {
        panel.innerHTML = userData.notifications.map(n => `
            <div style="padding:12px;border-bottom:1px solid var(--border);margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <span style="font-weight:600;font-size:14px;">${n.from}</span>
                    ${n.verified ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="#2196F3" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>' : ''}
                    <span style="color:var(--text-muted);font-size:11px;margin-left:auto;">${new Date(n.date).toLocaleDateString()}</span>
                </div>
                <p style="font-weight:500;font-size:13px;margin-bottom:2px;">${n.title}</p>
                <p style="color:var(--text-secondary);font-size:12px;">${n.message}</p>
            </div>
        `).join('');
    }
    
    document.body.appendChild(panel);
    setTimeout(() => {
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target) && e.target !== document.getElementById('notificationBell')) {
                panel.remove();
                document.removeEventListener('click', closePanel);
            }
        });
    }, 100);
}
