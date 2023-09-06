import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { func_call_checker } from "./func.js";

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

function getTranslateValue(element) {
    const computedStyle = window.getComputedStyle(element);
    const transformMatrix = new DOMMatrix(computedStyle.transform)
    return transformMatrix.m41;
}

export function drawMessage(sender, text, chat_messages_container) {
    if (text !== null && text !== undefined && text !== NaN && text !== '') {
        const allMessages = chat_messages_container.querySelectorAll('.message-container');
        console.log(allMessages)
        //console.log(getComputedStyle(chat_messages_container));
        const messageElement = document.createElement('div');
        const messageContainer = document.createElement('div');
        messageContainer.className ='message-container';
        messageElement.className = `message-${sender}`;
        messageElement.textContent = text;
        messageContainer.appendChild(messageElement);
        //chat_messages_container.style.height = `${chat_messages_container.style.offsetHeight + messageContainer.offsetHeight}px`;
        //chat_messages_container.style.maxHeight = `${chat_messages_container.offsetHeight + messageContainer.offsetHeight}px`;
        // chat_messages_container.style.height = chat_messages_container.offsetHeight + messageContainer.offsetHeight;
        chat_messages_container.append(messageContainer).animate({
            height: "+=" + messageContainer.height()
        }, 200, function() {
            messageContainer.fadeIn(100);
        });
        //console.log(getComputedStyle(allMessages[0]));
        /*
        allMessages.forEach(element => {
            const translateValue = getTranslateValue(element);
            element.style.bottom = `${messageContainer.offsetHeight}px`;
        });
        */
        setTimeout(() => {
            messageContainer.classList.add('active');
        }, 300);
    }
}

export function scrollToBottom(message_container) {
    //message_container.scrollTop = message_container.scrollHeight;
    //message_container.scroll({top: 0, behavior: "smooth"});
}
