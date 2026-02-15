// Калькулятор размера баскетбольного мяча для BasketGuide

// Функция для расчета размера баскетбольного мяча
function calculateBallSize(age, gender = 'any', location = 'any') {
    let size = 7; // по умолчанию для мужчин
    let diameterInches = 29.5; // диаметр в дюймах
    let diameterCm = 75; // диаметр в см
    let circumferenceInches = 29.5; // окружность в дюймах
    let circumferenceCm = 75; // окружность в см
    let weightOunces = 22; // вес в унциях
    let weightGrams = 624; // вес в граммах
    let description = '';
    
    if (age < 8) {
        size = 3;
        diameterInches = 22;
        diameterCm = 56;
        circumferenceInches = 22;
        circumferenceCm = 56;
        weightOunces = 10;
        weightGrams = 280;
        description = 'Размер 3 (22 дюйма) - для детей младше 8 лет';
    } else if (age < 12) {
        size = 5;
        diameterInches = 27.5;
        diameterCm = 70;
        circumferenceInches = 27.5;
        circumferenceCm = 70;
        weightOunces = 17;
        weightGrams = 480;
        description = 'Размер 5 (27.5 дюйма) - для детей до 12 лет';
    } else if (age < 15) {
        if (gender === 'female' || age >= 12) {
            size = 6;
            diameterInches = 28.5;
            diameterCm = 72;
            circumferenceInches = 28.5;
            circumferenceCm = 72;
            weightOunces = 18;
            weightGrams = 510;
            description = 'Размер 6 (28.5 дюйма) - для девочек до 15 лет, женщин и юношей 12-15 лет';
        } else {
            size = 5;
            diameterInches = 27.5;
            diameterCm = 70;
            circumferenceInches = 27.5;
            circumferenceCm = 70;
            weightOunces = 17;
            weightGrams = 480;
            description = 'Размер 5 (27.5 дюйма) - для мальчиков до 12 лет';
        }
    } else {
        if (gender === 'female' || age < 16) {
            size = 6;
            diameterInches = 28.5;
            diameterCm = 72;
            circumferenceInches = 28.5;
            circumferenceCm = 72;
            weightOunces = 18;
            weightGrams = 510;
            description = 'Размер 6 (28.5 дюйма) - для женщин и юношей 15-16 лет';
        } else {
            size = 7;
            diameterInches = 29.5;
            diameterCm = 75;
            circumferenceInches = 29.5;
            circumferenceCm = 75;
            weightOunces = 22;
            weightGrams = 624;
            description = 'Размер 7 (29.5 дюйма) - стандартный мужской мяч';
        }
    }
    
    return {
        size,
        diameterInches,
        diameterCm,
        circumferenceInches,
        circumferenceCm,
        weightOunces,
        weightGrams,
        description,
        age,
        gender,
        location
    };
}

