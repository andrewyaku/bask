// Модуль для работы с таймерами челленджей для BasketGuide

// Класс для управления таймером челленджа
class ChallengeTimer {
    constructor(duration, onTick = null, onComplete = null) {
        this.duration = duration; // в секундах
        this.timeLeft = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.intervalId = null;
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pauseTime = null;
    }
    
    // Запустить таймер
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now() - ((this.duration - this.timeLeft) * 1000);
        
        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;
                
                // Вызываем колбэк при каждом тике
                if (this.onTick) {
                    this.onTick(this.timeLeft);
                }
                
                // Проверяем, закончилось ли время
                if (this.timeLeft <= 0) {
                    this.stop();
                    if (this.onComplete) {
                        this.onComplete();
                    }
                }
            }
        }, 1000);
    }
    
    // Приостановить таймер
    pause() {
        if (!this.isRunning || this.isPaused) return;
        
        this.isPaused = true;
        this.pauseTime = Date.now();
    }
    
    // Возобновить таймер
    resume() {
        if (!this.isRunning || !this.isPaused) return;
        
        this.isPaused = false;
        // Корректируем время с учетом паузы
        const pauseDuration = Date.now() - this.pauseTime;
        this.startTime += pauseDuration;
    }
    
    // Остановить таймер
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        this.isPaused = false;
    }
    
    // Сбросить таймер
    reset() {
        this.stop();
        this.timeLeft = this.duration;
    }
    
    // Получить оставшееся время в формате MM:SS
    getTimeFormatted() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Получить процент выполнения таймера
    getProgressPercentage() {
        return this.duration > 0 ? Math.round(((this.duration - this.timeLeft) / this.duration) * 100) : 0;
    }
    
    // Получить оставшееся время в секундах
    getTimeLeft() {
        return this.timeLeft;
    }
    
    // Проверить, работает ли таймер
    getIsRunning() {
        return this.isRunning;
    }
    
    // Проверить, на паузе ли таймер
    getIsPaused() {
        return this.isPaused;
    }
}

// Класс для визуального таймера с отображением
class VisualChallengeTimer extends ChallengeTimer {
    constructor(duration, displayElement, progressBarElement = null, onTick = null, onComplete = null) {
        super(duration, onTick, onComplete);
        this.displayElement = typeof displayElement === 'string' ? 
            document.querySelector(displayElement) : displayElement;
        this.progressBarElement = typeof progressBarElement === 'string' ? 
            document.querySelector(progressBarElement) : progressBarElement;
        
        // Устанавливаем начальное отображение
        this.updateDisplay();
    }
    
    // Обновить отображение таймера
    updateDisplay() {
        if (this.displayElement) {
            this.displayElement.textContent = this.getTimeFormatted();
            
            // Добавляем классы для визуальных эффектов
            this.displayElement.classList.remove('warning', 'critical');
            
            if (this.timeLeft <= 10 && this.timeLeft > 0) {
                this.displayElement.classList.add('warning');
            }
            
            if (this.timeLeft <= 5 && this.timeLeft > 0) {
                this.displayElement.classList.add('critical');
            }
        }
        
        // Обновляем прогресс-бар, если он указан
        if (this.progressBarElement) {
            const percentage = this.getProgressPercentage();
            this.progressBarElement.style.width = `${percentage}%`;
            this.progressBarElement.setAttribute('aria-valuenow', percentage);
        }
    }
    
    // Переопределяем метод onTick для обновления отображения
    start() {
        // Сохраняем оригинальный onTick
        const originalOnTick = this.onTick;
        
        // Устанавливаем новый onTick, который обновляет отображение
        this.onTick = (timeLeft) => {
            this.updateDisplay();
            
            // Вызываем оригинальный колбэк, если он есть
            if (originalOnTick) {
                originalOnTick(timeLeft);
            }
        };
        
        // Вызываем родительский метод start
        super.start();
        
        // Обновляем отображение сразу
        this.updateDisplay();
    }
    
    // Остановить таймер и обновить отображение
    stop() {
        super.stop();
        this.updateDisplay();
    }
    
    // Сбросить таймер и обновить отображение
    reset() {
        super.reset();
        this.updateDisplay();
    }
}

// Класс для работы с несколькими таймерами
class MultiChallengeTimer {
    constructor() {
        this.timers = new Map();
    }
    
    // Добавить таймер
    addTimer(timerId, duration, displayElement, progressBarElement = null, onTick = null, onComplete = null) {
        const timer = new VisualChallengeTimer(duration, displayElement, progressBarElement, onTick, onComplete);
        this.timers.set(timerId, timer);
        return timer;
    }
    
    // Получить таймер по ID
    getTimer(timerId) {
        return this.timers.get(timerId);
    }
    
