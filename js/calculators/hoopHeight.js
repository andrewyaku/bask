// Калькулятор высоты баскетбольного кольца для BasketGuide

// Функция для расчета высоты баскетбольного кольца
function calculateHoopHeight(age, league = 'recreational', courtType = 'any') {
    let heightFeet = 10; // по умолчанию 10 футов
    let heightInches = heightFeet * 12; // в дюймах
    let heightMeters = 3.05; // в метрах
    let officialRule = 'Стандартная высота для взрослых и профессиональных лиг';
    let contextNote = '';
    
    if (age < 8) {
        heightFeet = 8;
        heightInches = 96;
        heightMeters = 2.44;
        officialRule = 'Для детей до 7 лет';
        contextNote = 'Рекомендуется для развития координации и уверенности у самых маленьких баскетболистов';
    } else if (age < 11) {
        heightFeet = 9;
        heightInches = 108;
        heightMeters = 2.74;
        officialRule = 'Для детей 8-10 лет';
        contextNote = 'Часто используется в детских лигах для развития техники броска';
    } else if (age < 14) {
        heightFeet = 9;
        heightInches = 108;
        heightMeters = 2.74;
        officialRule = 'Для подростков до 13 лет';
        contextNote = 'Применяется в юношеских лигах, особенно для девочек до 15 лет';
    } else if (age < 16 && league === 'youth') {
        if (age < 15) {
            heightFeet = 9.5;
            heightInches = 114;
            heightMeters = 2.90;
            officialRule = 'Для подростков 14-15 лет';
            contextNote = 'Промежуточная высота перед переходом к стандартной';
        } else {
            heightFeet = 10;
            heightInches = 120;
            heightMeters = 3.05;
            officialRule = 'Стандартная высота для старших подростков';
            contextNote = 'Стандартная высота применяется в большинстве старших юношеских лиг';
        }
    } else {
        // Для взрослых и старших возрастов
        if (league === 'nba' || league === 'fiba') {
            heightFeet = 10;
            heightInches = 120;
            heightMeters = 3.05;
            officialRule = 'Стандартная высота по правилам ' + (league === 'nba' ? 'NBA' : 'FIBA');
            contextNote = 'Одинаковая для всех профессиональных и международных соревнований';
        } else {
            heightFeet = 10;
            heightInches = 120;
            heightMeters = 3.05;
            officialRule = 'Стандартная высота для взрослых';
            contextNote = 'Стандартная высота применяется во взрослых лигах и общественных площадках';
        }
    }
    
    // Адаптация для разных типов площадок
    if (courtType === 'street' || courtType === 'outdoor') {
        // На уличных площадках может быть небольшая вариация
        contextNote += ' На уличных площадках высота может незначительно варьироваться из-за установки на разные конструкции.';
    }
    
    return {
        heightFeet,
        heightInches,
        heightMeters,
        officialRule,
        contextNote,
        age,
        league,
        courtType
    };
}

