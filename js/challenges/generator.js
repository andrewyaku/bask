// Модуль для генерации и работы с челленджами для BasketGuide

// Типы челленджей
const CHALLENGE_TYPES = {
    SKILL: 'skill',
    PHYSICS: 'physics',
    RULES: 'rules',
    AGILITY: 'agility',
    ENDURANCE: 'endurance'
};

// Уровни сложности
const DIFFICULTY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

// Состояния челленджа
const CHALLENGE_STATES = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

// Класс для представления челленджа
class Challenge {
    constructor(id, title, description, difficulty, type, timer, goal, relatedRules = [], keywords = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.type = type;
        this.timer = timer; // в секундах
        this.goal = goal;
        this.relatedRules = relatedRules;
        this.keywords = keywords;
        this.state = CHALLENGE_STATES.NOT_STARTED;
        this.startTime = null;
        this.endTime = null;
        this.result = null;
        this.createdAt = new Date().toISOString();
    }
    
    // Начать выполнение челленджа
    start() {
        this.state = CHALLENGE_STATES.IN_PROGRESS;
        this.startTime = new Date().toISOString();
    }
    
    // Завершить выполнение челленджа
    complete(result) {
        this.state = CHALLENGE_STATES.COMPLETED;
        this.endTime = new Date().toISOString();
        this.result = result;
    }
    
    // Провалить выполнение челленджа
    fail() {
        this.state = CHALLENGE_STATES.FAILED;
        this.endTime = new Date().toISOString();
    }
    
    // Получить оставшееся время (в секундах)
    getTimeRemaining() {
        if (!this.startTime || this.state !== CHALLENGE_STATES.IN_PROGRESS) {
            return this.timer;
        }
        
        const elapsed = (new Date() - new Date(this.startTime)) / 1000;
        return Math.max(0, this.timer - elapsed);
    }
}

// Генератор случайных челленджей
class ChallengeGenerator {
    constructor() {
        this.challengeTemplates = this.initializeChallengeTemplates();
    }
    
