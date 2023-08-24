import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
const chatMessages = document.getElementById('chat-messages');

export function getLlmAnswer(message, endpoint) {
    if (message !== '') {
        drawMessage('user', message);
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
            .then(data => {
                console.log(data);
                const responseText = data.response;
                addMessage('llm',responseText);
                scrollToBottom();
            })
        
    }
}

function combineMessageAndSliders(message, nodeSliders) {
    const charData = {
        message: message
    };
    const slidersData = nodeSlidersToJSONSliders(nodeSliders);
    const combinedData = {
        chat: charData,
        sliders: slidersData
    };
    return combinedData;
}

export function sendMessageAndGetResponse(message, nodeSliders, endpoint) {
    if (message!=='') {
        console.log(message);
        drawMessage('user', message);
        scrollToBottom();
        const combinedData = combineMessageAndSliders(message, nodeSliders);
        console.log(combinedData);
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(combinedData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            drawMessage('llm', data.response);
            scrollToBottom();
        })
        .catch(error => console.log("Ошибка: ", error));
    }
}

export function drawMessage(sender, text) {
    if (text !== null) {
        const messageElement = document.createElement('div');
        const messageContainer = document.createElement('div');
        messageContainer.className ='message-container';
        messageElement.className = `message-${sender}`;
        messageElement.textContent = text;
        messageContainer.appendChild(messageElement);
        chatMessages.appendChild(messageContainer);
    }
}

export function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
