// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');
const closeMenu = document.getElementById('closeMenu');

// Открытие мобильного меню
menuToggle.addEventListener('click', () => {
    navMobile.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Закрытие мобильного меню
closeMenu.addEventListener('click', () => {
    navMobile.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Закрытие меню при клике на ссылку
const mobileLinks = document.querySelectorAll('.nav-mobile .nav-link');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMobile.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Раскрывающееся меню в мобильной версии
const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
const mobileDropdown = document.querySelector('.mobile-dropdown');

if (mobileDropdownToggle) {
    mobileDropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        mobileDropdown.classList.toggle('active');
        mobileDropdownToggle.classList.toggle('active');
    });
}

// Слайдер
const slider = document.getElementById('slider');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const sliderDots = document.getElementById('sliderDots');

let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Создание точек для слайдера
function createSliderDots() {
    sliderDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', i);
        sliderDots.appendChild(dot);
        
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetSlideInterval();
        });
    }
}

// Функция перехода к определенному слайду
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Обновление активной точки
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Кнопка "Назад"
sliderPrev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
    resetSlideInterval();
});

// Кнопка "Вперед"
sliderNext.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
    resetSlideInterval();
});

// Автопереключение слайдов
function startSlideInterval() {
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);
}

// Сброс интервала автопереключения
function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}

// Остановка автопереключения при наведении на слайдер
const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

sliderContainer.addEventListener('mouseleave', () => {
    startSlideInterval();
});

// Инициализация слайдера
createSliderDots();
startSlideInterval();

// FAQ - Аккордеон
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Закрываем все остальные вопросы
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Открываем/закрываем текущий вопрос
        item.classList.toggle('active');
    });
});

// Плавная прокрутка для ссылок навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Для выпадающих меню не применяем плавную прокрутку
        if (this.classList.contains('dropdown-item') || 
            this.getAttribute('href') === '#') {
            return;
        }
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрываем мобильное меню, если оно открыто
            if (navMobile.classList.contains('active')) {
                navMobile.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Изменение навигации при скролле
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(139, 69, 19, 0.1)';
    }
});

// ================================================
// AJAX ОТПРАВКА ФОРМЫ НА SLAPFORM БЕЗ ПЕРЕХОДА
// ================================================

const orderForm = document.getElementById('orderForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

// Обработка отправки формы
orderForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // ОСТАНОВИТЬ обычную отправку формы
    
    // Показываем загрузку
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Отправка...";
    submitBtn.disabled = true;
    
    // Показываем сообщение об отправке
    formMessage.textContent = '📤 Отправляем ваш заказ...';
    formMessage.classList.remove('error');
    formMessage.classList.add('success');
    
    try {
        // Собираем данные формы
        const formData = new FormData(orderForm);
        
        // Преобразуем FormData в объект
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Добавляем дополнительные данные
        data['timestamp'] = new Date().toISOString();
        data['source'] = 'Сайт Sweet Moments';
        
        // Отправляем AJAX запрос на Slapform
        const response = await fetch('https://api.slapform.com/GI9UE0ibM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        // Проверяем ответ
        const result = await response.json();
        
        if (response.ok && result.success !== false) {
            // УСПЕХ! Форма отправлена
            formMessage.textContent = '✅ Заказ успешно отправлен! Мы свяжемся с вами в течение 2 часов.';
            
            // Очищаем форму
            orderForm.reset();
            
            // Прячем сообщение через 7 секунд
            setTimeout(() => {
                formMessage.classList.remove('success');
                formMessage.textContent = '';
            }, 7000);
            
        } else {
            // Ошибка от Slapform
            throw new Error(result.message || 'Ошибка отправки формы');
        }
        
    } catch (error) {
        // Ошибка сети или другая ошибка
        console.error('Ошибка отправки:', error);
        
        formMessage.textContent = '❌ Ошибка при отправке. Пожалуйста, попробуйте еще раз или позвоните нам.';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        
        // Прячем сообщение об ошибке через 5 секунд
        setTimeout(() => {
            formMessage.classList.remove('error');
            formMessage.textContent = '';
        }, 5000);
        
    } finally {
        // Всегда восстанавливаем кнопку
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});
