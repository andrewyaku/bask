// Вспомогательные функции для BasketGuide

// Функция для форматирования чисел
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Функция для проверки валидности email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция для проверки валидности возраста
function validateAge(age) {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 120;
}

// Функция для проверки валидности роста
function validateHeight(height) {
    const heightNum = parseInt(height);
    return !isNaN(heightNum) && heightNum >= 50 && heightNum <= 250;
}

// Функция для проверки валидности веса
function validateWeight(weight) {
    const weightNum = parseInt(weight);
    return !isNaN(weightNum) && weightNum >= 10 && weightNum <= 300;
}

// Функция для проверки валидности процента
function validatePercentage(value) {
    const valueNum = parseInt(value);
    return !isNaN(valueNum) && valueNum >= 0 && valueNum <= 100;
}

// Функция для генерации случайного числа в диапазоне
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для получения текущей даты в формате YYYY-MM-DD
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

// Функция для преобразования даты в формат DD.MM.YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Функция для получения возраста по дате рождения
function getAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Функция для форматирования времени в формат MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Функция для копирования текста в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Текст скопирован в буфер обмена');
    }).catch(function(err) {
        console.error('Ошибка при копировании текста: ', err);
    });
}

// Функция для получения параметров URL
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

// Функция для добавления параметров к URL
function addUrlParam(url, key, value) {
    const urlObj = new URL(url);
    urlObj.searchParams.set(key, value);
    return urlObj.toString();
}

// Функция для debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Функция для throttle
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Функция для глубокого клонирования объекта
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Функция для объединения объектов
function mergeObjects(target, source) {
    const result = {...target};
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                result[key] = mergeObjects(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
    }
    return result;
}

// Функция для проверки, является ли объект пустым
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// Функция для получения случайного элемента из массива
function getRandomItem(array) {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
}

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Функция для создания элемента с атрибутами
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attributes)) {
        if (key.startsWith('on')) {
            // Обработчики событий
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === 'className') {
            // Классы
            element.className = value;
        } else if (key === 'textContent' || key === 'innerHTML') {
            // Текстовое содержимое
            element[key] = value;
        } else {
            // Обычные атрибуты
            element.setAttribute(key, value);
        }
    }
    
    // Добавляем дочерние элементы
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Функция для форматирования больших чисел (например, 1000 -> 1K)
function formatLargeNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Функция для проверки, находится ли элемент в области просмотра
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Функция для прокрутки к элементу
function scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Функция для проверки поддержки WebGL
function isWebGLSupported() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
                  (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

// Функция для проверки поддержки touch-событий
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Функция для получения URL-адреса изображения с учетом текущего контекста
function getImageUrl(path) {
    if (path.startsWith('http')) {
        return path;
    }
    
    if (path.startsWith('/')) {
        return window.location.origin + path;
    }
    
    return new URL(path, window.location).href;
}

// Функция для загрузки внешнего скрипта
function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Функция для загрузки внешнего CSS
function loadExternalCSS(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

// Функция для получения расширения файла
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

// Функция для форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Функция для генерации UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        validateEmail,
        validateAge,
        validateHeight,
        validateWeight,
        validatePercentage,
        getRandomInt,
        getCurrentDate,
        formatDate,
        getAge,
        formatTime,
        copyToClipboard,
        getUrlParams,
        addUrlParam,
        debounce,
        throttle,
        deepClone,
        mergeObjects,
        isEmpty,
        getRandomItem,
        shuffleArray,
        createElement,
        formatLargeNumber,
        isInViewport,
        scrollToElement,
        isWebGLSupported,
        isTouchDevice,
        getImageUrl,
        loadExternalScript,
        loadExternalCSS,
        getFileExtension,
        formatFileSize,
        generateUUID
    };
}