    // Инициализация шаблонов челленджей
    initializeChallengeTemplates() {
        return [
            // Челленджи навыков
            {
                id: 'free-throws-10',
                title: '10 штрафных бросков подряд',
                description: 'Сделайте 10 успешных штрафных бросков подряд',
                difficulty: DIFFICULTY_LEVELS.MEDIUM,
                type: CHALLENGE_TYPES.SKILL,
                timer: 300, // 5 минут
                goal: '10 попаданий подряд',
                relatedRules: ['foul'],
                keywords: ['штрафные', 'броски', 'точность']
            },
            {
                id: 'three-pointers-5',
                title: '5 трехочковых бросков за 30 сек',
                description: 'Сделайте 5 успешных трехочковых бросков за 30 секунд',
                difficulty: DIFFICULTY_LEVELS.HARD,
                type: CHALLENGE_TYPES.SKILL,
                timer: 30,
                goal: '5 попаданий за 30 сек',
                relatedRules: ['three-point-rule'],
                keywords: ['трехочковые', 'броски', 'скорость']
            },
            {
                id: 'dribbling-cone',
                title: 'Ведение мяча между конусами',
                description: 'Пройдите дистанцию между конусами, ведя мяч, за отведенное время',
                difficulty: DIFFICULTY_LEVELS.EASY,
                type: CHALLENGE_TYPES.SKILL,
                timer: 60,
                goal: 'пройти дистанцию без ошибок',
                relatedRules: ['dribbling'],
                keywords: ['ведение', 'мяч', 'координация']
            },
            
            // Физические челленджи
            {
                id: 'vertical-jump-improvement',
                title: 'Улучшите прыжок на 10 см',
                description: 'Улучшите свой вертикальный прыжок на 10 см за месяц',
                difficulty: DIFFICULTY_LEVELS.MEDIUM,
                type: CHALLENGE_TYPES.PHYSICS,
                timer: 2592000, // 30 дней в секундах
                goal: 'увеличить прыжок на 10 см',
                relatedRules: [],
                keywords: ['прыжок', 'физика', 'улучшение']
            },
            {
                id: 'run-3km-under-15min',
                title: 'Пробег 3 км за 15 минут',
                description: 'Пробегите 3 километра за 15 минут',
                difficulty: DIFFICULTY_LEVELS.HARD,
                type: CHALLENGE_TYPES.ENDURANCE,
                timer: 900,
                goal: '3 км за 15 мин',
                relatedRules: [],
                keywords: ['бег', 'выносливость', 'время']
            },
            
            // Челленджи правил
            {
                id: 'identify-traveling',
                title: 'Угадайте 10 пробежек',
                description: 'Определите 10 случаев пробежки на основе описания игровых ситуаций',
                difficulty: DIFFICULTY_LEVELS.MEDIUM,
                type: CHALLENGE_TYPES.RULES,
                timer: 600, // 10 минут
                goal: '10 правильных ответов',
                relatedRules: ['traveling'],
                keywords: ['правила', 'пробежка', 'судейство']
            },
            {
                id: 'foul-types',
                title: 'Определите тип фола',
                description: 'Определите тип фола в 10 различных игровых ситуациях',
                difficulty: DIFFICULTY_LEVELS.MEDIUM,
                type: CHALLENGE_TYPES.RULES,
                timer: 600,
                goal: '10 правильных ответов',
                relatedRules: ['foul'],
                keywords: ['фол', 'правила', 'судейство']
            },
            
            // Челленджи ловкости
            {
                id: 'challenge-of-the-day',
                title: 'Челлендж дня',
                description: 'Случайный челлендж для развития навыков',
                difficulty: DIFFICULTY_LEVELS.MEDIUM,
                type: CHALLENGE_TYPES.AGILITY,
                timer: 180,
                goal: 'выполнить задачу',
                relatedRules: [],
                keywords: ['день', 'случайный', 'навыки']
            }
        ];
    }
    
    // Генерация случайного челленджа
    generateRandomChallenge(difficulty = null, type = null) {
        // Фильтруем шаблоны по сложности и типу
        let filteredTemplates = this.challengeTemplates;
        
        if (difficulty) {
            filteredTemplates = filteredTemplates.filter(t => t.difficulty === difficulty);
        }
        
        if (type) {
            filteredTemplates = filteredTemplates.filter(t => t.type === type);
        }
        
        if (filteredTemplates.length === 0) {
            throw new Error('Не найдено подходящих шаблонов для генерации челленджа');
        }
        
        // Выбираем случайный шаблон
        const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
        
        // Создаем экземпляр челленджа
        return new Challenge(
            template.id,
            template.title,
            template.description,
            template.difficulty,
            template.type,
            template.timer,
            template.goal,
            template.relatedRules,
            template.keywords
        );
    }
    
    // Генерация челленджа дня
    generateDailyChallenge() {
        // Для челленджа дня используем фиксированное время (полдень по местному времени)
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        const seed = today.getTime();
        
        // Используем дату для генерации "постоянного" челленджа для дня
        const dailyTemplateIndex = Math.abs(seed) % this.challengeTemplates.length;
        const template = this.challengeTemplates[dailyTemplateIndex];
        
        return new Challenge(
            `daily-${today.toISOString().split('T')[0]}`,
            `Челлендж дня: ${template.title}`,
            `Ежедневный челлендж: ${template.description}`,
            template.difficulty,
            template.type,
            template.timer,
            template.goal,
            template.relatedRules,
            template.keywords
        );
    }
    
