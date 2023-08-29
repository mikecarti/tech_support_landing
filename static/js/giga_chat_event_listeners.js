import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { sleep } from "./welcome.js";
import { sendMessageAndGetResponse } from "./chat_functionality.js";

const gigamessageInput = document.getElementById('giga-chat-message-input');
const gigasendButton = document.getElementById("giga-chat-send-button");
const sliders = document.querySelectorAll("input[type='range']");
const gigaMessagesContainer = document.getElementById('giga-chat-messages');

gigasendButton.addEventListener('click', () => {
    const message = gigamessageInput.value.trim();
    const data_endpoint = gigasendButton.getAttribute('data-endpoint');
    sendMessageAndGetResponse(message, gigaMessagesContainer, sliders, data_endpoint);
    gigamessageInput.value = '';
});

gigamessageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        gigasendButton.click();
    }
});