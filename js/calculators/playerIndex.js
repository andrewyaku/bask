// Калькулятор индекса эффективности игрока для BasketGuide

// Функция для расчета индекса эффективности игрока (Player Efficiency Rating)
function calculatePlayerIndex(points, rebounds, assists, steals, blocks, turnovers, personalFouls, minutesPlayed = 40) {
    // Проверяем и устанавливаем значения по умолчанию
    points = points || 0;
    rebounds = rebounds || 0;
    assists = assists || 0;
    steals = steals || 0;
    blocks = blocks || 0;
    turnovers = turnovers || 0;
    personalFouls = personalFouls || 0;
    minutesPlayed = minutesPlayed || 40;
    
    // Рассчитываем базовый индекс эффективности (PER)
    // Упрощенная версия формулы, адаптированная для любительского уровня
    const baseEfficiency = points + rebounds + assists + steals + blocks - turnovers - personalFouls;
    
    // Нормализуем по времени на площадке
    const normalizedEfficiency = minutesPlayed > 0 ? baseEfficiency * (40 / minutesPlayed) : baseEfficiency;
    
    // Рассчитываем дополнительные метрики
    let rating = '';
    let ratingDescription = '';
    let performanceLevel = '';
    let areaOfImprovement = [];
    let positionSuitability = [];
    let comparisonToLeague = '';
    
    if (normalizedEfficiency > 25) {
        rating = 'Выдающийся';
        ratingDescription = 'Очень высокий уровень эффективности, характерный для звезд лиги';
        performanceLevel = 'Элита';
        areaOfImprovement = ['Сохранять консистентность', 'Развивать лидерские качества'];
        comparisonToLeague = 'Значительно выше среднего';
    } else if (normalizedEfficiency > 15) {
        rating = 'Очень хороший';
        ratingDescription = 'Высокий уровень эффективности, выше среднего для профессиональных игроков';
        performanceLevel = 'Профессионал';
        areaOfImprovement = ['Работа над слабыми сторонами', 'Фокус на ключевых навыках'];
        comparisonToLeague = 'Выше среднего';
    } else if (normalizedEfficiency > 10) {
        rating = 'Хороший';
        ratingDescription = 'Хороший уровень эффективности, выше среднего для любительского уровня';
        performanceLevel = 'Хороший игрок';
        areaOfImprovement = ['Снижение потерь', 'Увеличение подборов'];
        comparisonToLeague = 'Немного выше среднего';
    } else if (normalizedEfficiency > 5) {
        rating = 'Средний';
        ratingDescription = 'Средний уровень эффективности, типичный для среднего уровня';
        performanceLevel = 'Средний уровень';
        areaOfImprovement = ['Улучшение бросков', 'Работа с мячом', 'Защита'];
        comparisonToLeague = 'Средний уровень';
    } else if (normalizedEfficiency > 0) {
        rating = 'Ниже среднего';
        ratingDescription = 'Нуждается в улучшении, но есть положительный вклад';
        performanceLevel = 'Новичок';
        areaOfImprovement = ['Все аспекты игры', 'Тренировки', 'Опыт'];
        comparisonToLeague = 'Ниже среднего';
    } else {
        rating = 'Нуждается в улучшении';
        ratingDescription = 'Отрицательный вклад, требуется серьезная работа над игрой';
        performanceLevel = 'Нуждается в развитии';
        areaOfImprovement = ['Все аспекты игры', 'Минимизация ошибок', 'Базовые навыки'];
        comparisonToLeague = 'Значительно ниже среднего';
    }
    
    // Определяем подходящие позиции на основе статистики
    if (points >= 15 && assists < 5) {
        positionSuitability.push('Скоринговый защитник');
    } else if (assists >= 7 && points >= 8) {
        positionSuitability.push('Плеймейкер');
    } else if (rebounds >= 10) {
        positionSuitability.push('Центр/Тяжелый форвард');
    } else if (steals >= 3 && points >= 10) {
        positionSuitability.push('Периметровый защитник');
    }
    
    // Добавляем хотя бы одну позицию, если нет подходящих
    if (positionSuitability.length === 0) {
        positionSuitability.push('Универсал');
    }
    
    // Рассчитываем процент вклада в каждую категорию
    const totalPositive = points + rebounds + assists + steals + blocks;
    const positiveContribution = {
        scoring: totalPositive > 0 ? Math.round((points / totalPositive) * 100) : 0,
        rebounding: totalPositive > 0 ? Math.round((rebounds / totalPositive) * 100) : 0,
        playmaking: totalPositive > 0 ? Math.round((assists / totalPositive) * 100) : 0,
        defense: totalPositive > 0 ? Math.round(((steals + blocks) / totalPositive) * 100) : 0
    };
    
    return {
        baseEfficiency,
        normalizedEfficiency,
        rating,
        ratingDescription,
        performanceLevel,
        areaOfImprovement,
        positionSuitability,
        comparisonToLeague,
        positiveContribution,
        points,
        rebounds,
        assists,
        steals,
        blocks,
        turnovers,
        personalFouls,
        minutesPlayed
    };
}

