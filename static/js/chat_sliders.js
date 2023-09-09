const user_grammar_nazi_slider = document.getElementById("user-grammar-nazi");
const user_rage_slider = document.getElementById("user-rage");
const bot_grammar_nazi_slider = document.getElementById("bot-grammar-nazi");
const bot_rage_slider = document.getElementById("bot-rage");
const sliders_popup_button = document.getElementById("sliders-popup-button");
const sldiers_button_image = document.getElementById("sliders-popup-img");
const sliders = document.querySelectorAll("input[type='range']");
let isSldersOpen = false;

export function nodeSlidersToJSONSliders(nodeSliders) {
    const slidersArray = Array.from(nodeSliders);
    const slidersData = slidersArray.map(slider => {
        return {
            sliderID: slider.id,
            sliderValue: slider.value
        };
    });
    return slidersData;
}

export function sendSlidersDataToEndpoint(sliders, endpoint) {
    const jsonString = JSON.stringify(sliders);
    var urlEncodedJson = encodeURIComponent(jsonString);
    var url = `http://localhost:5000/${endpoint}?sliderID=${urlEncodedJson}`
    fetch(url)
        .then(response => response.text())
        .then(responseText => console.log(responseText))
        .catch(error => console.error("Произошла ошибка", error));
    console.log(url);
}

sliders_popup_button.addEventListener("click", () => {
    if (isSldersOpen) {
        sldiers_button_image.style.transform = `rotate(0deg)`;
        isSldersOpen = !isSldersOpen;
    } else {
        sldiers_button_image.style.transform = `rotate(180deg)`;
        isSldersOpen =!isSldersOpen;
    }
    
})