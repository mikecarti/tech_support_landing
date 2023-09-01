const slider = document.querySelector('.about-us');
const slides = document.querySelectorAll('.slide');
let currentIndex = 1;

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