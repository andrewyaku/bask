// Основной JavaScript файл для BasketGuide
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация приложения
    initApp();
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация калькуляторов (если на странице есть калькуляторы)
    initCalculators();
    
    // Инициализация других компонентов
    initComponents();
});

// Инициализация приложения
function initApp() {
    console.log('BasketGuide приложение запущено');
    
    // Загрузка данных
    loadData();
    
    // Инициализация маршрутизации (если используется SPA)
    initRouting();
    
    // Проверка и обработка текущего URL при загрузке
    handleInitialRoute();
    
    // Инициализация навигации по умолчанию, если не используется SPA для этой страницы
    initDefaultNavigation();
}

// Инициализация навигации по умолчанию для обычных HTML-страниц
function initDefaultNavigation() {
    // Проверяем, есть ли на странице элементы навигации
    const navLinks = document.querySelectorAll('nav a[href^="/"]');
    
    // Устанавливаем активный элемент навигации для текущей страницы
    updateActiveNavigation(window.location.pathname);
    
    // Если на странице есть навигационные ссылки, проверяем, нужно ли использовать SPA
    if (navLinks.length > 0) {
        // Для всех страниц устанавливаем обработчики, но с возможностью обычного перехода
        navLinks.forEach(link => {
            // Не перехватываем ссылки с определенными классами или атрибутами
            if (!link.classList.contains('external') && 
                !link.classList.contains('no-spa') && 
                !link.hasAttribute('target')) {
                
                link.addEventListener('click', function(e) {
                    // Для SPA-ссылок предотвращаем стандартное поведение
                    if (this.hostname === window.location.hostname) {
                        e.preventDefault();
                        const route = this.getAttribute('href');
                        
                        // Если это внутренняя ссылка, используем SPA-навигацию
                        if (route.startsWith('/')) {
                            navigateTo(route);
                        } else {
                            // Для остальных ссылок используем стандартный переход
                            window.location.href = route;
                        }
                    }
                });
            }
        });
    }
}

// Обработка начального маршрута при загрузке страницы
function handleInitialRoute() {
    const path = window.location.pathname;
    
    // Определяем, является ли текущая страница отдельной HTML-страницей
    // Если текущий путь отличается от '/', значит мы на отдельной странице
    if (path !== '/' && path !== '/index.html') {
        // Это отдельная HTML-страница, не используем SPA-навигацию
        console.log(`Загрузка отдельной страницы: ${path}`);
        // Просто устанавливаем активный элемент навигации
        updateActiveNavigation(path);
        return;
    }
    
    // Если находимся на главной странице, проверяем, нужно ли загружать внутренний контент
    const internalPages = ['/calculators/', '/rules/', '/challenges/', '/blog/', '/about/', '/contact/', '/plans/'];
    const isInternalPage = internalPages.some(page => path.startsWith(page));
    
    if (isInternalPage) {
        loadPageContent(path);
    }
}

// Инициализация навигации
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Устанавливаем активный элемент навигации при загрузке
    updateActiveNavigation(window.location.pathname);
}

// Инициализация калькуляторов
function initCalculators() {
    // Проверяем, есть ли на странице калькуляторы
    const calculatorForms = document.querySelectorAll('.calculator-form');
    
    calculatorForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCalculatorSubmit(form);
        });
    });
}

// Обработка отправки формы калькулятора
function handleCalculatorSubmit(form) {
    const calculatorId = form.dataset.calculatorId;
    
    switch(calculatorId) {
        case 'ball-size':
            calculateBallSize(form);
            break;
        case 'hoop-height':
            calculateHoopHeight(form);
            break;
        case 'player-position':
            calculatePlayerPosition(form);
            break;
        case 'jump-height':
            calculateJumpHeight(form);
            break;
        case 'player-index':
            calculatePlayerIndex(form);
            break;
        default:
            console.warn(`Неизвестный калькулятор: ${calculatorId}`);
    }
}

