// Модуль для SEO-оптимизации страниц для BasketGuide

// Функция для обновления основных мета-тегов
function updateMetaTags(title, description, keywords = []) {
    // Обновляем заголовок страницы
    document.title = `${title} - BasketGuide`;
    
    // Обновляем или создаем мета-описание
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Обновляем или создаем ключевые слова
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords.length > 0 ? keywords.join(', ') : '';
    
    // Обновляем canonical URL
    updateCanonicalUrl();
    
    // Обновляем Open Graph теги
    updateOpenGraphTags(title, description);
    
    // Обновляем Twitter Card теги
    updateTwitterCardTags(title, description);
    
    console.log(`Мета-теги обновлены для: ${title}`);
}

// Функция для обновления canonical URL
function updateCanonicalUrl(url = null) {
    if (!url) {
        url = window.location.href;
    }
    
    // Удаляем существующий canonical тег
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
        existingCanonical.remove();
    }
    
    // Создаем и добавляем новый canonical тег
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = url;
    document.head.appendChild(canonicalLink);
}

// Функция для обновления Open Graph тегов
function updateOpenGraphTags(title, description, image = null) {
    // Удаляем существующие OG теги
    const existingOGTags = document.querySelectorAll('meta[property^="og:"]');
    existingOGTags.forEach(tag => tag.remove());
    
    // Базовые OG теги
    const ogTags = [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:site_name', content: 'BasketGuide' }
    ];
    
    // Добавляем изображение, если оно предоставлено
    if (image) {
        ogTags.push({ property: 'og:image', content: image });
    } else {
        // Используем стандартное изображение для сайта
        ogTags.push({ property: 'og:image', content: `${window.location.origin}/assets/images/logo.png` });
    }
    
    // Создаем и добавляем OG теги
    ogTags.forEach(tag => {
        const metaTag = document.createElement('meta');
        metaTag.property = tag.property;
        metaTag.content = tag.content;
        document.head.appendChild(metaTag);
    });
}

// Функция для обновления Twitter Card тегов
function updateTwitterCardTags(title, description, image = null) {
    // Удаляем существующие Twitter Card теги
    const existingTwitterTags = document.querySelectorAll('meta[name^="twitter:"]');
    existingTwitterTags.forEach(tag => tag.remove());
    
    // Twitter Card теги
    const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:site', content: '@basketguide' }
    ];
    
    // Добавляем изображение, если оно предоставлено
    if (image) {
        twitterTags.push({ name: 'twitter:image', content: image });
    } else {
        // Используем стандартное изображение для сайта
        twitterTags.push({ name: 'twitter:image', content: `${window.location.origin}/assets/images/logo.png` });
    }
    
    // Создаем и добавляем Twitter Card теги
    twitterTags.forEach(tag => {
        const metaTag = document.createElement('meta');
        metaTag.name = tag.name;
        metaTag.content = tag.content;
        document.head.appendChild(metaTag);
    });
}

// Функция для добавления структурированных данных (JSON-LD)
function addStructuredData(data) {
    // Удаляем существующие structured data
    const existingSchema = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchema.forEach(schema => schema.remove());
    
    // Создаем и добавляем новые structured data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(schemaScript);
}

// Функция для добавления structured data для статьи
function addArticleStructuredData(headline, description, author, publishDate, imageUrl = null) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline,
        "description": description,
        "author": {
            "@type": "Organization",
            "name": author
        },
        "publisher": {
            "@type": "Organization",
            "name": "BasketGuide",
            "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/assets/images/logo.png`
            }
        },
        "datePublished": publishDate,
        "dateModified": new Date().toISOString(),
        ...(imageUrl && { "image": imageUrl })
    };
    
    addStructuredData(structuredData);
}

// Функция для добавления structured data для калькулятора
function addCalculatorStructuredData(name, description, url, category = "Sports") {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": name,
        "description": description,
        "applicationCategory": "Sports",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "url": url,
        "potentialAction": {
            "@type": "ConsumeAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": url,
                "actionPlatform": [
                    "https://schema.org/DesktopWebPlatform",
                    "https://schema.org/MobileWebPlatform"
                ]
            }
        }
    };
    
    addStructuredData(structuredData);
}

