const sliders_popup_button = document.getElementById('sliders-popup-button');
const sliders_popup = document.getElementById('sliders-container');
const sliders = document.getElementById('sliders');

let sliders_up = false;
let sliders_width = sliders.offsetWidth;
sliders_popup.style.left = `-${sliders_width}px`;

sliders_popup_button.addEventListener('click', () => {
    
    if (sliders_up) {
        sliders_popup.style.left = `-${sliders.offsetWidth}px`;
    } else {
        sliders_popup.style.left = '0';
    }
    
    sliders_up = !sliders_up;
});