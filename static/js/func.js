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
        console.log(color);
        var styleElement = document.getElementById("customMessageColor");
        if (!styleElement) {
            styleElement = document.createElement("customMessageColor");
            styleElement.id = "customMessageColor";
        }

        const newCSSRule = `.message-giga-user { background-color: ${color};}`;
        console.log(newCSSRule);
        if (styleElement.sheet && styleElement.sheet.insertRule) {
            styleElement.sheet.insertRule(newCSSRule, 0);
        } else if (styleElement.styleSheet && styleElement.styleSheet.addRule) {
            styleElement.styleSheet.addRule(newCSSRule);
        }
        console.log(styleElement);
    }
}

export const func_call_checker = new Func();