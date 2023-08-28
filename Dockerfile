# Dockerfile for the landing service
FROM python:3.10

WORKDIR /app/landing

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Specify the command to run the landing service
CMD [ "python3.10", "main.py" ]
