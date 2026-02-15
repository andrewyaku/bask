// Модуль для социального компонента и делегирования результатов челленджей для BasketGuide

// Функция для генерации QR-кода (упрощенная версия, в реальном приложении потребуется библиотека)
function generateQRCode(text, size = 200) {
    // В реальном приложении здесь будет использование библиотеки для генерации QR-кода
    // Например, qrcode.js или другая библиотека
    
    // Для демонстрации создаем placeholder-изображение
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Рисуем фон
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Рисуем рамку
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    // Рисуем несколько квадратов для имитации QR-кода
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 20; i++) {
        const x = Math.floor(Math.random() * (size - 20)) + 10;
        const y = Math.floor(Math.random() * (size - 20)) + 10;
        const w = Math.floor(Math.random() * 10) + 5;
        const h = Math.floor(Math.random() * 10) + 5;
        ctx.fillRect(x, y, w, h);
    }
    
    // Добавляем текст в центр
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR-код', size / 2, size / 2);
    
    return canvas.toDataURL();
}

// Функция для генерации ссылки для приглашения
function generateInviteLink(challengeId, userId = null) {
    // Формируем уникальную ссылку для приглашения друга
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/challenges/${challengeId}/invite`;
    
    // Добавляем ID пользователя, если он предоставлен
    if (userId) {
        return `${inviteLink}?ref=${userId}`;
    }
    
    return inviteLink;
}

// Функция для генерации QR-кода приглашения
function generateInviteQR(challengeId, userId = null) {
    const inviteLink = generateInviteLink(challengeId, userId);
    return generateQRCode(inviteLink);
}

// Функция для генерации изображения результата челленджа
function generateChallengeResultImage(challenge, result) {
    // В реальном приложении здесь будет создание изображения с результатами
    // Для демонстрации создаем canvas с информацией
    
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Фон
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FF6B35');
    gradient.addColorStop(1, '#2E8E8C');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Заголовок
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Результат челленджа', canvas.width / 2, 50);
    
    // Название челленджа
    ctx.font = 'bold 18px Arial';
    ctx.fillText(challenge.title, canvas.width / 2, 90);
    
    // Результат
    ctx.font = '20px Arial';
    ctx.fillText(`Результат: ${result}`, canvas.width / 2, 140);
    
    // Дата
    ctx.font = '14px Arial';
    ctx.fillText(`Дата: ${new Date().toLocaleDateString()}`, canvas.width / 2, 180);
    
    // Логотип
    ctx.font = 'italic 16px Arial';
    ctx.fillText('BasketGuide.ru', canvas.width / 2, 250);
    
    return canvas.toDataURL();
}

// Функция для поделиться результатом в социальных сетях
function shareChallengeResult(challenge, result) {
    const shareData = {
        title: `Результат челленджа: ${challenge.title}`,
        text: `Я выполнил челлендж "${challenge.title}" с результатом: ${result}. Попробуй и ты на BasketGuide!`,
        url: window.location.href
    };
    
    // Проверяем поддержку Web Share API
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Успешно поделились'))
            .catch(error => {
                console.error('Ошибка при попытке поделиться:', error);
                fallbackShare(shareData);
            });
    } else {
        // Альтернативный метод для браузеров без поддержки Web Share API
        fallbackShare(shareData);
    }
}

// Альтернативный метод делегирования
function fallbackShare(shareData) {
    // Создаем всплывающее окно с вариантами делегирования
    const shareOptions = `
        <div class="share-modal">
            <div class="share-content">
                <h3>Поделиться результатом</h3>
                <div class="share-buttons">
                    <button class="share-btn" onclick="shareToFacebook('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')">
                        <i class="fab fa-facebook"></i> Facebook
                    </button>
                    <button class="share-btn" onclick="shareToTwitter('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')">
                        <i class="fab fa-twitter"></i> Twitter
                    </button>
                    <button class="share-btn" onclick="shareToVK('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')">
                        <i class="fab fa-vk"></i> ВКонтакте
                    </button>
                    <button class="share-btn" onclick="shareToTelegram('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')">
                        <i class="fab fa-telegram"></i> Telegram
                    </button>
                    <button class="share-btn" onclick="copyToClipboard('${shareData.url}')">
                        <i class="fas fa-copy"></i> Скопировать ссылку
                    </button>
                </div>
                <button class="close-btn" onclick="closeShareModal()">Закрыть</button>
            </div>
        </div>
    `;
    
    // Добавляем стиль для модального окна, если его нет
    if (!document.querySelector('#share-modal-style')) {
        const style = document.createElement('style');
        style.id = 'share-modal-style';
        style.textContent = `
            .share-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            .share-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                text-align: center;
            }
            .share-buttons {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 20px 0;
            }
            .share-btn {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background-color: #f9f9f9;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .share-btn:hover {
                background-color: #e9e9e9;
            }
            .close-btn {
                padding: 10px 20px;
                background-color: #FF6B35;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Добавляем модальное окно на страницу
    const modal = document.createElement('div');
    modal.innerHTML = shareOptions;
    modal.className = 'share-modal';
    modal.id = 'share-modal';
    document.body.appendChild(modal);
}

