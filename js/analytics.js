// Google Analytics 4 для BasketGuide
// Measurement ID: G-CXJLTKYPRN

// Google tag (gtag.js)
(function() {
  // Создаем скрипт gtag
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-CXJLTKYPRN';
  document.head.appendChild(script);

  // Инициализируем dataLayer и gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  script.onload = function() {
    gtag('js', new Date());
    gtag('config', 'G-CXJLTKYPRN');
    
    // Отслеживание просмотров страниц (автоматически для SPA)
    trackPageView();
  };
})();

// Функция для отслеживания просмотров страниц
function trackPageView() {
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
}

// Функция для отслеживания событий
function trackEvent(category, action, label, value) {
  if (typeof gtag === 'function') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}

// Экспортируем функции для использования в других скриптах
window.BasketGuideAnalytics = {
  trackEvent: trackEvent,
  trackPageView: trackPageView,
  
  // Отслеживание использования калькулятора
  trackCalculator: function(calculatorId, result) {
    trackEvent('calculator', 'calculate', calculatorId, result);
  },
  
  // Отслеживание завершения челленджа
  trackChallenge: function(challengeId, completed) {
    trackEvent('challenge', completed ? 'completed' : 'started', challengeId);
  },
  
  // Отслеживание просмотра статьи
  trackArticle: function(articleId, category) {
    trackEvent('blog', 'view_article', articleId + ' - ' + category);
  },
  
  // Отслеживание просмотра правила
  trackRule: function(ruleId) {
    trackEvent('rules', 'view_rule', ruleId);
  },
  
  // Отслеживание просмотра тренировочного плана
  trackPlan: function(planId) {
    trackEvent('plans', 'view_plan', planId);
  },
  
  // Отслеживание клика по внешней ссылке
  trackOutboundLink: function(url) {
    trackEvent('outbound', 'click', url);
  }
};
