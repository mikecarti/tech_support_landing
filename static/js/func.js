class Func {

    constructor() {
        this.available_functions = [
            "sin",
            "cos",
            "tan",
            "asin"];
    }

    check_availability(function_name)  {
        return this.available_functions.includes(function_name);
    }

    run_function(obj, function_name, args) {
        if (typeof obj[function_name] === "function") {
            obj[function_name](...args);
        } else {
            console.log(`Функция ${function_name} не найдена в объекте.`)
        }
    }
}