// Функция для отображения результата расчета индекса эффективности
function displayPlayerIndexResult(result) {
    const resultContainer = document.querySelector('#player-index-result') || document.createElement('div');
    resultContainer.id = 'player-index-result';
    resultContainer.className = 'result-container';
    
    // Преобразуем массивы в строки для отображения
    const improvementsStr = result.areaOfImprovement.join(', ');
    const positionsStr = result.positionSuitability.join(', ');
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <h3>Индекс эффективности: <span class="result-value">${result.normalizedEfficiency.toFixed(1)}</span></h3>
        </div>
        <div class="result-rating">
            <h4>Оценка: <span class="rating-${result.performanceLevel.toLowerCase()}">${result.rating}</span></h4>
            <p>${result.ratingDescription}</p>
        </div>
        <div class="result-performance-level">
            <h4>Уровень игры: ${result.performanceLevel}</h4>
            <p>Сравнение с лигой: ${result.comparisonToLeague}</p>
        </div>
        <div class="result-stats-breakdown">
            <h4>Разбивка статистики:</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Очки:</span>
                    <span class="stat-value">${result.points}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Подборы:</span>
                    <span class="stat-value">${result.rebounds}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Передачи:</span>
                    <span class="stat-value">${result.assists}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Перехваты:</span>
                    <span class="stat-value">${result.steals}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Блоки:</span>
                    <span class="stat-value">${result.blocks}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Потери:</span>
                    <span class="stat-value">${result.turnovers}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Фолы:</span>
                    <span class="stat-value">${result.personalFouls}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Минуты:</span>
                    <span class="stat-value">${result.minutesPlayed}</span>
                </div>
            </div>
        </div>
        <div class="result-contribution">
            <h4>Вклад в игру:</h4>
            <div class="contribution-chart">
                <div class="contribution-bar scoring" style="width: ${result.positiveContribution.scoring}%;">
                    <span>Атака: ${result.positiveContribution.scoring}%</span>
                </div>
                <div class="contribution-bar rebounding" style="width: ${result.positiveContribution.rebounding}%;">
                    <span>Подборы: ${result.positiveContribution.rebounding}%</span>
                </div>
                <div class="contribution-bar playmaking" style="width: ${result.positiveContribution.playmaking}%;">
                    <span>Плеймейкинг: ${result.positiveContribution.playmaking}%</span>
                </div>
                <div class="contribution-bar defense" style="width: ${result.positiveContribution.defense}%;">
                    <span>Защита: ${result.positiveContribution.defense}%</span>
                </div>
            </div>
        </div>
        <div class="result-position-suitability">
            <h4>Подходящие позиции:</h4>
            <p>${positionsStr}</p>
        </div>
        <div class="result-improvements">
            <h4>Области для улучшения:</h4>
            <p>${improvementsStr}</p>
        </div>
        <div class="result-actions">
            <button class="btn btn-secondary" onclick="showPerformanceAnalysis()">Анализ производительности</button>
            <button class="btn btn-secondary" onclick="showTrainingRecommendations()">Рекомендации по тренировкам</button>
        </div>
    `;
    
    // Если контейнер был создан заново, добавляем его на страницу
    if (!document.querySelector('#player-index-result')) {
        const form = document.querySelector('#player-index-calculator') || document.body;
        form.appendChild(resultContainer);
    }
}

// Функция для отображения анализа производительности
function showPerformanceAnalysis() {
    alert('Детальный анализ производительности игрока');
    
    // В реальном приложении здесь будет перенаправление на страницу с анализом
    // window.location.hash = '/performance-analysis';
}

// Функция для отображения рекомендаций по тренировкам
function showTrainingRecommendations() {
    alert('Персонализированные рекомендации по тренировкам на основе индекса эффективности');
    
    // В реальном приложении здесь будет перенаправление на страницу с тренировками
    // window.location.hash = '/training-recommendations';
}

// Функция для инициализации калькулятора индекса эффективности
function initPlayerIndexCalculator() {
    const form = document.querySelector('#player-index-calculator');
    
    if (form) {
        // Добавляем обработчик события отправки формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения из формы
            const pointsInput = form.querySelector('input[name="points"]');
            const reboundsInput = form.querySelector('input[name="rebounds"]');
            const assistsInput = form.querySelector('input[name="assists"]');
            const stealsInput = form.querySelector('input[name="steals"]');
            const blocksInput = form.querySelector('input[name="blocks"]');
            const turnoversInput = form.querySelector('input[name="turnovers"]');
            const personalFoulsInput = form.querySelector('input[name="personalFouls"]');
            const minutesInput = form.querySelector('input[name="minutes"]');
            
            const points = parseInt(pointsInput.value) || 0;
            const rebounds = parseInt(reboundsInput.value) || 0;
            const assists = parseInt(assistsInput.value) || 0;
            const steals = parseInt(stealsInput.value) || 0;
            const blocks = parseInt(blocksInput.value) || 0;
            const turnovers = parseInt(turnoversInput.value) || 0;
            const personalFouls = parseInt(personalFoulsInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 40;
            
            // Проверяем валидность введенных данных
            if (minutes <= 0 || minutes > 60) {
                alert('Пожалуйста, введите корректное количество минут (1-60)');
                return;
            }
            
            // Выполняем расчет
            const result = calculatePlayerIndex(
                points, rebounds, assists, steals, blocks, 
                turnovers, personalFouls, minutes
            );
            
            // Отображаем результат
            displayPlayerIndexResult(result);
            
            // Сохраняем результат в историю
            savePlayerIndexToHistory({
                points, rebounds, assists, steals, blocks, turnovers, personalFouls, minutes
            }, result);
        });
        
        // Добавляем обработчик для сброса формы
        const resetButton = form.querySelector('button[type="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                const resultElement = document.querySelector('#player-index-result');
                if (resultElement) {
                    resultElement.remove();
                }
            });
        }
    } else {
        console.warn('Форма калькулятора индекса эффективности не найдена');
    }
}

// Функция для сохранения расчета индекса эффективности в историю
function savePlayerIndexToHistory(inputs, result) {
    // Проверяем, доступен ли наш модуль хранения
    if (typeof CalculatorHistoryStorage !== 'undefined') {
        CalculatorHistoryStorage.addToHistory('player-index', inputs, result);
    } else {
        // Если модуль хранения недоступен, используем localStorage напрямую
        const history = JSON.parse(localStorage.getItem('basketguide_calculator_history') || '[]');
        
        const newEntry = {
            id: Date.now(),
            calculatorId: 'player-index',
            inputs,
            result,
            timestamp: new Date().toISOString()
        };
        
        // Ограничиваем историю 50 последними записями
        history.unshift(newEntry);
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('basketguide_calculator_history', JSON.stringify(history));
    }
}

// Функция для получения истории расчетов индекса эффективности
function getPlayerIndexHistory() {
    if (typeof CalculatorHistoryStorage !== 'undefined') {
        const allHistory = CalculatorHistoryStorage.getHistory();
        return allHistory.filter(entry => entry.calculatorId === 'player-index');
    } else {
        const history = JSON.parse(localStorage.getItem('basketguide_calculator_history') || '[]');
        return history.filter(entry => entry.calculatorId === 'player-index');
    }
}

// Функция для отображения истории расчетов индекса эффективности
function displayPlayerIndexHistory() {
    const history = getPlayerIndexHistory();
    
    if (history.length === 0) {
        console.log('История расчетов индекса эффективности пуста');
        return;
    }
    
    console.log('История расчетов индекса эффективности:');
    history.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.timestamp}: Очки ${entry.inputs.points}, Подборы ${entry.inputs.rebounds}, Индекс ${entry.result.normalizedEfficiency.toFixed(1)}`);
    });
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ждем немного, чтобы все элементы страницы успели загрузиться
    setTimeout(initPlayerIndexCalculator, 100);
});

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePlayerIndex,
        displayPlayerIndexResult,
        showPerformanceAnalysis,
        showTrainingRecommendations,
        initPlayerIndexCalculator,
        savePlayerIndexToHistory,
        getPlayerIndexHistory,
        displayPlayerIndexHistory
    };
}