    // Генерация персонализированного челленджа на основе профиля пользователя
    generatePersonalizedChallenge(userProfile) {
        // На основе профиля пользователя (уровень, возраст, цели) генерируем подходящий челлендж
        const { skillLevel, age, goals } = userProfile || {};
        
        let difficulty = DIFFICULTY_LEVELS.MEDIUM;
        let type = CHALLENGE_TYPES.SKILL;
        
        // Определяем сложность на основе уровня навыков
        if (skillLevel === 'beginner') {
            difficulty = DIFFICULTY_LEVELS.EASY;
        } else if (skillLevel === 'advanced' || skillLevel === 'professional') {
            difficulty = DIFFICULTY_LEVELS.HARD;
        }
        
        // Определяем тип на основе целей
        if (goals && goals.includes('improve_shooting')) {
            type = CHALLENGE_TYPES.SKILL;
        } else if (goals && goals.includes('increase_jump')) {
            type = CHALLENGE_TYPES.PHYSICS;
        } else if (goals && goals.includes('learn_rules')) {
            type = CHALLENGE_TYPES.RULES;
        }
        
        return this.generateRandomChallenge(difficulty, type);
    }
}

// Менеджер челленджей
class ChallengeManager {
    constructor() {
        this.generator = new ChallengeGenerator();
        this.activeChallenge = null;
        this.history = [];
    }
    
    // Начать новый челлендж
    startChallenge(challengeId = null, difficulty = null, type = null) {
        let challenge;
        
        if (challengeId) {
            // Если указан ID, ищем конкретный челлендж
            const template = this.generator.challengeTemplates.find(t => t.id === challengeId);
            if (!template) {
                throw new Error(`Челлендж с ID "${challengeId}" не найден`);
            }
            
            challenge = new Challenge(
                template.id,
                template.title,
                template.description,
                template.difficulty,
                template.type,
                template.timer,
                template.goal,
                template.relatedRules,
                template.keywords
            );
        } else {
            // Генерируем случайный челлендж
            challenge = this.generator.generateRandomChallenge(difficulty, type);
        }
        
        challenge.start();
        this.activeChallenge = challenge;
        
        return challenge;
    }
    
    // Завершить активный челлендж
    completeChallenge(result) {
        if (!this.activeChallenge) {
            throw new Error('Нет активного челленджа для завершения');
        }
        
        this.activeChallenge.complete(result);
        
        // Добавляем в историю
        this.history.push(this.activeChallenge);
        
        // Сохраняем результат
        this.saveChallengeResult(this.activeChallenge);
        
        const completedChallenge = this.activeChallenge;
        this.activeChallenge = null;
        
        return completedChallenge;
    }
    
    // Провалить активный челлендж
    failChallenge() {
        if (!this.activeChallenge) {
            throw new Error('Нет активного челленджа для провала');
        }
        
        this.activeChallenge.fail();
        
        // Добавляем в историю
        this.history.push(this.activeChallenge);
        
        // Сохраняем результат
        this.saveChallengeResult(this.activeChallenge);
        
        const failedChallenge = this.activeChallenge;
        this.activeChallenge = null;
        
        return failedChallenge;
    }
    
    // Получить челлендж дня
    getDailyChallenge() {
        return this.generator.generateDailyChallenge();
    }
    
    // Получить персонализированный челлендж
    getPersonalizedChallenge(userProfile) {
        return this.generator.generatePersonalizedChallenge(userProfile);
    }
    
    // Сохранить результат челленджа
    saveChallengeResult(challenge) {
        // Проверяем, доступен ли наш модуль хранения
        if (typeof ChallengeResultsStorage !== 'undefined') {
            ChallengeResultsStorage.addResult(challenge.id, challenge.result, challenge.endTime);
        } else {
            // Если модуль хранения недоступен, используем localStorage напрямую
            const results = JSON.parse(localStorage.getItem('basketguide_challenge_results') || '[]');
            
            const newResult = {
                id: Date.now(),
                challengeId: challenge.id,
                result: challenge.result,
                timestamp: challenge.endTime,
                completed: challenge.state === CHALLENGE_STATES.COMPLETED
            };
            
            results.push(newResult);
            localStorage.setItem('basketguide_challenge_results', JSON.stringify(results));
        }
    }
    
