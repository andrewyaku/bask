// Функции для работы с хранилищем данных (localStorage) для BasketGuide

// Константы для ключей хранилища
const STORAGE_KEYS = {
    USER_PREFERENCES: 'basketguide_user_preferences',
    CALCULATOR_HISTORY: 'basketguide_calculator_history',
    CHALLENGE_RESULTS: 'basketguide_challenge_results',
    USER_PROFILE: 'basketguide_user_profile',
    LOCAL_LEADERBOARD: 'basketguide_local_leaderboard',
    TUTORIAL_PROGRESS: 'basketguide_tutorial_progress',
    TRAINING_PLANS: 'basketguide_training_plans',
    BLOG_FAVORITES: 'basketguide_blog_favorites',
    RULES_BOOKMARKS: 'basketguide_rules_bookmarks'
};

// Обертка для localStorage с обработкой ошибок
class StorageManager {
    constructor() {
        this.isLocalStorageAvailable = this.checkLocalStorageSupport();
    }
    
    // Проверка поддержки localStorage
    checkLocalStorageSupport() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage не поддерживается в этом браузере');
            return false;
        }
    }
    
    // Получение данных из хранилища
    getItem(key) {
        if (!this.isLocalStorageAvailable) {
            console.warn('localStorage недоступен');
            return null;
        }
        
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error(`Ошибка при чтении из localStorage (ключ: ${key}):`, e);
            return null;
        }
    }
    
    // Сохранение данных в хранилище
    setItem(key, value) {
        if (!this.isLocalStorageAvailable) {
            console.warn('localStorage недоступен');
            return false;
        }
        
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Ошибка при записи в localStorage (ключ: ${key}):`, e);
            return false;
        }
    }
    
    // Удаление данных из хранилища
    removeItem(key) {
        if (!this.isLocalStorageAvailable) {
            console.warn('localStorage недоступен');
            return false;
        }
        
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error(`Ошибка при удалении из localStorage (ключ: ${key}):`, e);
            return false;
        }
    }
    
    // Очистка всего хранилища
    clear() {
        if (!this.isLocalStorageAvailable) {
            console.warn('localStorage недоступен');
            return false;
        }
        
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Ошибка при очистке localStorage:', e);
            return false;
        }
    }
    
    // Получение всех ключей хранилища
    getAllKeys() {
        if (!this.isLocalStorageAvailable) {
            console.warn('localStorage недоступен');
            return [];
        }
        
        try {
            return Object.keys(localStorage);
        } catch (e) {
            console.error('Ошибка при получении ключей localStorage:', e);
            return [];
        }
    }
    
    // Проверка наличия ключа в хранилище
    hasItem(key) {
        if (!this.isLocalStorageAvailable) {
            console.warn('localStorage недоступен');
            return false;
        }
        
        try {
            return localStorage.getItem(key) !== null;
        } catch (e) {
            console.error(`Ошибка при проверке наличия ключа в localStorage (ключ: ${key}):`, e);
            return false;
        }
    }
    
    // Получение размера хранилища в байтах
    getStorageSize() {
        if (!this.isLocalStorageAvailable) {
            console.warn('localStorage недоступен');
            return 0;
        }
        
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return total;
        } catch (e) {
            console.error('Ошибка при вычислении размера localStorage:', e);
            return 0;
        }
    }
}

// Инициализация менеджера хранилища
const storageManager = new StorageManager();

// Функции для работы с пользовательским профилем
const UserProfileStorage = {
    // Получение профиля пользователя
    getUserProfile() {
        return storageManager.getItem(STORAGE_KEYS.USER_PROFILE) || {
            id: null,
            name: '',
            age: null,
            gender: 'unknown',
            skillLevel: 'beginner',
            favoriteTeams: [],
            preferences: {
                league: 'fib',
                notifications: true,
                darkMode: false
            }
        };
    },
    
    // Сохранение профиля пользователя
    setUserProfile(profile) {
        const existingProfile = storageManager.getItem(STORAGE_KEYS.USER_PROFILE) || {};
        const updatedProfile = { ...existingProfile, ...profile };
        
        return storageManager.setItem(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    },
    
    // Обновление отдельного поля профиля
    updateUserProfileField(field, value) {
        const profile = this.getUserProfile();
        profile[field] = value;
        return this.setUserProfile(profile);
    },
    
    // Сброс профиля пользователя
    resetUserProfile() {
        return storageManager.removeItem(STORAGE_KEYS.USER_PROFILE);
    }
};

// Функции для работы с историей калькуляторов
const CalculatorHistoryStorage = {
    // Получение истории калькуляторов
    getHistory() {
        return storageManager.getItem(STORAGE_KEYS.CALCULATOR_HISTORY) || [];
    },
    
    // Добавление записи в историю
    addToHistory(calculatorId, inputs, result) {
        const history = this.getHistory();
        const newEntry = {
            id: Date.now(),
            calculatorId,
            inputs,
            result,
            timestamp: new Date().toISOString()
        };
        
        // Ограничиваем историю 50 последними записями
        history.unshift(newEntry);
        if (history.length > 50) {
            history.pop();
        }
        
        return storageManager.setItem(STORAGE_KEYS.CALCULATOR_HISTORY, history);
    },
    
    // Очистка истории калькуляторов
    clearHistory() {
        return storageManager.removeItem(STORAGE_KEYS.CALCULATOR_HISTORY);
    },
    
    // Удаление конкретной записи из истории
    removeEntry(entryId) {
        const history = this.getHistory();
        const filteredHistory = history.filter(entry => entry.id !== entryId);
        return storageManager.setItem(STORAGE_KEYS.CALCULATOR_HISTORY, filteredHistory);
    }
};

// Функции для работы с результатами челленджей
const ChallengeResultsStorage = {
    // Получение результатов челленджей
    getResults() {
        return storageManager.getItem(STORAGE_KEYS.CHALLENGE_RESULTS) || [];
    },
    
    // Добавление результата челленджа
    addResult(challengeId, result, timestamp = new Date().toISOString()) {
        const results = this.getResults();
        const newResult = {
            id: Date.now(),
            challengeId,
            result,
            timestamp,
            completed: true
        };
        
        results.push(newResult);
        return storageManager.setItem(STORAGE_KEYS.CHALLENGE_RESULTS, results);
    },
    
    // Получение результатов для конкретного челленджа
    getResultsForChallenge(challengeId) {
        const results = this.getResults();
        return results.filter(result => result.challengeId === challengeId);
    },
    
    // Получение лучшего результата для конкретного челленджа
    getBestResultForChallenge(challengeId) {
        const results = this.getResultsForChallenge(challengeId);
        if (results.length === 0) return null;
        
        // Предполагаем, что более высокое значение результата - лучше
        return results.reduce((best, current) => 
            current.result > best.result ? current : best
        );
    },
    
    // Очистка результатов челленджей
    clearResults() {
        return storageManager.removeItem(STORAGE_KEYS.CHALLENGE_RESULTS);
    }
};

// Функции для работы с локальной таблицей лидеров
const LeaderboardStorage = {
    // Получение локальной таблицы лидеров
    getLeaderboard() {
        return storageManager.getItem(STORAGE_KEYS.LOCAL_LEADERBOARD) || {
            global: [],
            challenges: {}
        };
    },
    
    // Добавление результата в таблицу лидеров
    addToLeaderboard(challengeId, userId, score, userName = 'Аноним') {
        const leaderboard = this.getLeaderboard();
        
        // Обновляем глобальную таблицу
        const globalEntry = {
            userId,
            userName,
            totalScore: score,
            lastUpdated: new Date().toISOString()
        };
        
        // Проверяем, есть ли пользователь в глобальной таблице
        const existingGlobalIndex = leaderboard.global.findIndex(entry => entry.userId === userId);
        if (existingGlobalIndex !== -1) {
            leaderboard.global[existingGlobalIndex] = globalEntry;
        } else {
            leaderboard.global.push(globalEntry);
        }
        
        // Обновляем таблицу для конкретного челленджа
        if (!leaderboard.challenges[challengeId]) {
            leaderboard.challenges[challengeId] = [];
        }
        
        const challengeEntry = {
            userId,
            userName,
            score,
            timestamp: new Date().toISOString()
        };
        
        // Проверяем, есть ли пользователь в таблице челленджа
        const existingChallengeIndex = leaderboard.challenges[challengeId].findIndex(
            entry => entry.userId === userId
        );
        if (existingChallengeIndex !== -1) {
            leaderboard.challenges[challengeId][existingChallengeIndex] = challengeEntry;
        } else {
            leaderboard.challenges[challengeId].push(challengeEntry);
        }
        
        // Сортируем таблицы (по убыванию результата)
        leaderboard.global.sort((a, b) => b.totalScore - a.totalScore);
        leaderboard.challenges[challengeId].sort((a, b) => b.score - a.score);
        
        // Ограничиваем количество записей (например, топ-10)
        leaderboard.global = leaderboard.global.slice(0, 10);
        leaderboard.challenges[challengeId] = leaderboard.challenges[challengeId].slice(0, 10);
        
        return storageManager.setItem(STORAGE_KEYS.LOCAL_LEADERBOARD, leaderboard);
    },
    
    // Получение топ-N результатов для челленджа
    getTopResults(challengeId, limit = 10) {
        const leaderboard = this.getLeaderboard();
        const challengeLeaderboard = leaderboard.challenges[challengeId] || [];
        return challengeLeaderboard.slice(0, limit);
    },
    
    // Получение глобального рейтинга
    getGlobalLeaderboard(limit = 10) {
        const leaderboard = this.getLeaderboard();
        return leaderboard.global.slice(0, limit);
    }
};

// Функции для работы с прогрессом в обучении
const TutorialProgressStorage = {
    // Получение прогресса обучения
    getProgress() {
        return storageManager.getItem(STORAGE_KEYS.TUTORIAL_PROGRESS) || {};
    },
    
    // Обновление прогресса по конкретному уроку
    updateLessonProgress(lessonId, progress = 0, completed = false) {
        const progressData = this.getProgress();
        progressData[lessonId] = {
            progress: Math.min(100, Math.max(0, progress)),
            completed,
            lastAccessed: new Date().toISOString()
        };
        
        return storageManager.setItem(STORAGE_KEYS.TUTORIAL_PROGRESS, progressData);
    },
    
    // Получение прогресса по конкретному уроку
    getLessonProgress(lessonId) {
        const progressData = this.getProgress();
        return progressData[lessonId] || { progress: 0, completed: false };
    },
    
    // Получение общего прогресса
    getTotalProgress() {
        const progressData = this.getProgress();
        const lessonIds = Object.keys(progressData);
        
        if (lessonIds.length === 0) return 0;
        
        const totalProgress = lessonIds.reduce((sum, id) => sum + progressData[id].progress, 0);
        return Math.round(totalProgress / lessonIds.length);
    },
    
    // Сброс прогресса
    resetProgress() {
        return storageManager.removeItem(STORAGE_KEYS.TUTORIAL_PROGRESS);
    }
};

// Функции для работы с тренировочными планами
const TrainingPlansStorage = {
    // Получение сохраненных тренировочных планов
    getPlans() {
        return storageManager.getItem(STORAGE_KEYS.TRAINING_PLANS) || [];
    },
    
    // Добавление тренировочного плана
    addPlan(plan) {
        const plans = this.getPlans();
        plan.id = plan.id || Date.now().toString();
        plan.createdAt = plan.createdAt || new Date().toISOString();
        
        plans.push(plan);
        return storageManager.setItem(STORAGE_KEYS.TRAINING_PLANS, plans);
    },
    
    // Обновление тренировочного плана
    updatePlan(planId, updatedPlan) {
        const plans = this.getPlans();
        const planIndex = plans.findIndex(plan => plan.id === planId);
        
        if (planIndex !== -1) {
            plans[planIndex] = { ...plans[planIndex], ...updatedPlan };
            return storageManager.setItem(STORAGE_KEYS.TRAINING_PLANS, plans);
        }
        
        return false;
    },
    
    // Удаление тренировочного плана
    removePlan(planId) {
        const plans = this.getPlans();
        const filteredPlans = plans.filter(plan => plan.id !== planId);
        return storageManager.setItem(STORAGE_KEYS.TRAINING_PLANS, filteredPlans);
    },
    
    // Получение конкретного плана
    getPlanById(planId) {
        const plans = this.getPlans();
        return plans.find(plan => plan.id === planId);
    },
    
    // Отметка о выполнении дня тренировки
    markDayAsCompleted(planId, dayIndex, completed = true) {
        const plan = this.getPlanById(planId);
        if (!plan) return false;
        
        if (!plan.completedDays) {
            plan.completedDays = {};
        }
        
        plan.completedDays[dayIndex] = {
            completed,
            completedAt: completed ? new Date().toISOString() : null
        };
        
        return this.updatePlan(planId, plan);
    }
};

// Функции для работы с избранными статьями блога
const BlogFavoritesStorage = {
    // Получение избранных статей
    getFavorites() {
        return storageManager.getItem(STORAGE_KEYS.BLOG_FAVORITES) || [];
    },
    
    // Добавление статьи в избранное
    addToFavorites(articleId, articleTitle) {
        const favorites = this.getFavorites();
        
        // Проверяем, нет ли уже такой статьи в избранном
        if (favorites.some(fav => fav.id === articleId)) {
            return false;
        }
        
        const favorite = {
            id: articleId,
            title: articleTitle,
            addedAt: new Date().toISOString()
        };
        
        favorites.push(favorite);
        return storageManager.setItem(STORAGE_KEYS.BLOG_FAVORITES, favorites);
    },
    
    // Удаление статьи из избранного
    removeFromFavorites(articleId) {
        const favorites = this.getFavorites();
        const filteredFavorites = favorites.filter(fav => fav.id !== articleId);
        return storageManager.setItem(STORAGE_KEYS.BLOG_FAVORITES, filteredFavorites);
    },
    
    // Проверка, находится ли статья в избранном
    isFavorite(articleId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.id === articleId);
    }
};

// Функции для работы с закладками правил
const RulesBookmarksStorage = {
    // Получение закладок правил
    getBookmarks() {
        return storageManager.getItem(STORAGE_KEYS.RULES_BOOKMARKS) || [];
    },
    
    // Добавление правила в закладки
    addBookmark(ruleId, ruleTitle) {
        const bookmarks = this.getBookmarks();
        
        // Проверяем, нет ли уже такого правила в закладках
        if (bookmarks.some(bookmark => bookmark.id === ruleId)) {
            return false;
        }
        
        const bookmark = {
            id: ruleId,
            title: ruleTitle,
            addedAt: new Date().toISOString()
        };
        
        bookmarks.push(bookmark);
        return storageManager.setItem(STORAGE_KEYS.RULES_BOOKMARKS, bookmarks);
    },
    
    // Удаление правила из закладок
    removeBookmark(ruleId) {
        const bookmarks = this.getBookmarks();
        const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== ruleId);
        return storageManager.setItem(STORAGE_KEYS.RULES_BOOKMARKS, filteredBookmarks);
    },
    
    // Проверка, находится ли правило в закладках
    isBookmarked(ruleId) {
        const bookmarks = this.getBookmarks();
        return bookmarks.some(bookmark => bookmark.id === ruleId);
    }
};

// Функция для экспорта всех данных пользователя
function exportUserData() {
    const userData = {
        profile: UserProfileStorage.getUserProfile(),
        calculatorHistory: CalculatorHistoryStorage.getHistory(),
        challengeResults: ChallengeResultsStorage.getResults(),
        tutorialProgress: TutorialProgressStorage.getProgress(),
        trainingPlans: TrainingPlansStorage.getPlans(),
        blogFavorites: BlogFavoritesStorage.getFavorites(),
        rulesBookmarks: RulesBookmarksStorage.getBookmarks(),
        exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(userData, null, 2);
}

// Функция для импорта данных пользователя
function importUserData(jsonData) {
    try {
        const userData = JSON.parse(jsonData);
        
        // Восстанавливаем каждый компонент данных
        if (userData.profile) {
            storageManager.setItem(STORAGE_KEYS.USER_PROFILE, userData.profile);
        }
        
        if (userData.calculatorHistory) {
            storageManager.setItem(STORAGE_KEYS.CALCULATOR_HISTORY, userData.calculatorHistory);
        }
        
        if (userData.challengeResults) {
            storageManager.setItem(STORAGE_KEYS.CHALLENGE_RESULTS, userData.challengeResults);
        }
        
        if (userData.tutorialProgress) {
            storageManager.setItem(STORAGE_KEYS.TUTORIAL_PROGRESS, userData.tutorialProgress);
        }
        
        if (userData.trainingPlans) {
            storageManager.setItem(STORAGE_KEYS.TRAINING_PLANS, userData.trainingPlans);
        }
        
        if (userData.blogFavorites) {
            storageManager.setItem(STORAGE_KEYS.BLOG_FAVORITES, userData.blogFavorites);
        }
        
        if (userData.rulesBookmarks) {
            storageManager.setItem(STORAGE_KEYS.RULES_BOOKMARKS, userData.rulesBookmarks);
        }
        
        return true;
    } catch (e) {
        console.error('Ошибка при импорте данных пользователя:', e);
        return false;
    }
}

// Функция для очистки всех пользовательских данных
function clearAllUserData() {
    UserProfileStorage.resetUserProfile();
    CalculatorHistoryStorage.clearHistory();
    ChallengeResultsStorage.clearResults();
    TutorialProgressStorage.resetProgress();
    storageManager.removeItem(STORAGE_KEYS.TRAINING_PLANS);
    storageManager.removeItem(STORAGE_KEYS.BLOG_FAVORITES);
    storageManager.removeItem(STORAGE_KEYS.RULES_BOOKMARKS);
    storageManager.removeItem(STORAGE_KEYS.LOCAL_LEADERBOARD);
}

// Функция для получения общей статистики хранилища
function getStorageStats() {
    const keys = storageManager.getAllKeys();
    const stats = {
        totalItems: keys.length,
        totalSize: storageManager.getStorageSize(),
        maxSize: 5 * 1024 * 1024, // 5MB - приблизительный лимт localStorage
        usagePercent: 0,
        breakdown: {}
    };
    
    stats.usagePercent = Math.round((stats.totalSize / stats.maxSize) * 100);
    
    // Получаем размер для каждого ключа
    keys.forEach(key => {
        try {
            const value = localStorage.getItem(key);
            stats.breakdown[key] = value ? value.length : 0;
        } catch (e) {
            stats.breakdown[key] = 0;
        }
    });
    
    return stats;
}

// Экспорт функций для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        storageManager,
        STORAGE_KEYS,
        UserProfileStorage,
        CalculatorHistoryStorage,
        ChallengeResultsStorage,
        LeaderboardStorage,
        TutorialProgressStorage,
        TrainingPlansStorage,
        BlogFavoritesStorage,
        RulesBookmarksStorage,
        exportUserData,
        importUserData,
        clearAllUserData,
        getStorageStats
    };
}