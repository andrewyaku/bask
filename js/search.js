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
            // Загружаем поисковый индекс
            const response = await fetch('../data/search-index.json');
            const data = await response.json();
            documents = data.documents;

            // Инициализируем Lunr с поддержкой русского языка
            idx = lunr(function() {
                this.use(lunr.ru);
                
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
            const prefix = currentPath.includes('/pages/') ? '../' : './';
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

        // Небольшая задержка для визуального эффекта
        setTimeout(() => {
            const results = idx.search(query);
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
})();
