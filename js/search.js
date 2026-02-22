/**
 * Поиск по сайту BasketGuide
 * Использует Lunr.js для полнотекстового поиска
 */

(function() {
    'use strict';

    let idx = null;
    let documents = [];
    let currentFilter = 'all';

    // Типы контента для отображения
    const typeLabels = {
        'rule': 'Правило',
        'blog': 'Статья',
        'calculator': 'Калькулятор',
        'challenge': 'Челлендж',
        'plan': 'План тренировок'
    };

    /**
     * Инициализация поиска
     */
    async function initSearch() {
        try {
            // Определяем правильный путь к индексу в зависимости от текущей страницы
            const currentPath = window.location.pathname;
            let indexPath = 'data/search-index.json';
            
            if (currentPath.includes('/pages/')) {
                indexPath = '../data/search-index.json';
            } else if (currentPath.includes('/calculators/') || 
                       currentPath.includes('/challenges/') || 
                       currentPath.includes('/plans/') || 
                       currentPath.includes('/rule/')) {
                indexPath = '../../data/search-index.json';
            }
            
            // Загружаем поисковый индекс
            const response = await fetch(indexPath);
            const data = await response.json();
            documents = data.documents;

            // Инициализируем Lunr (базовая версия без плагинов)
            idx = lunr(function() {
                // Настройка для поддержки кириллицы
                this.pipeline.reset();
                this.searchPipeline.reset();
                
                this.field('title', { boost: 10 });
                this.field('excerpt', { boost: 5 });
                this.field('keywords', { boost: 3 });
                this.field('content');
                this.field('type');
                this.ref('id');

                // Добавляем документы в индекс
                documents.forEach(doc => {
                    this.add(doc);
                });
            });

            console.log('Поисковый индекс загружен:', documents.length, 'документов');
            
            // Тестовый поиск для проверки
            const testResults = idx.search('фол');
            console.log('Тестовый поиск "фол":', testResults.length, 'результатов');

            // Инициализируем поисковую строку в навигации
            initNavSearch();

            // Проверяем, находимся ли мы на странице поиска
            if (window.location.pathname.includes('search.html')) {
                initSearchPage();
            }

        } catch (error) {
            console.error('Ошибка инициализации поиска:', error);
        }
    }

    /**
     * Инициализация поисковой строки в навигации
     */
    function initNavSearch() {
        const navInputs = document.querySelectorAll('.nav-search-input');
        const navBtns = document.querySelectorAll('.nav-search-btn');

        navInputs.forEach((input, index) => {
            const btn = navBtns[index];
            
            // Поиск по нажатию Enter
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performNavSearch(input.value);
                }
            });

            // Поиск по клику на кнопку
            if (btn) {
                btn.addEventListener('click', () => {
                    performNavSearch(input.value);
                });
            }
        });
    }

    /**
     * Выполнение поиска из навигации
     */
    function performNavSearch(query) {
        if (!query.trim()) return;

        if (window.location.pathname.includes('search.html')) {
            // Уже на странице поиска
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query;
                performSearch(query);
            }
        } else {
            // Переход на страницу поиска
            const currentPath = window.location.pathname;
            let prefix = '';
            
            if (currentPath.includes('/pages/')) {
                prefix = '../';
            } else if (currentPath.includes('/calculators/') || 
                       currentPath.includes('/challenges/') || 
                       currentPath.includes('/plans/') || 
                       currentPath.includes('/rule/')) {
                prefix = '../../';
            }
            
            window.location.href = `${prefix}pages/search.html?q=${encodeURIComponent(query)}`;
        }
    }

    /**
     * Инициализация страницы поиска
     */
    function initSearchPage() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const searchResults = document.getElementById('searchResults');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const suggestions = document.getElementById('searchSuggestions');

        if (!searchInput || !searchButton) return;

        // Показываем подсказки
        if (suggestions) {
            suggestions.style.display = 'block';
            
            // Обработка кликов по подсказкам
            suggestions.querySelectorAll('.suggestion-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const query = link.getAttribute('data-query');
                    searchInput.value = query;
                    performSearch(query);
                });
            });
        }

        // Поиск по нажатию Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });

        // Поиск по клику на кнопку
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });

        // Фильтры
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                
                // Если есть запрос, выполняем поиск с новым фильтром
                if (searchInput.value.trim()) {
                    performSearch(searchInput.value.trim());
                }
            });
        });

        // Проверка URL на наличие запроса
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            searchInput.value = query;
            performSearch(query);
        }
    }

    /**
     * Выполнение поиска
     */
    function performSearch(query) {
        if (!idx || !query.trim()) return;

        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        // Показываем загрузку
        searchResults.innerHTML = `
            <div class="search-loading">
                <i class="fas fa-spinner"></i>
                <p>Поиск...</p>
            </div>
        `;

        // Обновляем URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('q', query);
        window.history.pushState({}, '', newUrl);

        const queryLower = query.trim().toLowerCase();
        const terms = queryLower.split(/\s+/).filter(t => t.length > 0);

        // Поиск по частичному совпадению через JavaScript
        const results = documents.filter(doc => {
            const searchText = (
                doc.title + ' ' + 
                doc.excerpt + ' ' + 
                doc.keywords + ' ' + 
                doc.content
            ).toLowerCase();
            
            // Проверяем, содержится ли хотя бы один термин в тексте
            return terms.some(term => searchText.includes(term));
        }).map(doc => {
            // Возвращаем в формате Lunr
            return { ref: doc.id, score: 1 };
        });

        // Сортируем по релевантности (заголовок > ключевые слова > контент)
        results.sort((a, b) => {
            const docA = documents.find(d => d.id === a.ref);
            const docB = documents.find(d => d.id === b.ref);
            
            let scoreA = 0, scoreB = 0;
            
            terms.forEach(term => {
                if (docA.title.toLowerCase().includes(term)) scoreA += 10;
                if (docA.keywords.toLowerCase().includes(term)) scoreA += 5;
                if (docA.excerpt.toLowerCase().includes(term)) scoreA += 3;
                
                if (docB.title.toLowerCase().includes(term)) scoreB += 10;
                if (docB.keywords.toLowerCase().includes(term)) scoreB += 5;
                if (docB.excerpt.toLowerCase().includes(term)) scoreB += 3;
            });
            
            return scoreB - scoreA;
        });

        console.log('Найдено результатов:', results.length);

        // Небольшая задержка для визуального эффекта
        setTimeout(() => {
            displayResults(results, query, searchResults);
        }, 300);
    }

    /**
     * Отображение результатов
     */
    function displayResults(results, query, container) {
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Ничего не найдено</h3>
                    <p>По запросу "${escapeHtml(query)}" не найдено результатов</p>
                    <div class="search-suggestions" style="display: block;">
                        <h4>Попробуйте поискать:</h4>
                        <div class="suggestion-links">
                            <a href="#" class="suggestion-link" data-query="пробежка">Пробежка</a>
                            <a href="#" class="suggestion-link" data-query="фол">Фол</a>
                            <a href="#" class="suggestion-link" data-query="бросок">Бросок</a>
                            <a href="#" class="suggestion-link" data-query="тренировка">Тренировка</a>
                        </div>
                    </div>
                </div>
            `;

            // Повторно привязываем обработчики к подсказкам
            container.querySelectorAll('.suggestion-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newQuery = link.getAttribute('data-query');
                    document.getElementById('searchInput').value = newQuery;
                    performSearch(newQuery);
                });
            });

            return;
        }

        // Фильтрация результатов
        let filteredResults = results;
        if (currentFilter !== 'all') {
            filteredResults = results.filter(result => {
                const doc = documents.find(d => d.id === result.ref);
                return doc && doc.type === currentFilter;
            });
        }

        if (filteredResults.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-filter"></i>
                    <h3>Нет результатов в выбранной категории</h3>
                    <p>Попробуйте выбрать другую категорию или изменить запрос</p>
                </div>
            `;
            return;
        }

        // Формируем HTML результатов
        let html = `
            <div class="results-count">
                Найдено: ${filteredResults.length} результат${getDeclension(filteredResults.length, ['ов', 'а', ''])}
            </div>
        `;

        filteredResults.forEach(result => {
            const doc = documents.find(d => d.id === result.ref);
            if (!doc) return;

            const typeLabel = typeLabels[doc.type] || doc.type;
            const excerpt = highlightMatch(doc.excerpt, query);

            html += `
                <div class="search-result-item">
                    <span class="search-result-type ${doc.type}">${typeLabel}</span>
                    <h3 class="search-result-title">
                        <a href="${doc.url}">${escapeHtml(doc.title)}</a>
                    </h3>
                    <p class="search-result-excerpt">${excerpt}</p>
                    ${doc.keywords ? `
                        <div class="search-result-tags">
                            ${doc.keywords.split(' ').slice(0, 5).map(tag => 
                                `<span class="search-result-tag">${escapeHtml(tag)}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Подсветка найденных слов
     */
    function highlightMatch(text, query) {
        if (!text) return '';
        
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        let result = escapeHtml(text);
        
        words.forEach(word => {
            const regex = new RegExp(`(${escapeRegex(word)})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });
        
        return result;
    }

    /**
     * Экранирование HTML
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Экранирование специальных символов для RegExp
     */
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Склонение слов
     */
    function getDeclension(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2];
        const index = (number % 100 > 4 && number % 100 < 20) 
            ? 2 
            : cases[(number % 10 < 5) ? number % 10 : 5];
        return titles[index];
    }

    /**
     * Поиск из любой точки сайта
     */
    window.BasketGuideSearch = {
        search: function(query) {
            if (window.location.pathname.includes('search.html')) {
                const input = document.getElementById('searchInput');
                if (input) {
                    input.value = query;
                    performSearch(query);
                }
            } else {
                // Переход на страницу поиска с запросом
                window.location.href = `./pages/search.html?q=${encodeURIComponent(query)}`;
            }
        }
    };

    // Инициализация после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
    
    // Для отладки
    console.log('Поиск BasketGuide инициализирован');
})();
