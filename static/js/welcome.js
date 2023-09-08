import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { drawMessage, sendMessageAndGetResponseWelcome } from "./chat_functionality.js";
import { dialogues } from "./dialogues.js";
import { scrollToBottom } from "./chat_functionality.js";

const welcome_sliders = document.querySelectorAll("input[type='range']");
const chat_container = document.getElementById("chat-popup");
const giga_chat = document.getElementById("giga-chat");
const giga_chat_overlay = document.getElementById("giga-chat-overlay");
const welcomeMessageContainer = document.getElementById("chat-messages");
const giga_chat_message_container = document.getElementById("giga-chat-messages");
const right_container = document.getElementById("right-subcontainer");
const senders = ["user", "llm"]
const giga_senders = ["giga-user", "giga-llm"]
window.cancelWelcome = false;
const skip_intro = false;

export async function sleep(ms) {
    return new Promise(async resolve => await setTimeout(resolve, ms));
}

async function welcome_chat(){
  while (!window.cancelWelcome) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (window.cancelWelcome) {
          return
        }
        var sliders = nodeSlidersToJSONSliders(welcome_sliders);
        var data  = {
          sliders: sliders,
          required_dialog_index: i,
          required_question_index: j
        }
        await fetch("/welcome", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data
          })
        })
        .then(async response => await response.json())
        .then(async data => {
          console.log(data);
          await sendMessageAndGetResponseWelcome(data.response, giga_chat_message_container, welcome_sliders, "/send-message", giga_senders);
      })
      }
    }
  }
}



window.addEventListener("DOMContentLoaded", async () => {
  if (!skip_intro) {
    const gif = document.createElement("img");
    const dialog_number = Math.floor(Math.random() * (dialogues.length - 0 + 1)) + 0;
    chat_container.style.bottom = "0px";
    var sender_id = 1;
    for (let i = 0; i < dialogues[dialog_number].length; i++) {
      await drawMessage(senders[sender_id%2], dialogues[dialog_number][i], welcomeMessageContainer);
      sender_id += 1;
    }
    await fetch("/static/images/hammer.gif")
    .then(async response => await response.blob())
    .then(blob => {
      const gif_container = document.createElement("div");
      gif_container.className = "gif-container";
      gif.src = URL.createObjectURL(blob);
      gif_container.appendChild(gif);
      document.body.appendChild(gif_container);
    });
  
  await sleep(1300)
  chat_container.style.bottom = "-600px";
  await sleep(450)
  gif.style.display = "none"
  await sleep(1500)
  }

  giga_chat.classList.toggle("active")
  giga_chat_overlay.classList.toggle("active")
  right_container.classList.toggle("active")
  
  await drawMessage("giga-llm", "Простите моего коллегу, он устарел.", giga_chat_message_container);
  
  await sleep(1500)
  await drawMessage("giga-llm", "Чем могу быть полезен?", giga_chat_message_container);
  await welcome_chat();
});
