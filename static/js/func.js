import Utils from "./utils.js";

class Func {

    constructor() {
        this.available_functions = [
            "change_background_color",
            "randomize_personality_sliders",
            "change_message_color"
            ];
    }

    check_availability(function_name)  {
        return this.available_functions.includes(function_name);
    }

    run_function(function_name, args) {
        if (typeof this[function_name] === "function") {
            this[function_name](...args);
        } else {
            console.log(`Функция ${function_name} не найдена в объекте.`)
        }
    }

    change_background_color(color) {
        const body_obj = document.body;
        body_obj.style.backgroundColor = color;
    }

    change_message_color(color) {
        const styleElement = document.createElement("style");
        styleElement.innerHTML = `.message-giga-user {background-color: ${color};}`;
        document.head.appendChild(styleElement);
    }

    randomize_personality_sliders(...values) {
        const sliders = document.querySelectorAll("input[type='range']");
        sliders.forEach((slider, index) => {
            Utils.setSliderValue(slider, values[index]);
        });
    }

}

export const func_call_checker = new Func();