// Функция для отображения результата расчета высоты кольца
function displayHoopHeightResult(result) {
    const resultContainer = document.querySelector('#hoop-height-result') || document.createElement('div');
    resultContainer.id = 'hoop-height-result';
    resultContainer.className = 'result-container';
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <h3>Рекомендуемая высота кольца: <span class="result-value">${result.heightMeters} м</span></h3>
        </div>
        <div class="result-details">
            <div class="detail-row">
                <span class="detail-label">Высота в футах:</span>
                <span class="detail-value">${result.heightFeet} футов (${result.heightInches} дюймов)</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Высота в метрах:</span>
                <span class="detail-value">${result.heightMeters} м</span>
            </div>
        </div>
        <div class="result-official-rule">
            <h4>Официальное правило:</h4>
            <p>${result.officialRule}</p>
        </div>
        <div class="result-context">
            <h4>Контекст:</h4>
            <p>${result.contextNote}</p>
        </div>
        <div class="result-info">
            <h4>Почему важна правильная высота:</h4>
            <ul>
                <li>Формирование правильной техники броска</li>
                <li>Развитие мышечной памяти</li>
                <li>Соблюдение правил при участии в соревнованиях</li>
                <li>Безопасность при игре</li>
            </ul>
        </div>
        <div class="result-actions">
            <button class="btn btn-secondary" onclick="showRelatedRulesHoop()">Связанные правила</button>
            <button class="btn btn-secondary" onclick="showCourtSetupTips()">Советы по установке</button>
        </div>
    `;
    
    // Если контейнер был создан заново, добавляем его на страницу
    if (!document.querySelector('#hoop-height-result')) {
        const form = document.querySelector('#hoop-height-calculator') || document.body;
        form.appendChild(resultContainer);
    }
}

// Функция для отображения связанных правил
function showRelatedRulesHoop() {
    alert('Связанные правила: Пробежка, Подбор мяча, Трехсекундная зона');
    
    // В реальном приложении здесь будет загрузка и отображение связанных правил
    // window.location.hash = '/rules/traveling'; // пример с пробежкой
}

// Функция для отображения советов по установке кольца
function showCourtSetupTips() {
    alert('Советы по установке баскетбольного кольца');
    
    // В реальном приложении здесь будет отображение информации о установке
    // window.location.hash = '/setup-tips';
}

// Функция для инициализации калькулятора высоты кольца
function initHoopHeightCalculator() {
    const form = document.querySelector('#hoop-height-calculator');
    
    if (form) {
        // Добавляем обработчик события отправки формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения из формы
            const ageInput = form.querySelector('input[name="age"]');
            const leagueSelect = form.querySelector('select[name="league"]');
            const courtTypeSelect = form.querySelector('select[name="courtType"]');
            
            const age = parseInt(ageInput.value);
            const league = leagueSelect ? leagueSelect.value : 'recreational';
            const courtType = courtTypeSelect ? courtTypeSelect.value : 'any';
            
            // Проверяем валидность введенных данных
            if (isNaN(age) || age < 0 || age > 120) {
                alert('Пожалуйста, введите корректный возраст (0-120 лет)');
                return;
            }
            
            // Выполняем расчет
            const result = calculateHoopHeight(age, league, courtType);
            
            // Отображаем результат
            displayHoopHeightResult(result);
            
            // Сохраняем результат в историю
            saveHoopHeightToHistory({ age, league, courtType }, result);
        });
        
        // Добавляем обработчик для сброса формы
        const resetButton = form.querySelector('button[type="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                const resultElement = document.querySelector('#hoop-height-result');
                if (resultElement) {
                    resultElement.remove();
                }
            });
        }
    } else {
        console.warn('Форма калькулятора высоты кольца не найдена');
    }
}

// Функция для сохранения расчета высоты кольца в историю
function saveHoopHeightToHistory(inputs, result) {
    // Проверяем, доступен ли наш модуль хранения
    if (typeof CalculatorHistoryStorage !== 'undefined') {
        CalculatorHistoryStorage.addToHistory('hoop-height', inputs, result);
    } else {
        // Если модуль хранения недоступен, используем localStorage напрямую
        const history = JSON.parse(localStorage.getItem('basketguide_calculator_history') || '[]');
        
        const newEntry = {
            id: Date.now(),
            calculatorId: 'hoop-height',
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

// Функция для получения истории расчетов высоты кольца
function getHoopHeightHistory() {
    if (typeof CalculatorHistoryStorage !== 'undefined') {
        const allHistory = CalculatorHistoryStorage.getHistory();
        return allHistory.filter(entry => entry.calculatorId === 'hoop-height');
    } else {
        const history = JSON.parse(localStorage.getItem('basketguide_calculator_history') || '[]');
        return history.filter(entry => entry.calculatorId === 'hoop-height');
    }
}

// Функция для отображения истории расчетов высоты кольца
function displayHoopHeightHistory() {
    const history = getHoopHeightHistory();
    
    if (history.length === 0) {
        console.log('История расчетов высоты кольца пуста');
        return;
    }
    
    console.log('История расчетов высоты кольца:');
    history.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.timestamp}: Возраст ${entry.inputs.age}, Высота ${entry.result.heightMeters} м`);
    });
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ждем немного, чтобы все элементы страницы успели загрузиться
    setTimeout(initHoopHeightCalculator, 100);
});

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateHoopHeight,
        displayHoopHeightResult,
        showRelatedRulesHoop,
        showCourtSetupTips,
        initHoopHeightCalculator,
        saveHoopHeightToHistory,
        getHoopHeightHistory,
        displayHoopHeightHistory
    };
}