const sliders_popup_button = document.getElementById('sliders-popup-button');
const sliders_popup = document.getElementById('sliders-container');

let sliders_up = true;

sliders_popup_button.addEventListener('click', () => {
    if (sliders_up) {
        sliders_popup.style.bottom = '-50%';
    } else {
        sliders_popup.style.bottom = '0';
    }
    
    sliders_up = !sliders_up;
});