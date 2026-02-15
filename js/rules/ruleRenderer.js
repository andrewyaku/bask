// Модуль для рендеринга страниц правил баскетбола для BasketGuide

// Функция для рендеринга страницы правила
function renderRulePage(ruleData) {
    // Создаем контейнер для содержимого правила
    const ruleContainer = document.createElement('div');
    ruleContainer.className = 'rule-page';
    
    // Формируем HTML-разметку страницы правила
    ruleContainer.innerHTML = `
        <article class="rule-content">
            <header class="rule-header">
                <h1>${ruleData.title}</h1>
                <p class="rule-slug">${ruleData.slug}</p>
            </header>
            
            <section class="rule-summary">
                <h2>Краткое определение</h2>
                <p>${ruleData.shortDesc}</p>
            </section>
            
            <section class="rule-purpose">
                <h2>Почему это правило существует</h2>
                <p>${ruleData.whyRule}</p>
            </section>
            
            <section class="rule-official">
                <h2>Официальное правило (FIBA)</h2>
                <p>${ruleData.officialRule}</p>
            </section>
            
            <section class="rule-variants">
                <h2>Как правило применяется в разных условиях</h2>
                
                <div class="rule-variant">
                    <h3>Детский баскетбол</h3>
                    <p>${ruleData.childRules || 'Правило применяется в стандартной форме'}</p>
                </div>
                
                <div class="rule-variant">
                    <h3>Любительский баскетбол</h3>
                    <p>${ruleData.amateurRules || 'Правило применяется в стандартной форме'}</p>
                </div>
                
                <div class="rule-variant">
                    <h3>NBA</h3>
                    <p>${ruleData.nbaRules || 'Правило применяется в стандартной форме'}</p>
                </div>
            </section>
            
            <section class="rule-disputes">
                <h2>Типичные споры и спорные ситуации</h2>
                <ul>
                    ${ruleData.disputes.map(dispute => `<li>${dispute}</li>`).join('')}
                </ul>
            </section>
            
            <section class="rule-faq">
                <h2>Частые вопросы (FAQ)</h2>
                ${renderFAQSection(ruleData.faq)}
            </section>
            
            
            <section class="rule-related-content">
                <h2>Связанный контент</h2>
                ${renderRelatedContent(ruleData)}
            </section>
            
            <section class="rule-test-yourself">
                <h2>Проверьте себя</h2>
                <button class="btn btn-primary" onclick="goToRelatedChallenge('${ruleData.id}')">
                    Пройти челлендж по этому правилу
                </button>
                <button class="btn btn-secondary" onclick="generateRuleQuiz('${ruleData.id}')">
                    Пройти тест
                </button>
            </section>
        </article>
    `;
    
    // Возвращаем созданный элемент
    return ruleContainer;
}

// Функция для рендеринга FAQ-раздела
function renderFAQSection(faqData) {
    if (!faqData || faqData.length === 0) {
        return '<p>Вопросов пока нет. Вы можете задать первый!</p>';
    }
    
    return `
        <div class="faq-container">
            ${faqData.map(item => `
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>${item.q}</h4>
                    </div>
                    <div class="faq-answer">
                        <p>${item.a}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}


