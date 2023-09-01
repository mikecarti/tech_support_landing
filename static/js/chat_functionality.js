import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { sleep } from "./welcome.js";
const chatMessages = document.getElementById('chat-messages');

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

export async function sendMessageAndGetResponse(message, chat_messages_container, nodeSliders, endpoint, senders) {
    if (message!=='') {
        drawMessage(senders[0], message, chat_messages_container);
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
            if (Array.isArray(data.args) && data.args.length === 0) {
                console.log("No function call is needed");
                drawMessage(senders[1], data.response, chat_messages_container);
            } 
            
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
