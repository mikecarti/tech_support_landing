const sliders_popup_button = document.getElementById('sliders-popup-button');
const sliders_popup = document.getElementById('sliders-container');
const sliders = document.getElementById('sliders');
const sub_slider = document.getElementById('sliders-subcontainer');

let sliders_up = false;
let sliders_width = sliders.offsetWidth;
if (window.innerWidth < 1024) {
    sliders_popup.style.transform = `translate3d(-${window.innerWidth/2 + sliders_popup.offsetWidth/2 - (sliders_popup_button.offsetWidth)}px, 0, 0)`;
}


sliders_popup_button.addEventListener('click', () => {
    
    if (sliders_up) {
        sliders_popup.style.transform = `translate3d(-${window.innerWidth/2 + sliders_popup.offsetWidth/2 - (sliders_popup_button.offsetWidth)}px, 0, 0)`;
    } else {
        sliders_popup.style.transform = `translate3d(-${window.innerWidth/2 - sliders.offsetWidth/2}px, 0, 0)`;
    }
    
    sliders_up = !sliders_up;
});