// Функция для расчета размера баскетбольного мяча
function calculateBallSize(form) {
    const age = parseInt(form.elements['age'].value);
    const gender = form.elements['gender'] ? form.elements['gender'].value : 'any';
    const location = form.elements['location'] ? form.elements['location'].value : 'any';
    
    let size = 7; // по умолчанию для мужчин
    let explanation = '';
    
    if (age < 8) {
        size = 3;
        explanation = 'Размер 3 (22 дюйма) - для детей младше 8 лет';
    } else if (age < 12) {
        size = (gender === 'female') ? 5 : 5;
        explanation = 'Размер 5 (27.5 дюйма) - для детей до 12 лет';
    } else if (age < 15 && gender === 'female') {
        size = 6;
        explanation = 'Размер 6 (28.5 дюйма) - для девочек до 15 лет и женщин';
    } else {
        size = (gender === 'female') ? 6 : 7;
        explanation = 'Размер 6 (28.5 дюйма) для женщин или 7 (29.5 дюйма) для мужчин';
    }
    
    displayResult(form, size, explanation);
}

// Функция для расчета высоты кольца
function calculateHoopHeight(form) {
    const age = parseInt(form.elements['age'].value);
    const league = form.elements['league'] ? form.elements['league'].value : 'recreational';
    
    let height = 10 * 12; // по умолчанию 10 футов в дюймах
    let heightMeters = 3.05; // в метрах
    let explanation = '';
    
    if (age < 8) {
        height = 8 * 12; // 8 футов
        heightMeters = 2.44;
        explanation = 'Для детей до 8 лет рекомендуется высота 8 футов (2.44 м)';
    } else if (age < 11) {
        height = 9 * 12; // 9 футов
        heightMeters = 2.74;
        explanation = 'Для детей 8-11 лет рекомендуется высота 9 футов (2.74 м)';
    } else if (age < 14) {
        height = 9 * 12; // 9 футов для юниоров
        heightMeters = 2.74;
        explanation = 'Для подростков до 14 лет рекомендуется высота 9 футов (2.74 м)';
    } else {
        explanation = 'Стандартная высота баскетбольного кольца - 10 футов (3.05 м)';
    }
    
    displayResult(form, `${heightMeters} м`, explanation);
}

// Функция для определения позиции игрока
function calculatePlayerPosition(form) {
    const height = parseInt(form.elements['height'].value) || 0;
    const speed = parseInt(form.elements['speed'].value) || 5; // по шкале от 1 до 10
    const jumping = parseInt(form.elements['jumping'].value) || 5; // по шкале от 1 до 10
    const experience = parseInt(form.elements['experience'].value) || 5; // по шкале от 1 до 10
    
    let position = 'Универсал';
    let explanation = '';
    
    if (height < 180) {
        if (speed >= 7) {
            position = 'Разыгрывающий защитник (PG)';
            explanation = 'Ваша скорость и ловкость подходят для позиции разыгрывающего защитника.';
        } else {
            position = 'Скоростной защитник';
            explanation = 'Ваша компактная комплектация позволяет быть эффективным в защите и быстрых атаках.';
        }
    } else if (height < 195) {
        if (jumping >= 7 && speed >= 6) {
            position = 'Атакующий защитник (SG)';
            explanation = 'Ваша комбинация роста, скорости и подвижности идеальна для атакующего защитника.';
        } else if (jumping >= 6) {
            position = 'Легкий форвард (SF)';
            explanation = 'Ваш рост и прыгучесть позволяют эффективно действовать на фланге.';
        } else {
            position = 'Малый форвард (PF)';
            explanation = 'Ваша универсальность позволяет играть как на фланге, так и в центре.';
        }
    } else {
        if (jumping >= 7) {
            position = 'Тяжелый форвард (PF)';
            explanation = 'Ваш рост и прыгучесть позволяют быть эффективным как внутри, так и с периметра.';
        } else {
            position = 'Центровой (C)';
            explanation = 'Ваш рост позволяет доминировать в зоне под кольцом.';
        }
    }
    
    displayResult(form, position, explanation);
}