    // Запустить таймер по ID
    startTimer(timerId) {
        const timer = this.getTimer(timerId);
        if (timer) {
            timer.start();
        }
    }
    
    // Остановить таймер по ID
    stopTimer(timerId) {
        const timer = this.getTimer(timerId);
        if (timer) {
            timer.stop();
        }
    }
    
    // Сбросить таймер по ID
    resetTimer(timerId) {
        const timer = this.getTimer(timerId);
        if (timer) {
            timer.reset();
        }
    }
    
    // Удалить таймер по ID
    removeTimer(timerId) {
        const timer = this.getTimer(timerId);
        if (timer) {
            timer.stop();
            this.timers.delete(timerId);
        }
    }
    
    // Остановить все таймеры
    stopAllTimers() {
        this.timers.forEach(timer => timer.stop());
    }
    
    // Сбросить все таймеры
    resetAllTimers() {
        this.timers.forEach(timer => timer.reset());
    }
}

// Функция для создания таймера с стандартными настройками
function createStandardChallengeTimer(duration, containerId) {
    const container = typeof containerId === 'string' ? 
        document.getElementById(containerId) : containerId;
    
    if (!container) {
        console.error(`Контейнер с ID "${containerId}" не найден для таймера`);
        return null;
    }
    
    // Создаем элементы для отображения таймера
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'challenge-timer-display';
    timerDisplay.textContent = formatTime(duration);
    
    const progressBar = document.createElement('div');
    progressBar.className = 'challenge-timer-progress';
    progressBar.innerHTML = '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>';
    
    container.appendChild(timerDisplay);
    container.appendChild(progressBar);
    
    // Создаем визуальный таймер
    const timer = new VisualChallengeTimer(
        duration,
        timerDisplay,
        progressBar.querySelector('.progress-bar')
    );
    
    return timer;
}

// Функция для форматирования времени в MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Функция для создания обратного отсчета с аудио-уведомлениями
function createAudioEnhancedTimer(duration, displayElement, audioWarningThreshold = 10) {
    // Создаем аудио-контекст для звуковых сигналов (если поддерживается)
    let audioContext = null;
    let warningSound = null;
    let completeSound = null;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Аудио-контекст не поддерживается в этом браузере');
    }
    
    // Функция для воспроизведения звукового сигнала
    const playBeep = (frequency = 800, duration = 100, volume = 0.1) => {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        gainNode.gain.value = volume;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration / 1000);
    };
    
    // Создаем таймер с расширенной логикой
    const timer = new VisualChallengeTimer(
        duration,
        displayElement,
        null,
        (timeLeft) => {
            // Воспроизводим звуковое уведомление при достижении порога
            if (timeLeft === audioWarningThreshold) {
                playBeep(1000, 300); // Высокий звук
            } else if (timeLeft <= 5 && timeLeft > 0) {
                playBeep(1200, 200); // Еще более высокий звук каждую секунду
            }
        },
        () => {
            // Звуковой сигнал при завершении
            playBeep(500, 1000); // Низкий длительный звук
        }
    );
    
    return timer;
}

// Глобальный экземпляр мультитаймера для использования в приложении
const globalChallengeTimer = new MultiChallengeTimer();

// Функция для инициализации таймеров на странице
function initPageTimers() {
    // Ищем все элементы с атрибутом data-challenge-timer
    const timerElements = document.querySelectorAll('[data-challenge-timer]');
    
    timerElements.forEach((element, index) => {
        const duration = parseInt(element.getAttribute('data-challenge-timer'));
        const timerId = element.id || `timer-${index}`;
        
        // Создаем таймер для элемента
        const timer = createStandardChallengeTimer(duration, element);
        
        if (timer) {
            // Автоматически запускаем таймер
            timer.start();
            
            // Сохраняем таймер в глобальном менеджере
            globalChallengeTimer.addTimer(timerId, duration, element);
        }
    });
    
    console.log(`Инициализировано ${timerElements.length} таймеров на странице`);
}

// Функция для остановки всех таймеров на странице
function stopAllPageTimers() {
    globalChallengeTimer.stopAllTimers();
}

// Функция для сброса всех таймеров на странице
function resetAllPageTimers() {
    globalChallengeTimer.resetAllTimers();
}

// Инициализация таймеров при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initPageTimers, 100);
});

// Добавляем обработчик события перед выгрузкой страницы для корректной остановки таймеров
window.addEventListener('beforeunload', function() {
    stopAllPageTimers();
});

// Экспорт классов и функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ChallengeTimer,
        VisualChallengeTimer,
        MultiChallengeTimer,
        globalChallengeTimer,
        createStandardChallengeTimer,
        createAudioEnhancedTimer,
        formatTime,
        initPageTimers,
        stopAllPageTimers,
        resetAllPageTimers
    };
}