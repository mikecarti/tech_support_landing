import { sendMessageAndGetResponse } from "./chat_functionality.js";

const giga_chat_senders = ["giga-user", "giga-llm"]
const gigamessageInput = document.getElementById('giga-chat-message-input');
const gigasendButton = document.getElementById("giga-chat-send-button");
const sliders = document.querySelectorAll("input[type='range']");
const gigaMessagesContainer = document.getElementById('giga-chat-messages');
const preset_buttons_container = document.getElementById('sections');
const preset_buttons = preset_buttons_container.querySelectorAll('button');
const preset_messages = ["Расскажите о ваших продуктах.", "Расскажите об особенностях ваших ботов.", "Какие цены?", "Поддержка."];

gigasendButton.addEventListener('click', () => {
    window.cancelWelcome = true;
    const message = gigamessageInput.value.trim();
    const data_endpoint = gigasendButton.getAttribute('data-endpoint');
    sendMessageAndGetResponse(message, gigaMessagesContainer, sliders, data_endpoint, giga_chat_senders);
    gigamessageInput.value = '';
});

gigamessageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        gigasendButton.click();
    }
});

sliders.forEach((slider) => {
    slider.addEventListener("input", () => {
        const value = slider.value;
        const fillPercentage = (value - slider.min) / (slider.max - slider.min) * 100;
        const gradient = `linear-gradient(to right, #7F60F9 0%, #7F60F9 ${fillPercentage}%, #ffffff ${fillPercentage}%, #ffffff 100%)`
        slider.style.background = gradient;
    });
});

preset_buttons.forEach((button, index) => {
    button.addEventListener('click', async () => {
        window.cancelWelcome = true;
        const preset_data_endpoint = button.getAttribute('data-endpoint');
        await sendMessageAndGetResponse(preset_messages[index], gigaMessagesContainer, sliders, preset_data_endpoint, giga_chat_senders);
        
    });
});