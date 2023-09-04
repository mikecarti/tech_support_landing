const sliders_popup_button = document.getElementById('sliders-popup-button');
const sliders_popup = document.getElementById('sliders-container');
const sliders = document.getElementById('sliders');

let sliders_up = false;
let sliders_height = sliders.offsetHeight;
sliders_popup.style.bottom = `-${sliders_height}px`;

sliders_popup_button.addEventListener('click', () => {
    
    if (sliders_up) {
        sliders_popup.style.bottom = `-${sliders.offsetHeight}px`;
    } else {
        sliders_popup.style.bottom = '0';
    }
    
    sliders_up = !sliders_up;
});