const slider = document.querySelector('.about-us');
const slides = document.querySelectorAll('.slide');
let currentIndex = 1;
const titles = [`NeuroSquare: путь к инновационным решениям!`,
                "Оптимизируй работу поддержки:",
                "Преимущества нашей технологии:",
                "Что ты получишь в итоге:"]

const text = [
    `
    <ul>
    <li>Создание умных ботов с применением нейросети.</li>
    <li>Предоставление простых и качественных решений.</li>
    <li>Апгрейд вашего бизнеса до нового уровня.</li>
    <li>Быстро и качественно.</li>
    </ul>
    `,
    `
    <ul>
    <li>ИИ решит проблему</li>
    <li>ИИ справится с сложными задачами</li>
    <li>ИИ учитывает контекст</li>
    <li>ИИ заменяет человека</li>
    </ul>
    `,
    `
    <ul>
    <li>Высокая производительность ИИ</li>
    <li>Быстрое обучение</li>
    <li>Сокращение расходов на персонал</li>
    <li>Обработка тысяч запросов </li>
    <ul>
    `,
    `
    <ul>
    <li>ИИ чат-бот понимает проблему клиента не хуже профессионального специалиста службы поддержки</li>
    <li>ИИ быстро адаптируется под внутренние проекты: для хорошего функционирования бота достаточно небольших FAQ-ов</li>
    <li>Бот может вести продолжительные диалоги, которые приводят к разрешению проблем клиента.</li>
    <li>Наша технология призывает внушительно сократить или полностью заменить живую чат-поддержку</li>
    <ul>
    `,
]

function goToSlide(index) {
    slides.forEach((slide) => {
        slide.style.transform = `translateX(${-100*index}%)`;
    })
}

setInterval(() => {
    goToSlide(currentIndex);
    currentIndex++;
    currentIndex = currentIndex % slides.length;
}, 10000);

slides.forEach((slide, index) => {
    const titleElement = slide.querySelector('.slide-title');
    const textElement = slide.querySelector('.slide-text');
    if (titleElement) {
        titleElement.innerHTML = `${titles[index]}`;
        
    }
    
    if (textElement) {
        textElement.innerHTML = `${text[index]}`;
    }
});