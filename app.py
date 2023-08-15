from time import sleep

import requests
from flask import Flask, render_template, request
from datetime import datetime
from loguru import logger

app = Flask(__name__)

BASE_URL = "http://0.0.0.0:8000"
ADD_MESSAGE_URL = f"{BASE_URL}/add_message"
ANSWER_MESSAGE_URL = f"{BASE_URL}/answer_message"
CLEAR_MEMORY_URL = f"{BASE_URL}/clear_memory/" + "{user_id}"

LIMIT_EXCEEDED_CODE = 429


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/", methods=["POST"])
def process_text():
    user_input = request.form["user_input"]
    user_id = 228228

    if user_input == "/clear":
        response = clear_memory(user_id=user_id)
    else:
        send_message_to_processing(text=user_input, user_id=user_id)
        sleep(0.1)
        response = receive_answer(user_id)
    answer_text = response.get("text")
    return render_template("index.html", output=answer_text)


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


def receive_answer(user_id: int) -> dict:
    while True:
        response = requests.post(ANSWER_MESSAGE_URL, json={"user_id": user_id})
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
