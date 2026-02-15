// Калькулятор позиции игрока в баскетболе для BasketGuide

// Функция для определения подходящей позиции игрока
function calculatePlayerPosition(height, speed, jumping, experience, shooting, defense) {
    // Проверяем и устанавливаем значения по умолчанию
    height = height || 0;
    speed = speed || 5; // по шкале от 1 до 10
    jumping = jumping || 5; // по шкале от 1 до 10
    experience = experience || 5; // по шкале от 1 до 10
    shooting = shooting || 5; // по шкале от 1 до 10
    defense = defense || 5; // по шкале от 1 до 10
    
    let position = 'Универсал';
    let positionCode = 'UN';
    let positionDescription = 'Игрок с универсальными навыками, может эффективно действовать на разных позициях';
    let roleRecommendations = [];
    let skillRequirements = [];
    
    // Определение позиции на основе роста и других характеристик
    if (height < 180) {
        // Низкорослые игроки
        if (speed >= 7 && shooting >= 6) {
            position = 'Разыгрывающий защитник';
            positionCode = 'PG';
            positionDescription = 'Ключевой организатор атак, должен обладать отличным зрением площадки, навыками передачи и управления мячом';
            roleRecommendations = ['Организация атак', 'Плеймейкинг', 'Трехочковые броски'];
            skillRequirements = ['Передачи', 'Ведение мяча', 'Скорость', 'Тактическое мышление'];
        } else if (speed >= 6) {
            position = 'Атакующий защитник';
            positionCode = 'SG';
            positionDescription = 'Игрок, специализирующийся на атакующих действиях, часто является вторым разыгрывающим';
            roleRecommendations = ['Периметровая атака', 'Защита', 'Броски с дистанции'];
            skillRequirements = ['Бросок', 'Защита', 'Скорость', 'Финиш'];
        } else {
            position = 'Скоростной защитник';
            positionCode = 'SPG';
            positionDescription = 'Игрок, специализирующийся на оборонительных действиях и быстрых контратаках';
            roleRecommendations = ['Перехваты', 'Контратаки', 'Блоки'];
            skillRequirements = ['Скорость', 'Реакция', 'Защита', 'Ловкость'];
        }
    } else if (height < 195) {
        // Игроки среднего роста
        if (jumping >= 7 && speed >= 6 && shooting >= 6) {
            position = 'Атакующий защитник';
            positionCode = 'SG';
            positionDescription = 'Универсальный периметровый игрок, способный атаковать с разных позиций';
            roleRecommendations = ['Атака с фланга', 'Трехочковые броски', 'Защита'];
            skillRequirements = ['Бросок', 'Ведение', 'Защита', 'Подвижность'];
        } else if (jumping >= 6 && shooting >= 7) {
            position = 'Легкий форвард';
            positionCode = 'SF';
            positionDescription = 'Переходная фигура между защитниками и форвардами, универсальный scorer';
            roleRecommendations = ['Атака в движении', 'Броски', 'Подборы'];
            skillRequirements = ['Бросок', 'Подвижность', 'Подбор', 'Защита'];
        } else if (defense >= 7) {
            position = 'Переходный фланг';
            positionCode = 'GSF';
            positionDescription = 'Игрок, специализирующийся на противодействии периметровым атакующим';
            roleRecommendations = ['Персональная защита', 'Трехочковая защита', 'Перехваты'];
            skillRequirements = ['Реакция', 'Скорость', 'Интеллект', 'Подбор'];
        } else {
            position = 'Малый форвард';
            positionCode = 'PF';
            positionDescription = 'Универсальный фланг, способный действовать как в зоне, так и на периметре';
            roleRecommendations = ['Финиш в зоне', 'Средние броски', 'Подборы'];
            skillRequirements = ['Подбор', 'Финиш', 'Защита', 'Средний бросок'];
        }
    } else {
        // Высокие игроки
        if (jumping >= 8 && speed >= 6 && shooting >= 6) {
            position = 'Тяжелый форвард';
            positionCode = 'PF';
            positionDescription = 'Мобильный центровой, способный действовать на всей площадке';
            roleRecommendations = ['Подвижность в зоне', 'Средние броски', 'Блоки'];
            skillRequirements = ['Подвижность', 'Средний бросок', 'Блок', 'Подбор'];
        } else if (jumping >= 7 && shooting >= 7) {
            position = 'Растянутый четырех';
            positionCode = 'STF';
            positionDescription = 'Высокий игрок с навыками периметровой игры';
            roleRecommendations = ['Трехочковые броски', 'Пас в движении', 'Подборы'];
            skillRequirements = ['Трехочковый бросок', 'Пас', 'Подбор', 'Защита'];
        } else if (defense >= 7) {
            position = 'Защитный центр';
            positionCode = 'DNC';
            positionDescription = 'Игрок, специализирующийся на защите корзины и подборах';
            roleRecommendations = ['Блоки', 'Подборы в защите', 'Защита в зоне'];
            skillRequirements = ['Блок', 'Подбор', 'Защита', 'Позиционирование'];
        } else {
            position = 'Центровой';
            positionCode = 'C';
            positionDescription = 'Классический центровой, доминирующий в зоне под кольцом';
            roleRecommendations = ['Игра под кольцом', 'Подборы', 'Блоки'];
            skillRequirements = ['Финиш под кольцом', 'Подбор', 'Блок', 'Позиционирование'];
        }
    }
    
    // Расчет дополнительных метрик
    const versatilityScore = Math.round((speed + jumping + experience + shooting + defense) / 5);
    const physicalAdvantage = height >= 195 ? 'Высокий' : height >= 185 ? 'Выше среднего' : height >= 180 ? 'Средний' : 'Ниже среднего';
    
    return {
        position,
        positionCode,
        positionDescription,
        roleRecommendations,
        skillRequirements,
        versatilityScore,
        physicalAdvantage,
        height,
        speed,
        jumping,
        experience,
        shooting,
        defense
    };
}