// Функция для расчета вертикального прыжка
function calculateJumpHeight(form) {
    const age = parseInt(form.elements['age'].value);
    const currentJump = parseInt(form.elements['currentJump'].value) || 0;
    const gender = form.elements['gender'] ? form.elements['gender'].value : 'any';
    
    let potentialJump = currentJump;
    let explanation = '';
    
    // Простая экстраполяция потенциала
    if (age < 25) {
        potentialJump = Math.min(120, Math.floor(currentJump * 1.3)); // потенциал роста
        explanation = `В вашем возрасте (${age}) есть большой потенциал для улучшения прыжка. При правильной подготовке вы можете достичь ${potentialJump} см.`;
    } else if (age < 35) {
        potentialJump = Math.min(110, Math.floor(currentJump * 1.15));
        explanation = `В вашем возрасте (${age}) можно улучшить прыжок до ${potentialJump} см при регулярных тренировках.`;
    } else {
        potentialJump = Math.min(100, Math.floor(currentJump * 1.1));
        explanation = `В вашем возрасте (${age}) можно улучшить прыжок до ${potentialJump} см при правильной программе тренировок.`;
    }
    
    displayResult(form, `${potentialJump} см`, explanation);
}

// Функция для расчета индекса эффективности игрока
function calculatePlayerIndex(form) {
    const points = parseInt(form.elements['points'].value) || 0;
    const rebounds = parseInt(form.elements['rebounds'].value) || 0;
    const assists = parseInt(form.elements['assists'].value) || 0;
    const steals = parseInt(form.elements['steals'].value) || 0;
    const blocks = parseInt(form.elements['blocks'].value) || 0;
    const turnovers = parseInt(form.elements['turnovers'].value) || 0;
    const personalFouls = parseInt(form.elements['personalFouls'].value) || 0;
    
    // Упрощенная формула индекса эффективности
    const efficiency = points + rebounds + assists + steals + blocks - turnovers - personalFouls;
    
    let rating = '';
    if (efficiency > 20) {
        rating = 'Выдающийся';
    } else if (efficiency > 10) {
        rating = 'Очень хороший';
    } else if (efficiency > 0) {
        rating = 'Хороший';
    } else {
        rating = 'Нуждается в улучшении';
    }
    
    const explanation = `Ваш индекс эффективности: ${efficiency}. Это оценивается как "${rating}".`;
    
    displayResult(form, efficiency, explanation);
}

// Функция для отображения результата
function displayResult(form, resultValue, explanation) {
    // Удаляем предыдущий результат, если он есть
    const existingResult = form.querySelector('.result-container');
    if (existingResult) {
        existingResult.remove();
    }
    
    // Создаем контейнер для результата
    const resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';
    
    resultContainer.innerHTML = `
        <div class="result-value">${resultValue}</div>
        <p>${explanation}</p>
    `;
    
    form.appendChild(resultContainer);
}

// Инициализация компонентов
function initComponents() {
    // Инициализация таймеров для челленджей
    initChallengeTimers();
    
    // Инициализация вкладок
    initTabs();
    
    // Инициализация аккордеонов
    initAccordions();
}

// Инициализация таймеров для челленджей
function initChallengeTimers() {
    const timerElements = document.querySelectorAll('[data-timer]');
    
    timerElements.forEach(timerElement => {
        const duration = parseInt(timerElement.dataset.timer);
        startTimer(timerElement, duration);
    });
}

// Функция запуска таймера
function startTimer(element, duration) {
    let secondsLeft = duration;
    
    const countdown = setInterval(() => {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        
        element.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            element.textContent = 'Время вышло!';
            
            // Выполнить действие по истечении времени
            onTimerComplete(element);
        }
        
        secondsLeft--;
    }, 1000);
}

// Действие по истечении времени таймера
function onTimerComplete(timerElement) {
    // Здесь можно добавить логику завершения челленджа
    console.log('Таймер завершен');
}

// Инициализация вкладок
function initTabs() {
    const tabButtons = document.querySelectorAll('[data-tab-button]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tabButton;
            openTab(tabId, this);
        });
    });
}

// Открытие вкладки
function openTab(tabId, clickedButton) {
    // Скрыть все вкладки
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Удалить активный класс у всех кнопок
    document.querySelectorAll('[data-tab-button]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    // Добавить активный класс к нажатой кнопке
    clickedButton.classList.add('active');
}

// Инициализация аккордеонов
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            toggleAccordion(this);
        });
    });
}