// Функция для добавления structured data для правила
function addRuleStructuredData(name, description, category = "Sports Rule") {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": name,
        "description": description,
        "genre": "Sports Rule",
        "audience": {
            "@type": "Audience",
            "audienceType": "Basketball Players and Enthusiasts"
        }
    };
    
    addStructuredData(structuredData);
}

// Функция для обновления хлебных крошек
function updateBreadcrumbs(items) {
    // Удаляем существующие хлебные крошки
    const existingBreadcrumbs = document.querySelector('nav.breadcrumb-nav');
    if (existingBreadcrumbs) {
        existingBreadcrumbs.remove();
    }
    
    // Создаем контейнер для хлебных крошек
    const breadcrumbsNav = document.createElement('nav');
    breadcrumbsNav.className = 'breadcrumb-nav';
    breadcrumbsNav.setAttribute('aria-label', 'Breadcrumb');
    
    // Создаем список хлебных крошек
    const ol = document.createElement('ol');
    ol.className = 'breadcrumbs';
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        
        if (index === items.length - 1) {
            // Последний элемент не должен быть ссылкой
            li.setAttribute('aria-current', 'page');
            li.textContent = item.label;
        } else {
            // Обычный элемент с ссылкой
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.label;
            li.appendChild(link);
        }
        
        ol.appendChild(li);
    });
    
    breadcrumbsNav.appendChild(ol);
    
    // Добавляем хлебные крошки в начало основного контента
    const mainContent = document.querySelector('main') || document.body;
    if (mainContent.firstChild) {
        mainContent.insertBefore(breadcrumbsNav, mainContent.firstChild);
    } else {
        mainContent.appendChild(breadcrumbsNav);
    }
}

// Функция для генерации URL-адреса из заголовка
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Удаляем специальные символы
        .replace(/[\s_-]+/g, '-') // Заменяем пробелы и подчеркивания на дефисы
        .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
}

// Функция для обновления заголовков H1-H6 на странице
function updateHeadings(primaryHeading, secondaryHeadings = []) {
    // Обновляем H1
    let h1 = document.querySelector('h1');
    if (!h1) {
        h1 = document.createElement('h1');
        // Добавляем H1 в начало основного контента
        const mainContent = document.querySelector('main') || document.body;
        mainContent.insertBefore(h1, mainContent.firstChild);
    }
    h1.textContent = primaryHeading;
    
    // Обновляем или добавляем дополнительные заголовки
    secondaryHeadings.forEach((heading, index) => {
        let h = document.querySelector(`h${index + 2}`);
        if (!h) {
            h = document.createElement(`h${index + 2}`);
            // Добавляем после H1 или последнего заголовка
            const prevHeading = document.querySelector(`h${index + 1}`) || h1;
            prevHeading.after(h);
        }
        h.textContent = heading.text;
        if (heading.id) {
            h.id = heading.id;
        }
    });
}

// Функция для добавления тега rel="nofollow" к внешним ссылкам
function addNofollowToExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    links.forEach(link => {
        link.rel = 'nofollow noopener noreferrer';
    });
}

// Функция для добавления атрибутов alt к изображениям
function addAltAttributesToImages() {
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
        // Пытаемся сгенерировать alt текст на основе имени файла или других данных
        const srcParts = img.src.split('/');
        const fileName = srcParts[srcParts.length - 1];
        const cleanName = fileName.replace(/\.[^/.]+$/, ""); // Удаляем расширение
        const altText = cleanName.replace(/[_-]/g, ' '); // Заменяем _ и - на пробелы
        
        img.alt = altText || 'Изображение';
    });
}

// Функция для проверки SEO-метрик страницы
function checkSEOMetrics() {
    const metrics = {
        titleLength: document.title.length,
        hasDescription: !!document.querySelector('meta[name="description"]'),
        hasKeywords: !!document.querySelector('meta[name="keywords"]'),
        hasH1: !!document.querySelector('h1'),
        hasImagesWithAlt: document.querySelectorAll('img[alt]').length > 0,
        hasStructuredData: document.querySelectorAll('script[type="application/ld+json"]').length > 0,
        hasCanonical: !!document.querySelector('link[rel="canonical"]'),
        hasOpenGraph: document.querySelectorAll('meta[property^="og:"]').length > 0,
        hasTwitterCard: document.querySelectorAll('meta[name^="twitter:"]').length > 0
    };
    
    console.log('SEO-метрики страницы:', metrics);
    return metrics;
}

