from time import sleepimport requestsfrom flask import Flask, render_template, request, jsonify, sessionfrom datetime import datetimefrom loguru import loggerapp = Flask(__name__)BASE_URL = "http://127.0.0.1:8000"LOCAL_URL = "http://127.0.0.1:5000"ADD_MESSAGE_URL = f"{BASE_URL}/add_message"ANSWER_MESSAGE_URL = f"{BASE_URL}/answer_message"CLEAR_MEMORY_URL = f"{BASE_URL}/clear_memory/" + "{user_id}"LIMIT_EXCEEDED_CODE = 429@app.route("/")def index():    return render_template("index.html")@app.route("/send-message", methods=["POST"])def send_message_to_api():    chat_data = request.get_json()    user_input = chat_data["chat"]["message"]    slider_data = chat_data["sliders"]    user_id = 228228    if user_input == "/clear":        response = clear_memory(user_id=user_id)    else:        send_message_to_processing(text=user_input, user_id=user_id)        sleep(0.1)        response = receive_answer(user_id, int(slider_data[1]["sliderValue"]), int(slider_data[0]["sliderValue"]))    answer_text = response.get("text")    return jsonify({'response': answer_text, "sliders": slider_data, "status_code": 200})@app.route("/manual-slider-update", methods=["POST"])def manual_slider_update():    data = request.get_json()    value = data.get("sliderValue")    id = data.get("sliderID")    return {"slider_id": id, "slider_value": value, "status_code": 200}@app.route("/process-sliders", methods=["POST"])def process_sliders():    sliders = request.args    print(sliders, "successfully")    response_data = {"message": "OK"}    return jsonify({"sliders_data": sliders, "status_code": 200, "response": response_data})def send_message_to_processing(text: str, user_id: int) -> None:    payload = {        "text": text,        "date": datetime.now().isoformat(),        "from_user": {            "id": user_id,            "username": "anonymous"        }    }    response = requests.post(ADD_MESSAGE_URL, json=payload)    if response.status_code == 200:        logger.debug(F"Message <{text}> added successfully")    else:        logger.debug(f"Failed to add message <{text}>")def receive_answer(user_id: int, anger_level: int, misspelling_level: int) -> dict:    while True:        sliders = {"anger_level": anger_level, "misspelling_level": misspelling_level}        response = requests.post(ANSWER_MESSAGE_URL, json={"user_id": user_id, "sliders": sliders})        wait_btw_retries_seconds = 1        sleep(wait_btw_retries_seconds)        logger.warning(f"Anti-Spam limit exceeded. Retrying in {wait_btw_retries_seconds} seconds...")        if response.status_code != LIMIT_EXCEEDED_CODE:            break    if response.status_code == 200:        answer = response.json().get("text")        logger.debug("Answer:", answer)        return response.json()    else:        logger.debug("Failed to get answer")        return {"status_code": response.status_code, "detail": response.json().get("detail")}def clear_memory(user_id):    url = CLEAR_MEMORY_URL.format(user_id=user_id)    response = requests.post(url)    return response.json()if __name__ == "__main__":    app.run(debug=True)