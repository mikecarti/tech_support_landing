import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { func_call_checker } from "./func.js";
const chatMessages = document.getElementById('chat-messages');
const gigaMessages = document.getElementById('giga-chat-messages');

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

export async function sendMessageAndGetResponseWelcome(message, chat_messages_container, nodeSliders, endpoint, senders) {
    if (message!=='') {
        if (!window.cancelWelcome) {
            drawMessage(senders[0], message, chat_messages_container);
        }
        
        scrollToBottom(chat_messages_container);
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
            if (!window.cancelWelcome) {
                drawMessage(senders[1], data.response, chat_messages_container);
            }
            scrollToBottom(chat_messages_container);
        })
        .catch(error => console.log("Ошибка: ", error));
    }
}

export async function sendMessageAndGetResponse(message, chat_messages_container, nodeSliders, endpoint, senders) {
    if (message!=='') {
        drawMessage(senders[0], message, chat_messages_container);
        scrollToBottom(chat_messages_container);
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
            if (Array.isArray(data.args) && data.args.length !== 0) {
                if(func_call_checker.check_availability(data.function_name)){
                    func_call_checker.run_function(data.function_name, data.args);
                } else {
                    console.log("No function call is needed");
                }
            } else {
                console.log("No function call is needed");
            }
            drawMessage(senders[1], data.response, chat_messages_container);
            scrollToBottom(chat_messages_container);
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

export function scrollToBottom(message_container) {
    message_container.scrollTop = message_container.scrollHeight;
}
