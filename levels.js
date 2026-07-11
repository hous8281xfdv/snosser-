const levelSystem = {
    levels: [
        { name: 'A1', nameFull: 'Beginner', minScore: 0, maxScore: 100, color: '#2e7d32', unlocks: ['dictionary', 'cards_easy', 'quiz_easy'] },
        { name: 'A2', nameFull: 'Elementary', minScore: 100, maxScore: 300, color: '#4caf50', unlocks: ['dictionary', 'cards_easy', 'cards_medium', 'quiz_easy', 'quiz_medium', 'grammar_easy'] },
        { name: 'B1', nameFull: 'Intermediate', minScore: 300, maxScore: 700, color: '#e65100', unlocks: ['dictionary', 'cards_easy', 'cards_medium', 'cards_hard', 'quiz_easy', 'quiz_medium', 'quiz_hard', 'grammar_easy', 'grammar_medium'] },
        { name: 'B2', nameFull: 'Upper Intermediate', minScore: 700, maxScore: 1400, color: '#ff9800', unlocks: ['all'] },
        { name: 'C1', nameFull: 'Advanced', minScore: 1400, maxScore: 2500, color: '#c62828', unlocks: ['all'] },
        { name: 'C2', nameFull: 'Proficient', minScore: 2500, maxScore: 10000, color: '#1a1a1a', unlocks: ['all'] }
    ],
    getLevel(score) {
        for (let level of this.levels) {
            if (score >= level.minScore && score <= level.maxScore) return level;
        }
        return this.levels[0];
    },
    isUnlocked(levelName, feature) {
        const level = this.levels.find(l => l.name === levelName);
        if (!level) return false;
        if (level.unlocks.includes('all')) return true;
        return level.unlocks.includes(feature);
    }
};

const achievementsList = [
    { id: 'first_word', name: 'Первое слово', desc: 'Выучить первое слово', icon: 'book' },
    { id: 'ten_words', name: '10 слов', desc: 'Выучить 10 слов', icon: 'book' },
    { id: 'fifty_words', name: '50 слов', desc: 'Выучить 50 слов', icon: 'award' },
    { id: 'hundred_words', name: '100 слов', desc: 'Выучить 100 слов', icon: 'star' },
    { id: 'five_hundred_words', name: '500 слов', desc: 'Выучить 500 слов', icon: 'star' },
    { id: 'thousand_words', name: '1000 слов', desc: 'Выучить 1000 слов', icon: 'trophy' },
    { id: 'first_test', name: 'Первый тест', desc: 'Пройти первый тест', icon: 'check' },
    { id: 'perfect_test', name: 'Идеальный тест', desc: 'Набрать 100% в тесте', icon: 'trophy' },
    { id: 'ten_tests', name: '10 тестов', desc: 'Пройти 10 тестов', icon: 'target' },
    { id: 'fifty_tests', name: '50 тестов', desc: 'Пройти 50 тестов', icon: 'target' },
    { id: 'first_card', name: 'Карточки', desc: 'Пройти 10 карточек', icon: 'layers' },
    { id: 'hundred_cards', name: '100 карточек', desc: 'Пройти 100 карточек', icon: 'layers' },
    { id: 'grammar_master', name: 'Грамматика', desc: 'Пройти 20 упражнений', icon: 'hash' },
    { id: 'grammar_expert', name: 'Эксперт', desc: 'Пройти 100 упражнений', icon: 'hash' },
    { id: 'level_a2', name: 'Уровень A2', desc: 'Достичь уровня A2', icon: 'trending-up' },
    { id: 'level_b1', name: 'Уровень B1', desc: 'Достичь уровня B1', icon: 'zap' },
    { id: 'level_b2', name: 'Уровень B2', desc: 'Достичь уровня B2', icon: 'zap' },
    { id: 'level_c1', name: 'Уровень C1', desc: 'Достичь уровня C1', icon: 'crown' },
    { id: 'level_c2', name: 'Уровень C2', desc: 'Достичь уровня C2', icon: 'crown' },
    { id: 'no_mistakes_10', name: 'Без ошибок 10', desc: '10 тестов без единой ошибки', icon: 'shield' },
    { id: 'streak_7', name: '7 дней', desc: 'Заниматься 7 дней подряд', icon: 'calendar' },
    { id: 'streak_30', name: '30 дней', desc: 'Заниматься 30 дней подряд', icon: 'calendar' }
];

function checkAchievements(userData) {
    const newAchievements = [];
    const a = userData.achievements;
    if (userData.wordsLearned >= 1 && !a.includes('first_word')) newAchievements.push('first_word');
    if (userData.wordsLearned >= 10 && !a.includes('ten_words')) newAchievements.push('ten_words');
    if (userData.wordsLearned >= 50 && !a.includes('fifty_words')) newAchievements.push('fifty_words');
    if (userData.wordsLearned >= 100 && !a.includes('hundred_words')) newAchievements.push('hundred_words');
    if (userData.wordsLearned >= 500 && !a.includes('five_hundred_words')) newAchievements.push('five_hundred_words');
    if (userData.wordsLearned >= 1000 && !a.includes('thousand_words')) newAchievements.push('thousand_words');
    if (userData.testsCompleted >= 1 && !a.includes('first_test')) newAchievements.push('first_test');
    if (userData.perfectTests >= 1 && !a.includes('perfect_test')) newAchievements.push('perfect_test');
    if (userData.testsCompleted >= 10 && !a.includes('ten_tests')) newAchievements.push('ten_tests');
    if (userData.testsCompleted >= 50 && !a.includes('fifty_tests')) newAchievements.push('fifty_tests');
    if (userData.cardsCompleted >= 10 && !a.includes('first_card')) newAchievements.push('first_card');
    if (userData.cardsCompleted >= 100 && !a.includes('hundred_cards')) newAchievements.push('hundred_cards');
    if (userData.grammarCompleted >= 20 && !a.includes('grammar_master')) newAchievements.push('grammar_master');
    if (userData.grammarCompleted >= 100 && !a.includes('grammar_expert')) newAchievements.push('grammar_expert');
    const level = levelSystem.getLevel(userData.score);
    if (level.name === 'A2' && !a.includes('level_a2')) newAchievements.push('level_a2');
    if (level.name === 'B1' && !a.includes('level_b1')) newAchievements.push('level_b1');
    if (level.name === 'B2' && !a.includes('level_b2')) newAchievements.push('level_b2');
    if (level.name === 'C1' && !a.includes('level_c1')) newAchievements.push('level_c1');
    if (level.name === 'C2' && !a.includes('level_c2')) newAchievements.push('level_c2');
    return newAchievements;
}
