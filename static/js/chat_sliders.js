const user_grammar_nazi_slider = document.getElementById("user-grammar-nazi");
const user_rage_slider = document.getElementById("user-rage");
const bot_grammar_nazi_slider = document.getElementById("bot-grammar-nazi");
const bot_rage_slider = document.getElementById("bot-rage");

const sliders = document.querySelectorAll("input[type='range']");

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

function handleSliderChange(sliderID, sliderValue) {
    // console.log(`Значение ползунка ${sliderID} изменено на ${sliderValue}`);
}

function sendSliderDataToBackend(sliderID, sliderValue) {
    fetch("/manual-slider-update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sliderID: sliderID,
            sliderValue: sliderValue
        })
    })
    .then(response => response.json())
}

export function sendSlidersDataToEndpoint(sliders, endpoint) {
    /*
    fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sliders)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error("Произошла ошибка", error));
    */
    const jsonString = JSON.stringify(sliders);
    var urlEncodedJson = encodeURIComponent(jsonString);
    var url = `http://localhost:5000/${endpoint}?sliderID=${urlEncodedJson}`
    fetch(url)
        .then(response => response.text())
        .then(responseText => console.log(responseText))
        .catch(error => console.error("Произошла ошибка", error));
    console.log(url);
}

sliders.forEach((slider) => {
    slider.addEventListener("input", () => {
        handleSliderChange(slider.id, slider.value);
        // sendSliderDataToBackend(slider.id, slider.value);
    });
});