// Функция для отображения результата расчета позиции игрока
function displayPlayerPositionResult(result) {
    const resultContainer = document.querySelector('#player-position-result') || document.createElement('div');
    resultContainer.id = 'player-position-result';
    resultContainer.className = 'result-container';
    
    // Преобразуем массивы в строки для отображения
    const rolesStr = result.roleRecommendations.join(', ');
    const skillsStr = result.skillRequirements.join(', ');
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <h3>Ваша рекомендуемая позиция: <span class="result-value">${result.position} (${result.positionCode})</span></h3>
        </div>
        <div class="result-description">
            <p>${result.positionDescription}</p>
        </div>
        <div class="result-details">
            <div class="detail-row">
                <span class="detail-label">Физические данные:</span>
                <span class="detail-value">Рост: ${result.height} см, Физическое преимущество: ${result.physicalAdvantage}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Универсальность:</span>
                <span class="detail-value">${result.versatilityScore}/10</span>
            </div>
        </div>
        <div class="result-recommendations">
            <h4>Рекомендуемые роли:</h4>
            <p>${rolesStr}</p>
        </div>
        <div class="result-skills">
            <h4>Ключевые навыки для развития:</h4>
            <p>${skillsStr}</p>
        </div>
        <div class="result-breakdown">
            <h4>Разбивка по навыкам:</h4>
            <div class="skill-bars">
                <div class="skill-bar">
                    <span class="skill-name">Скорость (${result.speed}/10)</span>
                    <div class="skill-progress">
                        <div class="skill-fill" style="width: ${result.speed * 10}%"></div>
                    </div>
                </div>
                <div class="skill-bar">
                    <span class="skill-name">Прыгучесть (${result.jumping}/10)</span>
                    <div class="skill-progress">
                        <div class="skill-fill" style="width: ${result.jumping * 10}%"></div>
                    </div>
                </div>
                <div class="skill-bar">
                    <span class="skill-name">Опыт (${result.experience}/10)</span>
                    <div class="skill-progress">
                        <div class="skill-fill" style="width: ${result.experience * 10}%"></div>
                    </div>
                </div>
                <div class="skill-bar">
                    <span class="skill-name">Бросок (${result.shooting}/10)</span>
                    <div class="skill-progress">
                        <div class="skill-fill" style="width: ${result.shooting * 10}%"></div>
                    </div>
                </div>
                <div class="skill-bar">
                    <span class="skill-name">Защита (${result.defense}/10)</span>
                    <div class="skill-progress">
                        <div class="skill-fill" style="width: ${result.defense * 10}%"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="result-actions">
            <button class="btn btn-secondary" onclick="showPositionTraining('${result.positionCode}')">Тренировки для позиции</button>
            <button class="btn btn-secondary" onclick="showRelatedPositions('${result.positionCode}')">Похожие позиции</button>
        </div>
    `;
    
    // Если контейнер был создан заново, добавляем его на страницу
    if (!document.querySelector('#player-position-result')) {
        const form = document.querySelector('#player-position-calculator') || document.body;
        form.appendChild(resultContainer);
    }
}

// Функция для отображения тренировок для определенной позиции
function showPositionTraining(positionCode) {
    let trainingPlan = '';
    
    switch(positionCode) {
        case 'PG':
            trainingPlan = 'Тренировки для разыгрывающего защитника: плеймейкинг, передачи, управление мячом, защита.';
            break;
        case 'SG':
            trainingPlan = 'Тренировки для атакующего защитника: броски, финиш, защита, ведение.';
            break;
        case 'SF':
            trainingPlan = 'Тренировки для легкого форварда: универсальность, броски, подборы, защита.';
            break;
        case 'PF':
            trainingPlan = 'Тренировки для тяжелого форварда: подвижность, подборы, защита, средние броски.';
            break;
        case 'C':
            trainingPlan = 'Тренировки для центрового: игра под кольцом, подборы, блоки, защита.';
            break;
        default:
            trainingPlan = 'Универсальные тренировки для развития всех навыков.';
    }
    
    alert(trainingPlan);
    
    // В реальном приложении здесь будет перенаправление на страницу с тренировками
    // window.location.hash = `/training-plans/${positionCode.toLowerCase()}`;
}

// Функция для отображения похожих позиций
function showRelatedPositions(positionCode) {
    let relatedPositions = '';
    
    switch(positionCode) {
        case 'PG':
            relatedPositions = 'Похожие позиции: SG (атакующий защитник), SPG (скоростной защитник)';
            break;
        case 'SG':
            relatedPositions = 'Похожие позиции: PG (разыгрывающий защитник), SF (легкий форвард)';
            break;
        case 'SF':
            relatedPositions = 'Похожие позиции: SG (атакующий защитник), PF (тяжелый форвард)';
            break;
        case 'PF':
            relatedPositions = 'Похожие позиции: SF (легкий форвард), C (центровой)';
            break;
        case 'C':
            relatedPositions = 'Похожие позиции: PF (тяжелый форвард), DNC (защитный центр)';
            break;
        default:
            relatedPositions = 'Универсальные навыки подходят для многих позиций.';
    }
    
    alert(relatedPositions);
    
    // В реальном приложении здесь будет отображение информации о похожих позициях
    // window.location.hash = `/positions/related/${positionCode}`;
}

// Функция для инициализации калькулятора позиции игрока
function initPlayerPositionCalculator() {
    const form = document.querySelector('#player-position-calculator');
    
    if (form) {
        // Добавляем обработчик события отправки формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения из формы
            const heightInput = form.querySelector('input[name="height"]');
            const speedInput = form.querySelector('input[name="speed"]');
            const jumpingInput = form.querySelector('input[name="jumping"]');
            const experienceInput = form.querySelector('input[name="experience"]');
            const shootingInput = form.querySelector('input[name="shooting"]');
            const defenseInput = form.querySelector('input[name="defense"]');
            
            const height = parseInt(heightInput.value);
            const speed = parseInt(speedInput.value);
            const jumping = parseInt(jumpingInput.value);
            const experience = parseInt(experienceInput.value);
            const shooting = parseInt(shootingInput.value);
            const defense = parseInt(defenseInput.value);
            
            // Проверяем валидность введенных данных
            if (isNaN(height) || height < 100 || height > 250) {
                alert('Пожалуйста, введите корректный рост (100-250 см)');
                return;
            }
            
            if (isNaN(speed) || speed < 1 || speed > 10) {
                alert('Пожалуйста, введите корректное значение скорости (1-10)');
                return;
            }
            
            if (isNaN(jumping) || jumping < 1 || jumping > 10) {
                alert('Пожалуйста, введите корректное значение прыгучести (1-10)');
                return;
            }
            
            if (isNaN(experience) || experience < 1 || experience > 10) {
                alert('Пожалуйста, введите корректное значение опыта (1-10)');
                return;
            }
            
            if (isNaN(shooting) || shooting < 1 || shooting > 10) {
                alert('Пожалуйста, введите корректное значение броска (1-10)');
                return;
            }
            
            if (isNaN(defense) || defense < 1 || defense > 10) {
                alert('Пожалуйста, введите корректное значение защиты (1-10)');
                return;
            }
            
            // Выполняем расчет
            const result = calculatePlayerPosition(height, speed, jumping, experience, shooting, defense);
            
            // Отображаем результат
            displayPlayerPositionResult(result);
            
            // Сохраняем результат в историю
            savePlayerPositionToHistory({
                height, speed, jumping, experience, shooting, defense
            }, result);
        });
        
        // Добавляем обработчик для сброса формы
        const resetButton = form.querySelector('button[type="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                const resultElement = document.querySelector('#player-position-result');
                if (resultElement) {
                    resultElement.remove();
                }
            });
        }
    } else {
        console.warn('Форма калькулятора позиции игрока не найдена');
    }
}

// Функция для сохранения расчета позиции игрока в историю
function savePlayerPositionToHistory(inputs, result) {
    // Проверяем, доступен ли наш модуль хранения
    if (typeof CalculatorHistoryStorage !== 'undefined') {
        CalculatorHistoryStorage.addToHistory('player-position', inputs, result);
    } else {
        // Если модуль хранения недоступен, используем localStorage напрямую
        const history = JSON.parse(localStorage.getItem('basketguide_calculator_history') || '[]');
        
        const newEntry = {
            id: Date.now(),
            calculatorId: 'player-position',
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

// Функция для получения истории расчетов позиции игрока
function getPlayerPositionHistory() {
    if (typeof CalculatorHistoryStorage !== 'undefined') {
        const allHistory = CalculatorHistoryStorage.getHistory();
        return allHistory.filter(entry => entry.calculatorId === 'player-position');
    } else {
        const history = JSON.parse(localStorage.getItem('basketguide_calculator_history') || '[]');
        return history.filter(entry => entry.calculatorId === 'player-position');
    }
}

// Функция для отображения истории расчетов позиции игрока
function displayPlayerPositionHistory() {
    const history = getPlayerPositionHistory();
    
    if (history.length === 0) {
        console.log('История расчетов позиции игрока пуста');
        return;
    }
    
    console.log('История расчетов позиции игрока:');
    history.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.timestamp}: Рост ${entry.inputs.height} см, Позиция ${entry.result.position}`);
    });
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ждем немного, чтобы все элементы страницы успели загрузиться
    setTimeout(initPlayerPositionCalculator, 100);
});

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePlayerPosition,
        displayPlayerPositionResult,
        showPositionTraining,
        showRelatedPositions,
        initPlayerPositionCalculator,
        savePlayerPositionToHistory,
        getPlayerPositionHistory,
        displayPlayerPositionHistory
    };
}