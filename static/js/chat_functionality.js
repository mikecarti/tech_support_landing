const chatMessages = document.getElementById('chat-messages');

export function getLlmAnswer(message, endpoint) {
    if (message !== '') {
        addMessage('user', message);
        scrollToBottom();
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
                console.log(data);
                const responseText = data.response;
                addMessage('llm',responseText);
                scrollToBottom();
            })
        
    }
}

export function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    const messageContainer = document.createElement('div');
    messageContainer.className ='message-container';
    messageElement.className = `message-${sender}`;
    messageElement.textContent = text;
    messageContainer.appendChild(messageElement);
    chatMessages.appendChild(messageContainer);
}

export function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
