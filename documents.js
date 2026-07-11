function showDocument(type) {
    const existing = document.getElementById('documentPopup');
    if (existing) existing.remove();
    
    const docs = {
        terms: { title: 'Условия использования', text: 'Настоящие условия регулируют использование сайта Lingua. Используя сайт, вы соглашаетесь с данными условиями. Запрещается: взлом, спам, оскорбления. Администрация оставляет за собой право блокировать пользователей без объяснения причин.' },
        privacy: { title: 'Политика конфиденциальности', text: 'Мы не передаём ваши данные третьим лицам. Все данные хранятся локально в вашем браузере. Мы не используем трекеры и не собираем личную информацию.' },
        cookies: { title: 'Политика Cookies', text: 'Сайт использует localStorage для хранения данных пользователя. Это необходимо для работы словаря и сохранения прогресса. Никакие данные не отправляются на сервер.' },
        offer: { title: 'Публичная оферта', text: 'Сайт Lingua предоставляется бесплатно. Никакие платные услуги не оказываются. Все материалы предоставляются "как есть". Администрация не несёт ответственности за возможные ошибки в переводах.' }
    };
    
    const doc = docs[type];
    const popup = document.createElement('div');
    popup.id = 'documentPopup';
    popup.className = 'profile-screen';
    popup.innerHTML = `
        <div class="profile-card" style="max-width:500px;">
            <button id="closeDocument" class="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2>${doc.title}</h2>
            <p style="margin-top:16px;line-height:1.6;">${doc.text}</p>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById('closeDocument').addEventListener('click', () => popup.remove());
    popup.addEventListener('click', (e) => { if (e.target === popup) popup.remove(); });
}
