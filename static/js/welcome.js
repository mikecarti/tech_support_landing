import { drawMessage, scrollToBottom, } from "./chat_functionality.js";
import { nodeSlidersToJSONSliders } from "./chat_sliders.js";
import { sendMessageAndGetResponse } from "./chat_functionality.js";

const debugButton = document.getElementById("debug-button");
const timeout = document.getElementById("timeout");
const welcome_sliders = document.querySelectorAll("input[type='range']");
const chat_container = document.getElementById("chat-popup");

const fake_user_messages = [
    "Какой сегодня день?",
    "Как погода на улице?",
    "Что можно поесть на обед?",
    "Какие новости?",
    "Какой смысл жизни?",
    "Чем заняться вечером?",
    "Какие планы на выходные?",
    "Как доехать до центра города?",
    "Какие фильмы сейчас идут в кино?",
    "Как научиться программировать?"
  ];
const bot_messages = [
    "Ты чего, орешь как белка? Сегодня - среда, помнишь?!",
    "Погода? На улице не пойдешь, понял?!",
    "Ешь, что хочешь, ты же не корова!",
    "Какие новости? Все плохо, как всегда!",
    "Смысл жизни? Ответь мне на этот вопрос, гений!",
    "Заняться вечером? Да какая тебе разница, сиди дома!",
    "Планы на выходные? Пофиг, будешь спать, как китайский дракон!",
    "Доехать до центра города? Да тебя на тачке проведут!",
    "Кино? Зачем? Смотри, как светофор переключается!",
    "Программировать? Ты вообще в жизни что-то делаешь?"
  ];

export async function sleep(ms) {
    return new Promise(async resolve => await setTimeout(resolve, ms));
}

async function welcome(timeout) {
  console.log(timeout);
  for (let i = 0; i < fake_user_messages.length; i++) {
    drawMessage("user", fake_user_messages[i]);
    scrollToBottom();
    await sleep(timeout)
    drawMessage("llm", bot_messages[i]);
    scrollToBottom();
    await sleep(timeout);
  }
}


debugButton.addEventListener("click", async () => {
  await welcome(Number(timeout.value.trim()));
});

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
      // sleep(1500);
      await sendMessageAndGetResponse(data.response, welcome_sliders, "/send-message");
  })
  }
}

// chat_container.style.bottom = chat_container.style.bottom === "0px" ? "-400px" : "0px";
/*
document.addEventListener("DOMContentLoaded", function() {
  const chat_container = document.getElementById("chat-popup");
  setTimeout(() => {
    chat_container.style.bottom = "0px";
  }, 1000);
});
*/
chat_container.style.bottom = "0px"
welcome_chat();