// Функция для отображения результата расчета размера мяча
function displayBallSizeResult(result) {
    const resultContainer = document.querySelector('#ball-size-result') || document.createElement('div');
    resultContainer.id = 'ball-size-result';
    resultContainer.className = 'result-container';
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <h3>Рекомендуемый размер мяча: <span class="result-value">${result.size}</span></h3>
        </div>
        <div class="result-details">
            <div class="detail-row">
                <span class="detail-label">Диаметр:</span>
                <span class="detail-value">${result.diameterInches} дюймов (${result.diameterCm} см)</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Окружность:</span>
                <span class="detail-value">${result.circumferenceInches} дюймов (${result.circumferenceCm} см)</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Вес:</span>
                <span class="detail-value">${result.weightOunces} унций (${result.weightGrams} г)</span>
            </div>
        </div>
        <div class="result-description">
            <p>${result.description}</p>
        </div>
        <div class="result-context">
            <p>Рассчитано для: ${result.age} лет, ${result.gender === 'male' ? 'мужской' : result.gender === 'female' ? 'женский' : 'любой'} пол, ${result.location === 'indoor' ? 'зал' : result.location === 'outdoor' ? 'улица' : 'любые условия'}</p>
        </div>
        <div class="result-actions">
            <button class="btn btn-secondary" onclick="showRelatedExercises('${result.size}')">Упражнения с мячом</button>
            <button class="btn btn-secondary" onclick="showRelatedRules()">Связанные правила</button>
        </div>
    `;
    
    // Если контейнер был создан заново, добавляем его на страницу
    if (!document.querySelector('#ball-size-result')) {
        const form = document.querySelector('#ball-size-calculator') || document.body;
        form.appendChild(resultContainer);
    }
}

// Функция для отображения упражнений, связанных с размером мяча
function showRelatedExercises(ballSize) {
    // В реальном приложении здесь будет загрузка и отображение упражнений
    alert(`Упражнения, подходящие для мяча размера ${ballSize}`);
    
    // Пример: перенаправление на страницу с упражнениями
    // window.location.hash = `/exercises?ballSize=${ballSize}`;
}

// Функция для отображения связанных правил
function showRelatedRules() {
    // В реальном приложении здесь будет загрузка и отображение связанных правил
    alert('Связанные правила баскетбола');
    
    // Пример: перенаправление на страницу с правилами
    // window.location.hash = '/rules/traveling'; // пример с пробежкой
}

// Функция для инициализации калькулятора размера мяча
function initBallSizeCalculator() {
    const form = document.querySelector('#ball-size-calculator');
    
    if (form) {
        // Добавляем обработчик события отправки формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения из формы
            const ageInput = form.querySelector('input[name="age"]');
            const genderSelect = form.querySelector('select[name="gender"]');
            const locationSelect = form.querySelector('select[name="location"]');
            
            const age = parseInt(ageInput.value);
            const gender = genderSelect ? genderSelect.value : 'any';
            const location = locationSelect ? locationSelect.value : 'any';
            
            // Проверяем валидность введенных данных
            if (isNaN(age) || age < 0 || age > 120) {
                alert('Пожалуйста, введите корректный возраст (0-120 лет)');
                return;
            }
            
            // Выполняем расчет
            const result = calculateBallSize(age, gender, location);
            
            // Отображаем результат
            displayBallSizeResult(result);
            
            // Сохраняем результат в историю
            saveCalculationToHistory('ball-size', { age, gender, location }, result);
        });
        
        // Добавляем обработчик для сброса формы
        const resetButton = form.querySelector('button[type="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                document.querySelector('#ball-size-result').remove();
            });
        }
    } else {
        console.warn('Форма калькулятора размера мяча не найдена');
    }
}

// Функция для сохранения расчета в историю
function saveCalculationToHistory(calculatorId, inputs, result) {
    // Проверяем, доступен ли наш модуль хранения
    if (typeof CalculatorHistoryStorage !== 'undefined') {
        CalculatorHistoryStorage.addToHistory(calculatorId, inputs, result);
    } else {
        // Если модуль хранения недоступен, используем localStorage напрямую
        const history = JSON.parse(localStorage.getItem('basketguide_calculator_history') || '[]');
        
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
        
        localStorage.setItem('basketguide_calculator_history', JSON.stringify(history));
    }
}

// Функция для получения истории расчетов размера мяча
function getBallSizeHistory() {
    if (typeof CalculatorHistoryStorage !== 'undefined') {
        const allHistory = CalculatorHistoryStorage.getHistory();
        return allHistory.filter(entry => entry.calculatorId === 'ball-size');
    } else {
        const history = JSON.parse(localStorage.getItem('basketguide_calculator_history') || '[]');
        return history.filter(entry => entry.calculatorId === 'ball-size');
    }
}

// Функция для отображения истории расчетов
function displayBallSizeHistory() {
    const history = getBallSizeHistory();
    
    if (history.length === 0) {
        console.log('История расчетов пуста');
        return;
    }
    
    console.log('История расчетов размера мяча:');
    history.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.timestamp}: Возраст ${entry.inputs.age}, Размер ${entry.result.size}`);
    });
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ждем немного, чтобы все элементы страницы успели загрузиться
    setTimeout(initBallSizeCalculator, 100);
});

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateBallSize,
        displayBallSizeResult,
        showRelatedExercises,
        showRelatedRules,
        initBallSizeCalculator,
        saveCalculationToHistory,
        getBallSizeHistory,
        displayBallSizeHistory
    };
}