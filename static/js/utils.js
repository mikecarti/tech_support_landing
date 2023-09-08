class Utils {
    constructor() {
        this.name = 'Utils';
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export default Utils;