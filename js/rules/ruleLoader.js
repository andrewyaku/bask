// Модуль для загрузки данных правил баскетбола для BasketGuide

// Базовый URL для данных (в данном случае предполагаем, что JSON-файлы находятся в папке data)
const DATA_BASE_URL = './data';

// Кэш для загруженных данных правил
const ruleCache = new Map();

// Функция для загрузки одного правила по ID
async function loadRuleById(ruleId) {
    try {
        // Проверяем, есть ли правило в кэше
        if (ruleCache.has(ruleId)) {
            console.log(`Загрузка правила "${ruleId}" из кэша`);
            return ruleCache.get(ruleId);
        }
        
        // Формируем путь к файлу с данными правила
        const ruleFilePath = `${DATA_BASE_URL}/rules.json`;
        
        // Загружаем общий файл с правилами
        const response = await fetch(ruleFilePath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ищем правило с указанным ID
        const rule = data.rules.find(r => r.id === ruleId);
        
        if (!rule) {
            throw new Error(`Правило с ID "${ruleId}" не найдено`);
        }
        
        // Кэшируем правило
        ruleCache.set(ruleId, rule);
        
        console.log(`Правило "${ruleId}" успешно загружено`);
        return rule;
    } catch (error) {
        console.error(`Ошибка при загрузке правила "${ruleId}":`, error);
        throw error;
    }
}

// Функция для загрузки всех правил
async function loadAllRules() {
    try {
        // Проверяем, есть ли все правила в кэше
        if (ruleCache.get('all-rules')) {
            console.log('Загрузка всех правил из кэша');
            return ruleCache.get('all-rules');
        }
        
        const rulesFilePath = `${DATA_BASE_URL}/rules.json`;
        const response = await fetch(rulesFilePath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Кэшируем все правила
        ruleCache.set('all-rules', data.rules);
        
        // Также кэшируем каждое правило по отдельности
        data.rules.forEach(rule => {
            ruleCache.set(rule.id, rule);
        });
        
        console.log(`Все правила (${data.rules.length}) успешно загружены`);
        return data.rules;
    } catch (error) {
        console.error('Ошибка при загрузке всех правил:', error);
        throw error;
    }
}

// Функция для загрузки правил по категории
async function loadRulesByCategory(category) {
    try {
        // Сначала загружаем все правила
        const allRules = await loadAllRules();
        
        // Фильтруем по категории (предполагаем, что в данных есть поле category)
        const categoryRules = allRules.filter(rule => 
            rule.category && rule.category.toLowerCase() === category.toLowerCase()
        );
        
        console.log(`Найдено ${categoryRules.length} правил в категории "${category}"`);
        return categoryRules;
    } catch (error) {
        console.error(`Ошибка при загрузке правил категории "${category}":`, error);
        throw error;
    }
}

// Функция для загрузки правил по ключевым словам
async function loadRulesByKeywords(keywords) {
    try {
        // Сначала загружаем все правила
        const allRules = await loadAllRules();
        
        // Преобразуем ключевые слова в нижний регистр для поиска
        const searchTerms = Array.isArray(keywords) ? 
            keywords.map(kw => kw.toLowerCase()) : 
            [keywords.toLowerCase()];
        
        // Фильтруем правила, содержащие хотя бы одно из ключевых слов
        const keywordRules = allRules.filter(rule => {
            if (!rule.keywords) return false;
            
            // Проверяем совпадение с ключевыми словами
            return rule.keywords.some(keyword => 
                searchTerms.includes(keyword.toLowerCase())
            );
        });
        
        console.log(`Найдено ${keywordRules.length} правил по ключевым словам "${keywords.join(', ')}"`);
        return keywordRules;
    } catch (error) {
        console.error(`Ошибка при загрузке правил по ключевым словам "${keywords}":`, error);
        throw error;
    }
}

// Функция для поиска правил по названию или описанию
async function searchRules(query) {
    try {
        // Сначала загружаем все правила
        const allRules = await loadAllRules();
        
        // Приводим поисковый запрос к нижнему регистру
        const searchTerm = query.toLowerCase();
        
        // Фильтруем правила, содержащие поисковый запрос в названии или описании
        const matchingRules = allRules.filter(rule => 
            rule.title.toLowerCase().includes(searchTerm) ||
            rule.shortDesc.toLowerCase().includes(searchTerm) ||
            (rule.keywords && rule.keywords.some(kw => kw.toLowerCase().includes(searchTerm)))
        );
        
        console.log(`Найдено ${matchingRules.length} правил по запросу "${query}"`);
        return matchingRules;
    } catch (error) {
        console.error(`Ошибка при поиске правил по запросу "${query}":`, error);
        throw error;
    }
}

// Функция для получения списка всех категорий правил
async function getRuleCategories() {
    try {
        const allRules = await loadAllRules();
        
        // Извлекаем уникальные категории
        const categories = [...new Set(allRules
            .filter(rule => rule.category)
            .map(rule => rule.category)
        )];
        
        console.log(`Найдено ${categories.length} категорий правил`);
        return categories;
    } catch (error) {
        console.error('Ошибка при получении категорий правил:', error);
        throw error;
    }
}

// Функция для получения популярных правил (например, с наибольшим количеством просмотров)
async function getPopularRules(limit = 10) {
    try {
        const allRules = await loadAllRules();
        
        // Сортируем правила по количеству просмотров (предполагаем, что в данных есть поле views)
        const sortedRules = allRules.sort((a, b) => {
            return (b.views || 0) - (a.views || 0);
        });
        
        const popularRules = sortedRules.slice(0, limit);
        
        console.log(`Получено ${popularRules.length} популярных правил`);
        return popularRules;
    } catch (error) {
        console.error(`Ошибка при получении ${limit} популярных правил:`, error);
        throw error;
    }
}

// Функция для получения случайного правила
async function getRandomRule() {
    try {
        const allRules = await loadAllRules();
        
        // Выбираем случайное правило
        const randomIndex = Math.floor(Math.random() * allRules.length);
        const randomRule = allRules[randomIndex];
        
        console.log(`Выбрано случайное правило: ${randomRule.title}`);
        return randomRule;
    } catch (error) {
        console.error('Ошибка при получении случайного правила:', error);
        throw error;
    }
}

// Функция для получения связанных правил
async function getRelatedRules(ruleId, limit = 5) {
    try {
        const rule = await loadRuleById(ruleId);
        
        if (!rule.relatedRules || rule.relatedRules.length === 0) {
            // Если у правила нет связанных правил, возвращаем популярные
            return await getPopularRules(limit);
        }
        
        // Загружаем все правила, чтобы найти связанные
        const allRules = await loadAllRules();
        
        // Фильтруем правила, которые указаны как связанные
        const relatedRules = allRules.filter(r => 
            rule.relatedRules.includes(r.id) && r.id !== ruleId
        ).slice(0, limit);
        
        console.log(`Найдено ${relatedRules.length} связанных правил для "${ruleId}"`);
        return relatedRules;
    } catch (error) {
        console.error(`Ошибка при получении связанных правил для "${ruleId}":`, error);
        throw error;
    }
}

// Функция для получения правил, связанных с определенным калькулятором
async function getRulesByCalculator(calculatorId) {
    try {
        const allRules = await loadAllRules();
        
        // Фильтруем правила, связанные с указанным калькулятором
        const relatedRules = allRules.filter(rule => 
            rule.relatedCalculators && rule.relatedCalculators.includes(calculatorId)
        );
        
        console.log(`Найдено ${relatedRules.length} правил, связанных с калькулятором "${calculatorId}"`);
        return relatedRules;
    } catch (error) {
        console.error(`Ошибка при получении правил для калькулятора "${calculatorId}":`, error);
        throw error;
    }
}

// Функция для получения правил, связанных с определенным челленджем
async function getRulesByChallenge(challengeId) {
    try {
        const allRules = await loadAllRules();
        
        // Фильтруем правила, связанные с указанным челленджем
        const relatedRules = allRules.filter(rule => 
            rule.relatedChallenges && rule.relatedChallenges.includes(challengeId)
        );
        
        console.log(`Найдено ${relatedRules.length} правил, связанных с челленджем "${challengeId}"`);
        return relatedRules;
    } catch (error) {
        console.error(`Ошибка при получении правил для челленджа "${challengeId}":`, error);
        throw error;
    }
}

// Функция для очистки кэша
function clearRuleCache() {
    ruleCache.clear();
    console.log('Кэш правил очищен');
}

// Функция для получения статистики кэша
function getCacheStats() {
    return {
        size: ruleCache.size,
        keys: Array.from(ruleCache.keys())
    };
}

// Функция для предзагрузки часто используемых правил
async function preloadCommonRules() {
    const commonRuleIds = [
        'traveling', 
        'double-dribble', 
        'foul', 
        'out-of-bounds', 
        'zone-defense'
    ];
    
    console.log('Начинаем предзагрузку часто используемых правил...');
    
    const promises = commonRuleIds.map(id => 
        loadRuleById(id).catch(error => {
            console.warn(`Не удалось предзагрузить правило "${id}":`, error);
        })
    );
    
    await Promise.all(promises);
    console.log('Предзагрузка часто используемых правил завершена');
}

// Инициализация модуля
async function initRuleLoader() {
    console.log('Модуль загрузки правил инициализируется...');
    
    try {
        // Предзагружаем часто используемые правила
        await preloadCommonRules();
        
        console.log('Модуль загрузки правил успешно инициализирован');
    } catch (error) {
        console.error('Ошибка при инициализации модуля загрузки правил:', error);
    }
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем загрузчик правил с небольшой задержкой
    setTimeout(initRuleLoader, 500);
});

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadRuleById,
        loadAllRules,
        loadRulesByCategory,
        loadRulesByKeywords,
        searchRules,
        getRuleCategories,
        getPopularRules,
        getRandomRule,
        getRelatedRules,
        getRulesByCalculator,
        getRulesByChallenge,
        clearRuleCache,
        getCacheStats,
        preloadCommonRules,
        initRuleLoader
    };
}