// Функция для рендеринга связанного контента
function renderRelatedContent(ruleData) {
    let relatedContentHtml = '<div class="related-content-grid">';
    
    // Связанные калькуляторы
    if (ruleData.relatedCalculators && ruleData.relatedCalculators.length > 0) {
        relatedContentHtml += `
            <div class="related-section">
                <h3>Связанные калькуляторы</h3>
                <ul>
                    ${ruleData.relatedCalculators.map(calcId => `
                        <li>
                            <a href="/calculators/${calcId}" class="related-link">
                                ${getCalculatorTitleById(calcId)}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Связанные челленджи
    if (ruleData.relatedChallenges && ruleData.relatedChallenges.length > 0) {
        relatedContentHtml += `
            <div class="related-section">
                <h3>Связанные челленджи</h3>
                <ul>
                    ${ruleData.relatedChallenges.map(challengeId => `
                        <li>
                            <a href="/challenges/${challengeId}" class="related-link">
                                ${getChallengeTitleById(challengeId)}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Связанные тренировочные планы
    if (ruleData.relatedPlans && ruleData.relatedPlans.length > 0) {
        relatedContentHtml += `
            <div class="related-section">
                <h3>Связанные тренировочные планы</h3>
                <ul>
                    ${ruleData.relatedPlans.map(planId => `
                        <li>
                            <a href="/plans/${planId}" class="related-link">
                                ${getPlanTitleById(planId)}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    relatedContentHtml += '</div>';
    
    return relatedContentHtml || '<p>Связанного контента пока нет.</p>';
}

// Вспомогательная функция для получения названия калькулятора по ID
function getCalculatorTitleById(calcId) {
    // В реальном приложении эти данные будут загружаться из JSON
    const calcTitles = {
        'ball-size': 'Размер баскетбольного мяча',
        'hoop-height': 'Высота баскетбольного кольца',
        'position': 'Позиция игрока',
        'jump-height': 'Вертикальный прыжок',
        'player-index': 'Индекс эффективности игрока'
    };
    
    return calcTitles[calcId] || calcId;
}

// Вспомогательная функция для получения названия челленджа по ID
function getChallengeTitleById(challengeId) {
    // В реальном приложении эти данные будут загружаться из JSON
    const challengeTitles = {
        'traveling-challenge': 'Определи пробежку',
        'foul-challenge': 'Типы фолов',
        'shot-clock-challenge': 'Атакующий мяч',
        'three-second-challenge': 'Трехсекундное правило'
    };
    
    return challengeTitles[challengeId] || challengeId;
}

// Вспомогательная функция для получения названия тренировочного плана по ID
function getPlanTitleById(planId) {
    // В реальном приложении эти данные будут загружаться из JSON
    const planTitles = {
        'beginner-plan': 'Тренировки для новичков',
        'shooting-plan': 'Улучшение бросков',
        'dunk-plan': 'Тренировки для данка',
        'defense-plan': 'Защитные навыки'
    };
    
    return planTitles[planId] || planId;
}

// Функция для перехода к связанному челленджу
function goToRelatedChallenge(ruleId) {
    // Логика перехода к связанному челленджу
    console.log(`Переход к челленджу, связанному с правилом: ${ruleId}`);

    // Определяем URL для челленджа по правилу
    const challengeUrl = `/pages/challenges.html#for-rule-${ruleId}`;

    // Переход на страницу челленджей с якорем к конкретному челленджу
    window.location.href = challengeUrl;
}

// Функция для генерации викторины по правилу
function generateRuleQuiz(ruleId) {
    // Генерация викторины по правилу
    console.log(`Генерация викторины по правилу: ${ruleId}`);

    // Определяем URL для теста по правилу
    const quizUrl = `/pages/challenges.html#quiz-${ruleId}`;

    // Переход на страницу тестов с якорем к конкретному тесту
    window.location.href = quizUrl;
}

// Функция для загрузки и рендеринга конкретного правила
async function loadAndRenderRule(ruleId) {
    try {
        // Показываем индикатор загрузки
        showLoadingIndicator();
        
        // Загружаем данные правила
        const ruleData = await loadRuleData(ruleId);
        
        if (!ruleData) {
            throw new Error(`Правило с ID ${ruleId} не найдено`);
        }
        
        // Рендерим страницу правила
        const rulePageElement = renderRulePage(ruleData);
        
        // Очищаем основной контент и добавляем новую страницу
        const mainContent = document.querySelector('main') || document.body;
        mainContent.innerHTML = '';
        mainContent.appendChild(rulePageElement);
        
        // Обновляем мета-теги для SEO
        updateMetaTags(ruleData.title, ruleData.shortDesc, ruleData.keywords);
        
        // Скрываем индикатор загрузки
        hideLoadingIndicator();
        
    } catch (error) {
        console.error('Ошибка при загрузке и рендеринге правила:', error);
        
        // Показываем сообщение об ошибке
        showErrorPage(error.message);
        
        // Скрываем индикатор загрузки
        hideLoadingIndicator();
    }
}

// Функция для загрузки данных правила
async function loadRuleData(ruleId) {
    try {
        // В реальном приложении здесь будет загрузка из JSON-файла
        // или API-вызов для получения данных правила
        
        // Для демонстрации возвращаем тестовые данные
        const testData = {
            id: ruleId,
            title: 'Пробежка (Traveling)',
            slug: 'traveling',
            shortDesc: 'Перемещение с мячом более чем на определённое количество шагов',
            whyRule: 'Правило пробежки введено для предотвращения несправедливого преимущества, которое получал бы игрок, несущий мяч на большое расстояние без отскока.',
            officialRule: 'По правилам FIBA, игрок, остановившийся при ведении мяча, может сделать два шага при остановке для выполнения броска или передачи. Превышение этого количества шагов без отскока мяча считается пробежкой.',
            childRules: 'В детском баскетболе правило пробежки часто ослабляется, позволяя больше шагов для развития навыков игры.',
            amateurRules: 'В любительских лигах правило пробежки применяется в упрощенном виде, с упором на справедливую игру.',
            nbaRules: 'В NBA правило пробежки аналогично FIBA, но судьи более строго следят за такими нарушениями как "gather step" и другие тонкие аспекты.',
            disputes: [
                'Является ли шаг при ловле мяча первым шагом?',
                'Что делать, если игрок упал с мячом?',
                'Как считать шаги при ловле мяча после отскока от щита?'
            ],
            faq: [
                { q: 'Сколько шагов можно сделать при остановке?', a: 'При остановке после ведения мяча можно сделать два шага перед броском или передачей.' },
                { q: 'Что такое "gather step"?', a: 'Это шаг, который игрок делает сразу после ловли мяча при ведении. Он не считается первым шагом.' },
                { q: 'Можно ли поднять ведущую ногу после второго шага?', a: 'Нет, после второго шага ведущая нога должна остаться на полу до броска или передачи.' }
            ],
            relatedCalculators: ['player-position'],
            relatedChallenges: ['traveling-challenge'],
            relatedPlans: ['beginner-plan'],
            keywords: ['пробежка', 'traveling', 'шаги баскетбол', 'нарушение правил']
        };
        
        return testData;
    } catch (error) {
        console.error('Ошибка при загрузке данных правила:', error);
        return null;
    }
}

// Функция для обновления мета-тегов для SEO
function updateMetaTags(title, description, keywords) {
    // Обновляем заголовок страницы
    document.title = `${title} - BasketGuide`;
    
    // Обновляем мета-описание
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.getElementsByTagName('head')[0].appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Обновляем ключевые слова
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.getElementsByTagName('head')[0].appendChild(metaKeywords);
    }
    metaKeywords.content = keywords ? keywords.join(', ') : '';
    
    // Добавляем structured data
    addStructuredData(title, description);
}

// Функция для добавления структурированных данных
function addStructuredData(title, description) {
    // Удаляем существующие structured data
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
        existingSchema.remove();
    }
    
    // Создаем и добавляем новые structured data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Organization",
            "name": "BasketGuide"
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString()
    });
    
    document.head.appendChild(schemaScript);
}

