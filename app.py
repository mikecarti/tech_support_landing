from time import sleep

import requests
from flask import Flask, render_template, request, jsonify, session
from datetime import datetime
from loguru import logger

app = Flask(__name__)

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
    question = requests.post(ASKER_QUESTION_URL, payload=payload).json()
    print(question, "successfully")
    return jsonify({"response": 0})

@app.route("/send-message", methods=["POST"])
def send_message_to_api():
    chat_data = request.get_json()
    user_input = chat_data["chat"]["message"]
    slider_data = chat_data["sliders"]
    sliders = {
        "anger_level": int(slider_data[0]["sliderValue"]),
        "misspelling_level": int(slider_data[1]["sliderValue"]),
        "anxiety_level": int(slider_data[2]["sliderValue"]),
        "extensiveness_level": int(slider_data[3]["sliderValue"])
    }
    user_id = 228228
    if user_input == "/clear":
        response = clear_memory(user_id=user_id)
    else:
        send_message_to_processing(text=user_input, user_id=user_id)
        sleep(0.1)
        response = receive_answer(user_id, sliders)
    answer_text = response.get("text")
    return jsonify({'response': answer_text, "sliders": slider_data, "status_code": 200})

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
