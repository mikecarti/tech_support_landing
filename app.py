from time import sleep

import requests
from flask import Flask, render_template, request
from datetime import datetime

app = Flask(__name__)

BASE_URL = "http://0.0.0.0:8000"
ADD_MESSAGE_URL = f"{BASE_URL}/add_message"
answer_message_url = f"{BASE_URL}/answer_message"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/", methods=["POST"])
def process_text():
    user_input = request.form["user_input"]
    user_id = 228228
    send_message_to_processing(text=user_input, user_id=user_id)
    sleep(1)
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
        print(F"Message <{text}> added successfully")
    else:
        print(f"Failed to add message <{text}>")


def receive_answer(user_id: int) -> dict:
    response = requests.post(answer_message_url, json={"user_id": user_id})

    if response.status_code == 200:
        answer = response.json().get("text")
        print("Answer:", answer)
        return response.json()
    else:
        print("Failed to get answer")
        return {}


if __name__ == "__main__":
    app.run(debug=True)