// Функция для показа индикатора загрузки
function showLoadingIndicator() {
    let loader = document.getElementById('page-loader');
    
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = '<div class="loader">Загрузка правила...</div>';
        document.body.appendChild(loader);
    }
    
    loader.style.display = 'block';
}

// Функция для скрытия индикатора загрузки
function hideLoadingIndicator() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Функция для показа страницы ошибки
function showErrorPage(message) {
    const mainContent = document.querySelector('main') || document.body;
    mainContent.innerHTML = `
        <div class="error-page">
            <h2>Ошибка при загрузке правила</h2>
            <p>${message}</p>
            <a href="/rules/" class="btn btn-primary">Вернуться к списку правил</a>
        </div>
    `;
}

// Инициализация модуля
function initRuleRenderer() {
    console.log('Модуль рендеринга правил инициализирован');
    
    // Добавляем обработчик для внутренних ссылок на правила
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="/rules/"]')) {
            e.preventDefault();
            const ruleId = e.target.getAttribute('href').replace('/rules/', '');
            loadAndRenderRule(ruleId);
        }
    });
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initRuleRenderer, 100);
});

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderRulePage,
        renderFAQSection,
        renderRelatedContent,
        goToRelatedChallenge,
        generateRuleQuiz,
        loadAndRenderRule,
        loadRuleData,
        updateMetaTags,
        addStructuredData,
        showLoadingIndicator,
        hideLoadingIndicator,
        showErrorPage,
        initRuleRenderer
    };
}