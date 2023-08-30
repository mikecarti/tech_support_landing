import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { sleep } from "./welcome.js";
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

export async function sendMessageAndGetResponse(message, chat_messages_container, nodeSliders, endpoint) {
    if (message!=='') {
        drawMessage('user', message, chat_messages_container);
        scrollToBottom();
        const combinedData = combineMessageAndSliders(message, nodeSliders);
        await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(combinedData)
        })
        .then(async response => await response.json())
        .then(data => {
            console.log(data);
            drawMessage('llm', data.response, chat_messages_container);
            scrollToBottom();
        })
        .catch(error => console.log("Ошибка: ", error));
    }
}

export function drawMessage(sender, text, chat_messages_container) {
    if (text !== null) {
        const messageElement = document.createElement('div');
        const messageContainer = document.createElement('div');
        messageContainer.className ='message-container';
        messageElement.className = `message-${sender}`;
        messageElement.textContent = text;
        messageContainer.appendChild(messageElement);
        chat_messages_container.appendChild(messageContainer);
    }
}

export function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
