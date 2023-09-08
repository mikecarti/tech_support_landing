class Utils {
    constructor() {
        this.name = 'Utils';
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static setSliderValue(slider, value) {
        slider.value = value;
        const fillPercentage = (value - slider.min) / (slider.max - slider.min) * 100;
        const gradient = `linear-gradient(to right, #7F60F9 0%, #7F60F9 ${fillPercentage}%, #ffffff ${fillPercentage}%, #ffffff 100%)`
        slider.style.background = gradient;

    }

    static animateHeight(element, delta) {
        const newHeight = `${element.offsetHeight + delta}px`;
        element.animate({height: newHeight}, 500)
    }
}

export default Utils;