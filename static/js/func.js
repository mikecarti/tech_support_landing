class Func {

    constructor() {
        this.available_functions = [
            "change_background_color",
            "refund_status"
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
}

export const func_call_checker = new Func();