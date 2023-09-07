import {nodeSlidersToJSONSliders} from "./chat_sliders.js";
import {func_call_checker} from "./func.js";

let isWriting = false;

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
    if (message !== '') {
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
    if (message !== '') {
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
                    if (func_call_checker.check_availability(data.function_name)) {
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


export async function drawMessage(sender, text, chat_messages_container) {
    if (text !== null && text !== undefined && text !== NaN && text !== '') {
        if (isWriting) {
            // A message is currently being written, so wait for it to complete before adding the new message.
            await new Promise(resolve => setTimeout(resolve, 100));
            return drawMessage(sender, text, chat_messages_container); // Retry adding the message after a delay.
        }

        const allMessages = chat_messages_container.querySelectorAll('.message-container');
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        chat_messages_container.appendChild(messageContainer);

        isWriting = true; // Set the flag to indicate that a message is being written.

        // Add the message block with a delay
        setTimeout(async () => {
            // Add the 'active' class to make the message block appear
            messageContainer.classList.add('active');

            const messageElement = document.createElement('div');
            messageElement.className = `message-${sender}`;
            messageContainer.appendChild(messageElement);

            // Function to add characters one by one
            async function appendCharacter() {
                for (let i = 0; i < text.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 50)); // Adjust the delay (in milliseconds) between characters appearing
                    messageElement.textContent += text.charAt(i);
                }
                isWriting = false; // Reset the flag when the message is fully written.
            }

            // Call the function to add characters
            await appendCharacter();
        }, 300);
    }
}


export function scrollToBottom(message_container) {
    //message_container.scrollTop = message_container.scrollHeight;
    //message_container.scroll({top: 0, behavior: "smooth"});
}