// Функции для делегирования в конкретные социальные сети
function shareToFacebook(text, url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    window.open(facebookUrl, '_blank');
    closeShareModal();
}

function shareToTwitter(text, url) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank');
    closeShareModal();
}

function shareToVK(text, url) {
    const vkUrl = `https://vk.com/share.php?url=${url}&title=${text}`;
    window.open(vkUrl, '_blank');
    closeShareModal();
}

function shareToTelegram(text, url) {
    const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(telegramUrl, '_blank');
    closeShareModal();
}

// Функция для закрытия модального окна
function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.remove();
    }
}

// Функция для сохранения результата в локальное хранилище
function saveChallengeResultToStorage(challengeId, result, timestamp = new Date().toISOString()) {
    // Проверяем, доступен ли наш модуль хранения
    if (typeof ChallengeResultsStorage !== 'undefined') {
        return ChallengeResultsStorage.addResult(challengeId, result, timestamp);
    } else {
        // Если модуль хранения недоступен, используем localStorage напрямую
        const results = JSON.parse(localStorage.getItem('basketguide_challenge_results') || '[]');
        
        const newResult = {
            id: Date.now(),
            challengeId,
            result,
            timestamp,
            completed: true
        };
        
        results.push(newResult);
        localStorage.setItem('basketguide_challenge_results', JSON.stringify(results));
        
        return true;
    }
}