    // Получить историю челленджей
    getChallengeHistory() {
        return this.history;
    }
    
    // Получить статистику по челленджам
    getChallengeStats() {
        const total = this.history.length;
        const completed = this.history.filter(c => c.state === CHALLENGE_STATES.COMPLETED).length;
        const failed = this.history.filter(c => c.state === CHALLENGE_STATES.FAILED).length;
        
        const stats = {
            total,
            completed,
            failed,
            successRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
        
        // Добавляем статистику по типам
        stats.byType = {};
        Object.values(CHALLENGE_TYPES).forEach(type => {
            const typeChallenges = this.history.filter(c => c.type === type);
            const typeCompleted = typeChallenges.filter(c => c.state === CHALLENGE_STATES.COMPLETED).length;
            
            stats.byType[type] = {
                total: typeChallenges.length,
                completed: typeCompleted,
                successRate: typeChallenges.length > 0 ? Math.round((typeCompleted / typeChallenges.length) * 100) : 0
            };
        });
        
        // Добавляем статистику по сложности
        stats.byDifficulty = {};
        Object.values(DIFFICULTY_LEVELS).forEach(difficulty => {
            const diffChallenges = this.history.filter(c => c.difficulty === difficulty);
            const diffCompleted = diffChallenges.filter(c => c.state === CHALLENGE_STATES.COMPLETED).length;
            
            stats.byDifficulty[difficulty] = {
                total: diffChallenges.length,
                completed: diffCompleted,
                successRate: diffChallenges.length > 0 ? Math.round((diffCompleted / diffChallenges.length) * 100) : 0
            };
        });
        
        return stats;
    }
    
    // Сбросить активный челлендж
    resetActiveChallenge() {
        this.activeChallenge = null;
    }
}

// Инициализация глобального менеджера челленджей
const challengeManager = new ChallengeManager();

// Функция для запуска генерации челленджа
function startChallengeGeneration(difficulty = null, type = null) {
    try {
        const challenge = challengeManager.startChallenge(null, difficulty, type);
        
        // Отображаем челлендж на странице
        displayChallenge(challenge);
        
        // Запускаем таймер, если он предусмотрен
        if (challenge.timer > 0) {
            startChallengeTimer(challenge);
        }
        
        return challenge;
    } catch (error) {
        console.error('Ошибка при запуске челленджа:', error);
        showError('Не удалось запустить челлендж. Попробуйте еще раз.');
        return null;
    }
}

// Функция для отображения челленджа на странице
function displayChallenge(challenge) {
    const container = document.querySelector('#challenge-container') || document.createElement('div');
    container.id = 'challenge-container';
    container.className = 'challenge-display';
    
    container.innerHTML = `
        <div class="challenge-header">
            <h2>${challenge.title}</h2>
            <div class="challenge-meta">
                <span class="difficulty ${challenge.difficulty}">${getDifficultyLabel(challenge.difficulty)}</span>
                <span class="type ${challenge.type}">${getTypeLabel(challenge.type)}</span>
            </div>
        </div>
        
        <div class="challenge-body">
            <p class="challenge-description">${challenge.description}</p>
            
            <div class="challenge-goal">
                <h3>Цель:</h3>
                <p>${challenge.goal}</p>
            </div>
            
            <div class="challenge-timer" id="challenge-timer">
                ${challenge.timer > 0 ? `Время: ${formatTime(challenge.timer)}` : 'Без ограничения времени'}
            </div>
        </div>
        
        <div class="challenge-actions">
            <button class="btn btn-success" id="complete-challenge-btn">Выполнено!</button>
            <button class="btn btn-danger" id="fail-challenge-btn">Провалить</button>
            <button class="btn btn-secondary" id="skip-challenge-btn">Пропустить</button>
        </div>
        
        <div class="challenge-related-rules">
            <h3>Связанные правила:</h3>
            <ul>
                ${challenge.relatedRules.map(rule => `<li><a href="/rules/${rule}" class="rule-link">${getRuleTitle(rule)}</a></li>`).join('')}
            </ul>
        </div>
    `;
    
    // Если контейнер был создан заново, добавляем его на страницу
    if (!document.querySelector('#challenge-container')) {
        const target = document.querySelector('.challenge-area') || document.body;
        target.appendChild(container);
    }
    
    // Добавляем обработчики событий
    document.getElementById('complete-challenge-btn').addEventListener('click', () => {
        const result = prompt('Введите результат выполнения челленджа (например, "7 из 10"):');
        if (result !== null) {
            completeActiveChallenge(result);
        }
    });
    
    document.getElementById('fail-challenge-btn').addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите провалить этот челлендж?')) {
            failActiveChallenge();
        }
    });
    
    document.getElementById('skip-challenge-btn').addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите пропустить этот челлендж?')) {
            skipActiveChallenge();
        }
    });
}

