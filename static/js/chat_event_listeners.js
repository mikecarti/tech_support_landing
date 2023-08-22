import { getLlmAnswer } from "./chat_functionality.js";
import { sendSlidersDataToEndpoint, nodeSlidersToJSONSldiers } from "./chat_sliders.js";

const closeButton = document.getElementById('close-button');
const openButton = document.getElementById('open-popup');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatWindow = document.getElementById('chat-popup');
const sliders = document.querySelectorAll("input[type='range']");

openButton.addEventListener('click', () => {
    chatWindow.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

messageInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
}); 

sendButton.addEventListener('click', () => {
    const slidersData = nodeSlidersToJSONSldiers(sliders);
    const message = messageInput.value.trim();
    const message_endpoint = sendButton.getAttribute('data-endpoint');
    const sliders_endpoint = sendButton.getAttribute('sliders-endpoint');
    sendSlidersDataToEndpoint(slidersData, sliders_endpoint);
    getLlmAnswer(message, message_endpoint);
    messageInput.value = '';

});