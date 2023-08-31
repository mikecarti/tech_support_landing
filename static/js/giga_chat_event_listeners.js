import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { sleep } from "./welcome.js";
import { sendMessageAndGetResponse } from "./chat_functionality.js";

const giga_senders = ["giga-user", "giga-llm"]
const gigamessageInput = document.getElementById('giga-chat-message-input');
const gigasendButton = document.getElementById("giga-chat-send-button");
const sliders = document.querySelectorAll("input[type='range']");
const gigaMessagesContainer = document.getElementById('giga-chat-messages');

gigasendButton.addEventListener('click', () => {
    const message = gigamessageInput.value.trim();
    const data_endpoint = gigasendButton.getAttribute('data-endpoint');
    sendMessageAndGetResponse(message, gigaMessagesContainer, sliders, data_endpoint, giga_senders);
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