// Функция для запуска таймера челленджа
function startChallengeTimer(challenge) {
    const timerElement = document.getElementById('challenge-timer');
    if (!timerElement) return;
    
    const updateTimer = () => {
        const timeRemaining = challenge.getTimeRemaining();
        
        if (timeRemaining <= 0) {
            timerElement.textContent = 'Время вышло!';
            timerElement.classList.add('expired');
            
            // Автоматически помечаем челлендж как проваленный по времени
            setTimeout(() => {
                failActiveChallenge();
            }, 2000);
            
            clearInterval(timerInterval);
            return;
        }
        
        timerElement.textContent = `Осталось времени: ${formatTime(timeRemaining)}`;
        
        if (timeRemaining < 10) {
            timerElement.classList.add('warning');
        }
    };
    
    // Обновляем таймер каждую секунду
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Обновляем сразу
    updateTimer();
}

// Функция для завершения активного челленджа
function completeActiveChallenge(result) {
    try {
        const completedChallenge = challengeManager.completeChallenge(result);
        showSuccess(`Челлендж "${completedChallenge.title}" успешно завершен!`);
        
        // Обновляем отображение
        updateChallengeDisplay(completedChallenge);
    } catch (error) {
        console.error('Ошибка при завершении челленджа:', error);
        showError('Не удалось завершить челлендж.');
    }
}

// Функция для провала активного челленджа
function failActiveChallenge() {
    try {
        const failedChallenge = challengeManager.failChallenge();
        showInfo(`Челлендж "${failedChallenge.title}" провален.`);
        
        // Обновляем отображение
        updateChallengeDisplay(failedChallenge);
    } catch (error) {
        console.error('Ошибка при провале челленджа:', error);
        showError('Не удалось провалить челлендж.');
    }
}

// Функция для пропуска активного челленджа
function skipActiveChallenge() {
    try {
        challengeManager.resetActiveChallenge();
        showInfo('Челлендж пропущен. Сгенерирован новый.');
        
        // Скрываем текущий челлендж и генерируем новый
        hideCurrentChallenge();
        startChallengeGeneration();
    } catch (error) {
        console.error('Ошибка при пропуске челленджа:', error);
        showError('Не удалось пропустить челлендж.');
    }
}

// Функция для обновления отображения челленджа
function updateChallengeDisplay(challenge) {
    const container = document.querySelector('#challenge-container');
    if (!container) return;
    
    // Обновляем статус в зависимости от результата
    const statusClass = challenge.state === CHALLENGE_STATES.COMPLETED ? 'completed' : 'failed';
    container.classList.add(statusClass);
    
    // Добавляем результат
    const resultDiv = document.createElement('div');
    resultDiv.className = 'challenge-result';
    resultDiv.innerHTML = `
        <h3>Результат:</h3>
        <p>${challenge.result || 'Не указан'}</p>
        <p>Статус: <span class="status ${challenge.state}">${getStatusLabel(challenge.state)}</span></p>
    `;
    
    container.appendChild(resultDiv);
    
    // Скрываем кнопки управления
    const actionButtons = document.querySelector('.challenge-actions');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }
}