// Переключение аккордеона
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isActive = content.style.display === 'block';
    
    // Скрыть все аккордеоны
    document.querySelectorAll('.accordion-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Если текущий аккордеон был закрыт, открываем его
    if (!isActive) {
        content.style.display = 'block';
    }
}

// Загрузка данных
function loadData() {
    // Здесь будет логика загрузки JSON-данных
    console.log('Загрузка данных...');
}

// Инициализация маршрутизации
function initRouting() {
    // Просто обновляем активные элементы навигации при загрузке страницы
    updateActiveNavigation(window.location.pathname);
    
    // Добавляем обработчики для внутренних ссылок для обновления активных элементов навигации
    document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.addEventListener('click', function() {
            // Обновляем активные элементы навигации при клике на ссылку
            // Это произойдет до перезагрузки страницы
            setTimeout(() => {
                updateActiveNavigation(this.getAttribute('href'));
            }, 100);
        });
    });
}

// Обработка изменения маршрута
function handleRouteChange() {
    // При использовании простого перенаправления, это не требуется
    // Но обновим активные элементы навигации для текущей страницы
    updateActiveNavigation(window.location.pathname);
}

// Навигация к маршруту
function navigateTo(path) {
    // Для надежности используем простое перенаправление на соответствующую HTML-страницу
    window.location.href = path;
}

// Обновление активных элементов навигации
function updateActiveNavigation(currentPath) {
    // Убираем активный класс со всех ссылок навигации
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Получаем href ссылки
        const linkHref = link.getAttribute('href');
        
        // Добавляем активный класс к соответствующей ссылке
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else if (currentPath.startsWith(linkHref) && linkHref !== '/' && linkHref !== '#') {
            // Для случая, когда текущий путь является подстраницей (например, /rules/specific-rule для /rules/)
            // Исключаем '#' ссылки (якорные ссылки)
            link.classList.add('active');
        }
    });
    
    // Также обновляем активные элементы в нижнем колонтитуле, если они есть
    const footerLinks = document.querySelectorAll('.footer-content a');
    footerLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else if (currentPath.startsWith(linkHref) && linkHref !== '/' && linkHref !== '#') {
            link.classList.add('active');
        }
    });
}

// Загрузка содержимого страницы
function loadPageContent(path) {
    // Для простоты и надежности, просто перенаправляем на соответствующую HTML-страницу
    // Это более надежный подход, чем попытки динамической загрузки контента
    if (path && path !== '/') {
        window.location.href = path;
    } else {
        // Обновляем активные элементы навигации для текущей страницы
        updateActiveNavigation(window.location.pathname);
        hideLoadingIndicator();
    }
}

