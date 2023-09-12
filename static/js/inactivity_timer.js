import { drawMessage } from "./chat_functionality.js";

class inactivityTimer {
    constructor() {
        this.timeOut = 40000 //ms
    }

    async setTimer(chat_message_container) {
        const text = await this._getHintMessage();
        this.timer = setTimeout(async () => {
            await drawMessage("giga-llm", text, chat_message_container)
        }, this.timeOut)
    }

    async disableTimer() {
        clearTimeout(this.timer)
    }

    resetTimer() {
        clearTimeout(this.timeout)
        setTimeout()
    }

    async _getHintMessage() {
        try {
            const response = await fetch('/get_hint');
            if (!response.ok) {
                throw new Error('Ошибка HTTP: ' + response.status);
            }
            const data = await response.json();
            return data.text; // Возвращаем значение data.text
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    
    }
}

export const timer = new inactivityTimer();