// Функция для скрытия текущего челленджа
function hideCurrentChallenge() {
    const container = document.querySelector('#challenge-container');
    if (container) {
        container.style.display = 'none';
    }
}

// Вспомогательные функции для отображения
function getDifficultyLabel(difficulty) {
    const labels = {
        [DIFFICULTY_LEVELS.EASY]: 'Легкий',
        [DIFFICULTY_LEVELS.MEDIUM]: 'Средний',
        [DIFFICULTY_LEVELS.HARD]: 'Сложный'
    };
    return labels[difficulty] || difficulty;
}

function getTypeLabel(type) {
    const labels = {
        [CHALLENGE_TYPES.SKILL]: 'Навыки',
        [CHALLENGE_TYPES.PHYSICS]: 'Физика',
        [CHALLENGE_TYPES.RULES]: 'Правила',
        [CHALLENGE_TYPES.AGILITY]: 'Ловкость',
        [CHALLENGE_TYPES.ENDURANCE]: 'Выносливость'
    };
    return labels[type] || type;
}

function getStatusLabel(state) {
    const labels = {
        [CHALLENGE_STATES.NOT_STARTED]: 'Не начат',
        [CHALLENGE_STATES.IN_PROGRESS]: 'В процессе',
        [CHALLENGE_STATES.COMPLETED]: 'Завершен',
        [CHALLENGE_STATES.FAILED]: 'Провален'
    };
    return labels[state] || state;
}

function getRuleTitle(ruleId) {
    // В реальном приложении названия правил будут загружаться из данных
    const ruleTitles = {
        'traveling': 'Пробежка',
        'foul': 'Фол',
        'three-point-rule': 'Трехочковое правило',
        'dribbling': 'Ведение мяча'
    };
    return ruleTitles[ruleId] || ruleId;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Функции для отображения сообщений
function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showInfo(message) {
    showMessage(message, 'info');
}

function showMessage(message, type) {
    // Создаем или обновляем элемент сообщения
    let messageElement = document.getElementById('challenge-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'challenge-message';
        document.body.appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    
    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Инициализация модуля
function initChallengeGenerator() {
    console.log('Модуль генерации челленджей инициализирован');
    
    // Проверяем наличие элементов управления челленджами на странице
    const generateBtn = document.querySelector('#generate-challenge-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            startChallengeGeneration();
        });
    }
    
    // Инициализируем кнопки для разных уровней сложности
    const easyBtn = document.querySelector('#challenge-easy-btn');
    const mediumBtn = document.querySelector('#challenge-medium-btn');
    const hardBtn = document.querySelector('#challenge-hard-btn');
    
    if (easyBtn) {
        easyBtn.addEventListener('click', () => startChallengeGeneration(DIFFICULTY_LEVELS.EASY));
    }
    
    if (mediumBtn) {
        mediumBtn.addEventListener('click', () => startChallengeGeneration(DIFFICULTY_LEVELS.MEDIUM));
    }
    
    if (hardBtn) {
        hardBtn.addEventListener('click', () => startChallengeGeneration(DIFFICULTY_LEVELS.HARD));
    }
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initChallengeGenerator, 100);
});

// Экспорт классов и функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CHALLENGE_TYPES,
        DIFFICULTY_LEVELS,
        CHALLENGE_STATES,
        Challenge,
        ChallengeGenerator,
        ChallengeManager,
        challengeManager,
        startChallengeGeneration,
        displayChallenge,
        completeActiveChallenge,
        failActiveChallenge,
        skipActiveChallenge,
        initChallengeGenerator
    };
}