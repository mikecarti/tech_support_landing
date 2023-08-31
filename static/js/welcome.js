import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { sendMessageAndGetResponse } from "./chat_functionality.js";

const welcome_sliders = document.querySelectorAll("input[type='range']");
const chat_container = document.getElementById("chat-popup");
const giga_chat = document.getElementById("giga-chat");
const welcomeMessageContainer = document.getElementById("chat-messages")
const senders = ["user", "llm"]

export async function sleep(ms) {
    return new Promise(async resolve => await setTimeout(resolve, ms));
}

async function welcome_chat(){
  for (let i = 0; i < 4; i++) {
    var sliders = nodeSlidersToJSONSliders(welcome_sliders);
    var data  = {
      sliders: sliders,
      required_question_index: i
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
      await sendMessageAndGetResponse(data.response, welcomeMessageContainer, welcome_sliders, "/send-message", senders);
  })
  }
}

giga_chat.classList.toggle("active")

window.addEventListener("DOMContentLoaded", async () => {
  const gif = document.createElement("img");
  chat_container.style.bottom = "0px";
  await welcome_chat();
  
  await fetch("/static/images/hammer.gif")
  .then(async response => await response.blob())
  .then(blob => {
    gif.src = URL.createObjectURL(blob);
    document.getElementById("sliders").appendChild(gif);
  });
  
  await sleep(1300)
  chat_container.style.bottom = "-600px";
  await sleep(500)
  gif.style.display = "none"
});
