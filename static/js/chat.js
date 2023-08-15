const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatWindow = document.getElementById('chat-popup');
const closeButton = document.getElementById('close-button');
const openButton = document.getElementById('open-popup');

openButton.addEventListener('click', () => {
    chatWindow.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        addMessage('user', message);
        messageInput.value = '';
    }
});

function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
}