// Функция для автоматического обновления SEO при изменении контента
function initAutoSEOUpdate() {
    // Используем MutationObserver для отслеживания изменений в DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Если были добавлены новые элементы, проверяем необходимость обновления SEO
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Добавляем небольшую задержку для обновления SEO
                setTimeout(() => {
                    // Обновляем атрибуты alt для новых изображений
                    addAltAttributesToImages();
                    
                    // Добавляем rel="nofollow" для новых внешних ссылок
                    addNofollowToExternalLinks();
                }, 100);
            }
        });
    });
    
    // Начинаем наблюдение за изменениями в body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('Автоматическое обновление SEO инициализировано');
}

// Функция для генерации SEO-данных на основе типа контента
function generateSEOData(contentType, data) {
    let title, description, keywords = [];
    
    switch(contentType) {
        case 'calculator':
            title = `${data.title} - Калькулятор | BasketGuide`;
            description = data.description || `Интерактивный калькулятор для расчета ${data.title}. Узнайте правильные параметры для баскетбола.`;
            keywords = ['калькулятор', 'баскетбол', data.title, ...data.keywords || []];
            break;
            
        case 'rule':
            title = `${data.title} - Правило баскетбола | BasketGuide`;
            description = data.shortDesc || `Подробное объяснение правила ${data.title} в баскетболе. Правила FIBA, NBA и для любителей.`;
            keywords = ['правила баскетбола', 'баскетбол', data.title, ...data.keywords || []];
            break;
            
        case 'challenge':
            title = `${data.title} - Челлендж | BasketGuide`;
            description = data.description || `Пройдите баскетбольный челлендж ${data.title}. Проверьте свои навыки и соревнуйтесь с другими.`;
            keywords = ['челлендж', 'баскетбол', data.title, 'тренажер', ...data.keywords || []];
            break;
            
            
        case 'blog':
            title = `${data.title} | BasketGuide`;
            description = data.excerpt || data.description || `Читайте статью ${data.title} на BasketGuide - вашем источнике информации о баскетболе.`;
            keywords = ['баскетбол', 'статья', 'обучение', ...data.tags || [], ...data.keywords || []];
            break;
            
        default:
            title = data.title || 'BasketGuide - Все о баскетболе';
            description = data.description || 'BasketGuide - информационно-интерактивный веб-сайт о баскетболе с калькуляторами, объяснениями правил и интерактивными челленджами.';
            keywords = ['баскетбол', 'обучение', 'правила', 'калькуляторы', 'челленджи'];
    }
    
    return { title, description, keywords };
}

// Функция для обновления SEO на основе типа контента
function updateSEOForContent(contentType, data) {
    const seoData = generateSEOData(contentType, data);
    updateMetaTags(seoData.title, seoData.description, seoData.keywords);
    
    // Добавляем структурированные данные в зависимости от типа контента
    switch(contentType) {
        case 'calculator':
            addCalculatorStructuredData(data.title, data.description, window.location.href);
            break;
        case 'rule':
            addRuleStructuredData(data.title, data.shortDesc);
            break;
        case 'article':
        case 'blog':
            addArticleStructuredData(
                data.title,
                data.description || data.excerpt,
                data.author || 'BasketGuide Team',
                data.publishedAt || new Date().toISOString(),
                data.image
            );
            break;
    }
}

// Инициализация SEO-модуля
function initSEOModule() {
    console.log('SEO-модуль инициализирован');
    
    // Добавляем alt атрибуты к изображениям
    addAltAttributesToImages();
    
    // Добавляем rel="nofollow" к внешним ссылкам
    addNofollowToExternalLinks();
    
    // Инициализируем автоматическое обновление SEO
    initAutoSEOUpdate();
    
    // Проверяем текущие SEO-метрики
    checkSEOMetrics();
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initSEOModule, 100);
});

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateMetaTags,
        updateCanonicalUrl,
        updateOpenGraphTags,
        updateTwitterCardTags,
        addStructuredData,
        addArticleStructuredData,
        addCalculatorStructuredData,
        addRuleStructuredData,
        updateBreadcrumbs,
        generateSlug,
        updateHeadings,
        addNofollowToExternalLinks,
        addAltAttributesToImages,
        checkSEOMetrics,
        initAutoSEOUpdate,
        generateSEOData,
        updateSEOForContent,
        initSEOModule
    };
}