import { sendMessageAndGetResponse } from "./chat_functionality.js";

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
    const message = messageInput.value.trim();
    const data_endpoint = sendButton.getAttribute('data-endpoint');
    sendMessageAndGetResponse(message, sliders, data_endpoint);
    messageInput.value = '';

});