// Показ индикатора загрузки
function showLoadingIndicator() {
    // Создаем элемент индикатора загрузки
    let loader = document.getElementById('page-loader');
    
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader">
                <div class="spinner"></div>
                <div class="loader-text">Загрузка...</div>
            </div>
        `;
        document.body.appendChild(loader);
    }
    
    // Добавляем класс для отображения
    loader.classList.add('show');
    
    // Добавляем класс к основному контенту для визуального эффекта
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('loading');
    }
}

// Скрытие индикатора загрузки
function hideLoadingIndicator() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Убираем класс для скрытия
        loader.classList.remove('show');
    }
    
    // Убираем класс у основного контента
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.remove('loading');
    }
}

// Загрузка главной страницы
function loadHomePage() {
    console.log('Загрузка главной страницы');
    // В реальном приложении здесь будет логика загрузки контента главной страницы
}

// Загрузка страницы "не найдено"
function loadNotFoundPage() {
    console.log('Загрузка страницы "не найдено"');
    
    // Создаем элемент для основного контента
    const mainContent = document.querySelector('main') || document.createElement('main');
    if (!document.querySelector('main')) {
        document.body.appendChild(mainContent);
    }
    
    // Очищаем основной контент и добавляем страницу "не найдено"
    mainContent.innerHTML = `
        <section class="error-page">
            <div class="container">
                <h1>404 - Страница не найдена</h1>
                <p>Извините, но страница, которую вы ищете, не существует или была перемещена.</p>
                <a href="/" class="btn btn-primary">Вернуться на главную</a>
            </div>
        </section>
    `;
}

// Загрузка страницы калькуляторов
function loadCalculatorsPage() {
    console.log('Загрузка страницы калькуляторов');
    // В реальном приложении здесь будет логика загрузки контента страницы калькуляторов
}

// Загрузка страницы правил
function loadRulesPage() {
    console.log('Загрузка страницы правил');
    // В реальном приложении здесь будет логика загрузки контента страницы правил
}

// Загрузка страницы челленджей
function loadChallengesPage() {
    console.log('Загрузка страницы челленджей');
    // В реальном приложении здесь будет логика загрузки контента страницы челленджей
}

// Загрузка детальной страницы калькулятора
function loadCalculatorDetailPage(path) {
    console.log('Загрузка детальной страницы калькулятора:', path);
    // Извлекаем ID калькулятора из пути
    const calculatorId = path.split('/')[2];
    // В реальном приложении здесь будет загрузка конкретного калькулятора
    if (calculatorId) {
        console.log(`Загрузка калькулятора с ID: ${calculatorId}`);
        // Здесь может быть вызов функции для загрузки конкретного калькулятора
        // loadSpecificCalculator(calculatorId);
    }
}

// Загрузка детальной страницы правила
function loadRuleDetailPage(path) {
    console.log('Загрузка детальной страницы правила:', path);
    // Извлекаем ID правила из пути
    const ruleId = path.split('/')[2];
    // В реальном приложении здесь будет загрузка конкретного правила
    if (ruleId) {
        console.log(`Загрузка правила с ID: ${ruleId}`);
        // Здесь может быть вызов функции для загрузки конкретного правила
        // loadSpecificRule(ruleId);
    }
}

// Загрузка детальной страницы челленджа
function loadChallengeDetailPage(path) {
    console.log('Загрузка детальной страницы челленджа:', path);
    // Извлекаем ID челленджа из пути
    const challengeId = path.split('/')[2];
    // В реальном приложении здесь будет загрузка конкретного челленджа
    if (challengeId) {
        console.log(`Загрузка челленджа с ID: ${challengeId}`);
        // Здесь может быть вызов функции для загрузки конкретного челленджа
        // loadSpecificChallenge(challengeId);
    }
}


// Загрузка детальной страницы блога
function loadBlogPostPage(path) {
    console.log('Загрузка детальной страницы блога:', path);
    // Извлекаем ID поста из пути
    const postId = path.split('/')[2];
    // В реальном приложении здесь будет загрузка конкретного поста
    if (postId) {
        console.log(`Загрузка поста с ID: ${postId}`);
        // Здесь может быть вызов функции для загрузки конкретного поста
        // loadSpecificBlogPost(postId);
    }
}

// Загрузка детальной страницы тренировочного плана
function loadPlanDetailPage(path) {
    console.log('Загрузка детальной страницы плана:', path);
    // Извлекаем ID плана из пути
    const planId = path.split('/')[2];
    // В реальном приложении здесь будет загрузка конкретного плана
    if (planId) {
        console.log(`Загрузка плана с ID: ${planId}`);
        // Здесь может быть вызов функции для загрузки конкретного плана
        // loadSpecificPlan(planId);
    }
}

// Загрузка страницы "О нас"
function loadAboutPage() {
    console.log('Загрузка страницы "О нас"');
    // В реальном приложении здесь будет логика загрузки контента страницы "О нас"
}

// Загрузка страницы "Контакты"
function loadContactPage() {
    console.log('Загрузка страницы "Контакты"');
    // В реальном приложении здесь будет логика загрузки контента страницы "Контакты"
}


// Загрузка страницы блога
function loadBlogPage() {
    console.log('Загрузка страницы блога');
    // В реальном приложении здесь будет логика загрузки контента страницы блога
}

// Загрузка страницы "не найдено"
function loadNotFoundPage() {
    console.log('Страница не найдена');
    // В реальном приложении здесь будет логика загрузки страницы 404
}

// Функция для сохранения данных в localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
        return false;
    }
}

// Функция для получения данных из localStorage
function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Ошибка при получении из localStorage:', error);
        return null;
    }
}

// Функция для очистки данных из localStorage
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Ошибка при удалении из localStorage:', error);
        return false;
    }
}