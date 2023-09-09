import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { drawMessage, sendMessageAndGetResponseWelcome } from "./chat_functionality.js";
import { dialogues } from "./dialogues.js";
import Utils from "./utils.js";

const welcome_sliders = document.querySelectorAll("input[type='range']");
Utils.setSliderValue(welcome_sliders[4], 2);
Utils.setSliderValue(welcome_sliders[5], 1);
Utils.setSliderValue(welcome_sliders[3], 1);
Utils.setSliderValue(welcome_sliders[7], 1);
const chat_container = document.getElementById("chat-popup");
const giga_chat = document.getElementById("giga-chat");
const giga_chat_overlay = document.getElementById("giga-chat-overlay");
const welcomeMessageContainer = document.getElementById("chat-messages");
const giga_chat_message_container = document.getElementById("giga-chat-messages");
const right_container = document.getElementById("right-subcontainer");
const senders = ["user", "llm"]
const giga_senders = ["giga-asker", "giga-llm"]
window.cancelWelcome = false;
const skip_intro = false;

export async function sleep(ms) {
    return new Promise(async resolve => await setTimeout(resolve, ms));
}

async function welcome_chat(){
  var cnt = 0;
  const scren_h = document.getElementById("phone-screen-container")
  if (window.cancelWelcome) {
    return
  }
    // my attempt to decrease i to curr. number of dialogs
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        cnt += 1;
        if (cnt === 30) {
          window.cancelWelcome = true;
        }
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


async function oldChat(dialogues, chat_window, chat_msg_container) {
  const dialogue_number = Utils.getRandomInt(0, dialogues.length-1);
  chat_window.style.bottom = `0px`;
  var sender_id = 1;
  if (window.matchMedia("(min-width: 1024px)").matches) {
    for (let i = 0; i < dialogues[dialogue_number].length; i++) {
      await drawMessage(senders[sender_id%2], dialogues[dialogue_number][i], chat_msg_container);
      sender_id += 1;
    }
    await sleep(5500);
  } else {
    for (let i = 0; i < dialogues[dialogue_number].length; i++) {
      drawMessage(senders[sender_id%2], dialogues[dialogue_number][i], chat_msg_container);
      sender_id += 1;
      await sleep(1500);
    }
    return
  }
}


window.addEventListener("DOMContentLoaded", async () => {
  if (!skip_intro) {
    const gif = document.createElement("img");
    await oldChat(dialogues, chat_container, welcomeMessageContainer);
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
  chat_container.style.bottom = "-750px";
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
