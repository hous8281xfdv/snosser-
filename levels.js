const levelSystem = {
    levels: [
        { name: 'A1', nameFull: 'Beginner', minScore: 0, maxScore: 20, color: '#2e7d32', unlocks: ['dictionary', 'cards_easy', 'quiz_easy'] },
        { name: 'A2', nameFull: 'Elementary', minScore: 20, maxScore: 40, color: '#4caf50', unlocks: ['dictionary', 'cards_easy', 'cards_medium', 'quiz_easy', 'quiz_medium', 'grammar_easy'] },
        { name: 'B1', nameFull: 'Intermediate', minScore: 40, maxScore: 60, color: '#e65100', unlocks: ['dictionary', 'cards_easy', 'cards_medium', 'cards_hard', 'quiz_easy', 'quiz_medium', 'quiz_hard', 'grammar_easy', 'grammar_medium'] },
        { name: 'B2', nameFull: 'Upper Intermediate', minScore: 60, maxScore: 80, color: '#ff9800', unlocks: ['all'] },
        { name: 'C1', nameFull: 'Advanced', minScore: 80, maxScore: 95, color: '#c62828', unlocks: ['all'] },
        { name: 'C2', nameFull: 'Proficient', minScore: 95, maxScore: 100, color: '#1a1a1a', unlocks: ['all'] }
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
    { id: 'first_test', name: 'Первый тест', desc: 'Пройти первый тест', icon: 'check' },
    { id: 'perfect_test', name: 'Идеальный тест', desc: 'Набрать 100% в тесте', icon: 'trophy' },
    { id: 'ten_tests', name: '10 тестов', desc: 'Пройти 10 тестов', icon: 'target' },
    { id: 'first_card', name: 'Карточки', desc: 'Пройти 10 карточек', icon: 'layers' },
    { id: 'grammar_master', name: 'Грамматика', desc: 'Пройти 20 упражнений', icon: 'hash' },
    { id: 'level_up', name: 'Повышение', desc: 'Достичь уровня A2', icon: 'trending-up' },
    { id: 'b1_master', name: 'B1', desc: 'Достичь уровня B1', icon: 'zap' },
    { id: 'c1_master', name: 'C1', desc: 'Достичь уровня C1', icon: 'crown' }
];

function checkAchievements(userData) {
    const newAchievements = [];
    if (userData.wordsLearned >= 1 && !userData.achievements.includes('first_word')) newAchievements.push('first_word');
    if (userData.wordsLearned >= 10 && !userData.achievements.includes('ten_words')) newAchievements.push('ten_words');
    if (userData.wordsLearned >= 50 && !userData.achievements.includes('fifty_words')) newAchievements.push('fifty_words');
    if (userData.wordsLearned >= 100 && !userData.achievements.includes('hundred_words')) newAchievements.push('hundred_words');
    if (userData.testsCompleted >= 1 && !userData.achievements.includes('first_test')) newAchievements.push('first_test');
    if (userData.perfectTests >= 1 && !userData.achievements.includes('perfect_test')) newAchievements.push('perfect_test');
    if (userData.testsCompleted >= 10 && !userData.achievements.includes('ten_tests')) newAchievements.push('ten_tests');
    if (userData.cardsCompleted >= 10 && !userData.achievements.includes('first_card')) newAchievements.push('first_card');
    if (userData.grammarCompleted >= 20 && !userData.achievements.includes('grammar_master')) newAchievements.push('grammar_master');
    const level = levelSystem.getLevel(userData.score);
    if (level.name === 'A2' && !userData.achievements.includes('level_up')) newAchievements.push('level_up');
    if (level.name === 'B1' && !userData.achievements.includes('b1_master')) newAchievements.push('b1_master');
    if (level.name === 'C1' && !userData.achievements.includes('c1_master')) newAchievements.push('c1_master');
    return newAchievements;
}