// Функция для генерации результата в виде карточки
function generateChallengeCard(challenge, result, includeQR = true) {
    const card = document.createElement('div');
    card.className = 'challenge-card shared-result';
    
    // Формируем содержимое карточки
    let qrCodeHtml = '';
    if (includeQR) {
        const qrCode = generateInviteQR(challenge.id);
        qrCodeHtml = `<img src="${qrCode}" alt="QR-код приглашения" class="qr-code" />`;
    }
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${challenge.title}</h3>
        </div>
        <div class="card-body">
            <div class="challenge-result">
                <h4>Результат:</h4>
                <p class="result-value">${result}</p>
            </div>
            <div class="challenge-meta">
                <p><strong>Сложность:</strong> ${getDifficultyLabel(challenge.difficulty)}</p>
                <p><strong>Тип:</strong> ${getTypeLabel(challenge.type)}</p>
                <p><strong>Дата:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            ${qrCodeHtml}
        </div>
        <div class="card-footer">
            <button class="btn btn-primary" onclick="shareChallengeResult(${JSON.stringify(challenge)}, '${result}')">
                Поделиться
            </button>
            <button class="btn btn-secondary" onclick="saveChallengeResultToStorage('${challenge.id}', '${result}')">
                Сохранить
            </button>
        </div>
    `;
    
    return card;
}

// Вспомогательные функции для отображения
function getDifficultyLabel(difficulty) {
    const labels = {
        'easy': 'Легкий',
        'medium': 'Средний',
        'hard': 'Сложный'
    };
    return labels[difficulty] || difficulty;
}

function getTypeLabel(type) {
    const labels = {
        'skill': 'Навыки',
        'physics': 'Физика',
        'rules': 'Правила',
        'agility': 'Ловкость',
        'endurance': 'Выносливость'
    };
    return labels[type] || type;
}

// Функция для генерации приглашения друга
function generateFriendInvite(challengeId, challengeTitle) {
    // Создаем контейнер для приглашения
    const inviteContainer = document.createElement('div');
    inviteContainer.className = 'friend-invite';
    
    // Генерируем QR-код
    const qrCode = generateInviteQR(challengeId);
    
    inviteContainer.innerHTML = `
        <div class="invite-content">
            <h3>Пригласить друга</h3>
            <p>Пригласите друга пройти челлендж: "${challengeTitle}"</p>
            <div class="qr-container">
                <img src="${qrCode}" alt="QR-код для приглашения друга" />
                <p>Отсканируйте QR-код для приглашения</p>
            </div>
            <div class="invite-actions">
                <button class="btn btn-primary" onclick="shareInviteLink('${challengeId}')">
                    Поделиться ссылкой
                </button>
                <button class="btn btn-secondary" onclick="downloadQRCode('${qrCode}', 'challenge-invite-${challengeId}')">
                    Скачать QR-код
                </button>
            </div>
        </div>
    `;
    
    return inviteContainer;
}

// Функция для поделиться ссылкой приглашения
function shareInviteLink(challengeId) {
    const inviteLink = generateInviteLink(challengeId);
    
    if (navigator.share) {
        navigator.share({
            title: 'Приглашение на челлендж',
            text: 'Приглашаю тебя пройти интересный баскетбольный челлендж!',
            url: inviteLink
        }).catch(error => {
            console.error('Ошибка при попытке поделиться:', error);
            copyToClipboard(inviteLink);
        });
    } else {
        copyToClipboard(inviteLink);
    }
}

// Функция для скачивания QR-кода
function downloadQRCode(qrCodeDataUrl, filename) {
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Функция для отображения таблицы лидеров
function showLeaderboard(challengeId, limit = 10) {
    // Проверяем, доступен ли наш модуль хранения
    if (typeof LeaderboardStorage !== 'undefined') {
        const leaderboard = LeaderboardStorage.getTopResults(challengeId, limit);
        
        // Создаем таблицу лидеров
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.className = 'leaderboard-container';
        
        leaderboardContainer.innerHTML = `
            <div class="leaderboard-header">
                <h3>Таблица лидеров: ${challengeId}</h3>
            </div>
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Место</th>
                        <th>Игрок</th>
                        <th>Результат</th>
                        <th>Дата</th>
                    </tr>
                </thead>
                <tbody>
                    ${leaderboard.map((entry, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${entry.userName || entry.userId}</td>
                            <td>${entry.score}</td>
                            <td>${new Date(entry.timestamp).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        return leaderboardContainer;
    } else {
        // Если модуль хранения недоступен, показываем сообщение
        const message = document.createElement('div');
        message.className = 'message info';
        message.textContent = 'Таблица лидеров временно недоступна';
        return message;
    }
}

// Функция для добавления результата в таблицу лидеров
function addToLeaderboard(challengeId, userId, score, userName = 'Аноним') {
    // Проверяем, доступен ли наш модуль хранения
    if (typeof LeaderboardStorage !== 'undefined') {
        LeaderboardStorage.addToLeaderboard(challengeId, userId, score, userName);
    } else {
        console.warn('Модуль LeaderboardStorage недоступен');
    }
}

// Инициализация модуля
function initSharingModule() {
    console.log('Модуль социального компонента инициализирован');
    
    // Добавляем обработчики для кнопок делегирования на странице
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-share-result]')) {
            e.preventDefault();
            const challengeId = e.target.getAttribute('data-challenge-id');
            const result = e.target.getAttribute('data-result');
            
            // В реальном приложении здесь будет получение данных челленджа
            const mockChallenge = {
                id: challengeId,
                title: 'Пример челленджа',
                difficulty: 'medium',
                type: 'skill'
            };
            
            shareChallengeResult(mockChallenge, result);
        }
        
        if (e.target.matches('[data-invite-friend]')) {
            e.preventDefault();
            const challengeId = e.target.getAttribute('data-challenge-id');
            const challengeTitle = e.target.getAttribute('data-challenge-title');
            
            const inviteElement = generateFriendInvite(challengeId, challengeTitle);
            
            // Показываем приглашение (в реальном приложении может быть модальное окно)
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.appendChild(inviteElement);
            
            // Добавляем стили для модального окна
            const modalStyle = document.createElement('style');
            modalStyle.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                }
                .friend-invite {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                }
                .qr-container img {
                    max-width: 200px;
                    margin: 10px auto;
                    display: block;
                }
            `;
            document.head.appendChild(modalStyle);
            
            document.body.appendChild(modal);
            
            // Добавляем обработчик для закрытия модального окна
            modal.addEventListener('click', function(closeEvent) {
                if (closeEvent.target === modal) {
                    modal.remove();
                    modalStyle.remove();
                }
            });
        }
    });
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initSharingModule, 100);
});

// Экспорт функций для использования в других модулях (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateQRCode,
        generateInviteLink,
        generateInviteQR,
        generateChallengeResultImage,
        shareChallengeResult,
        fallbackShare,
        closeShareModal,
        saveChallengeResultToStorage,
        generateChallengeCard,
        generateFriendInvite,
        shareInviteLink,
        downloadQRCode,
        showLeaderboard,
        addToLeaderboard,
        initSharingModule
    };
}