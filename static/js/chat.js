const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatWindow = document.getElementById('chat-popup');
const closeButton = document.getElementById('close-button');
const openButton = document.getElementById('open-popup');
const llmResponse = document.getElementById('llm-api-response');

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
    const endpoint = sendButton.getAttribute('data-endpoint');
    getLlmAnswer(message, endpoint);
    messageInput.value = '';

});

function getLlmAnswer(message, endpoint) {
    if (message !== '') {
        addMessage('user', message);
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
            })
            .then(response => response.json())
            .then(data =>{
                const responseText = data.response;
                addMessage('llm',responseText);
            })
        
    }
}

function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.className = `message-${sender}`;
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
}

function addLLMMessage(text) {
    const llmResponseElement = document.createElement('div');
    llmResponseElement.className = 'llm-response';
    llmResponseElement.textContent = text;
    llmResponse.appendChild(llmResponseElement);
}