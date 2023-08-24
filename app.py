from enum import Enum
from time import sleep

import requests
from flask import Flask, render_template, request, jsonify, session
from datetime import datetime
from loguru import logger

app = Flask(__name__)


class BotType(Enum):
    HELPDESK_BOT = 1
    ASKER_BOT = 2


BASE_URL = "http://127.0.0.1:8000"
LOCAL_URL = "http://127.0.0.1:5000"
ASKER_URL = "http://127.0.0.1:8001"
ADD_MESSAGE_URL = f"{BASE_URL}/add_message"
ANSWER_MESSAGE_URL = f"{BASE_URL}/answer_message"
CLEAR_MEMORY_URL = f"{BASE_URL}/clear_memory/" + "{user_id}"
ASKER_QUESTION_URL = f"{ASKER_URL}/get_question"

LIMIT_EXCEEDED_CODE = 429


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/welcome", methods=["POST"])
def welcome():
    data = request.get_json()
    print(data, "successfully")
    payload = {
        "text": "",
        "sliders": {

        },
        "required_question_index": 1
    }
    question = requests.post(ASKER_QUESTION_URL, json=payload).json()
    print(question, "successfully")
    return jsonify({"response": 0})


@app.route("/send-message", methods=["POST"])
def send_message_to_api():
    chat_data = request.get_json()
    user_input = chat_data["chat"]["message"]
    sliders = get_sliders(slider_data=chat_data["sliders"], bot_type=BotType.HELPDESK_BOT)

    user_id = 228228
    if user_input == "/clear":
        response = clear_memory(user_id=user_id)
    else:
        send_message_to_processing(text=user_input, user_id=user_id)
        sleep(0.1)
        response = receive_answer(user_id, sliders)
    answer_text = response.get("text")
    return jsonify({'response': answer_text, "sliders": sliders, "status_code": 200})


def get_sliders(slider_data: dict, bot_type: BotType) -> dict[str, int]:
    """
    :param slider_data: request.get_json()["sliders"] dictionary
    :param bot_type: BotType.HELPDESK_BOT or BotType.ASKER_BOT
    :return:
    """

    if bot_type == BotType.ASKER_BOT:
        # cur_slider_data = slider_data["asker"]
        cur_slider_data = slider_data
        levels = ["anger_level", "misspelling_level", "anxiety_level", "extensiveness_level"]
    elif bot_type == BotType.HELPDESK_BOT:
        # cur_slider_data = slider_data["helpdesk"]
        cur_slider_data = slider_data
        levels = ["anger_level", "misspelling_level", "anxiety_level", "extensiveness_level"]
    else:
        raise ValueError(f"No such bot type: {bot_type}")

    get_value = lambda data, i: int(data[i]["sliderValue"])
    return {lvl: get_value(cur_slider_data, i) for (i, lvl) in enumerate(levels)}


def send_message_to_processing(text: str, user_id: int) -> None:
    payload = {
        "text": text,
        "date": datetime.now().isoformat(),
        "from_user": {
            "id": user_id,
            "username": "anonymous"
        }
    }
    response = requests.post(ADD_MESSAGE_URL, json=payload)

    if response.status_code == 200:
        logger.debug(F"Message <{text}> added successfully")
    else:
        logger.debug(f"Failed to add message <{text}>")


def receive_answer(user_id: int, sliders: [str, int]) -> dict:
    while True:
        response = requests.post(ANSWER_MESSAGE_URL, json={"user_id": user_id, "sliders": sliders})
        wait_btw_retries_seconds = 1
        sleep(wait_btw_retries_seconds)
        logger.warning(f"Anti-Spam limit exceeded. Retrying in {wait_btw_retries_seconds} seconds...")
        if response.status_code != LIMIT_EXCEEDED_CODE:
            break

    if response.status_code == 200:
        answer = response.json().get("text")
        logger.debug("Answer:", answer)
        return response.json()
    else:
        logger.debug("Failed to get answer")
        return {"status_code": response.status_code, "detail": response.json().get("detail")}


def clear_memory(user_id):
    url = CLEAR_MEMORY_URL.format(user_id=user_id)
    response = requests.post(url)
    return response.json()


if __name__ == "__main__":
    app.run(debug=True)
