# Dockerfile for the landing service
FROM python:3.10

WORKDIR /app/landing

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Specify the command to run the landing service
CMD [ "gunicorn", "--worker-tmp-dir", "/dev/shm", "app:app" ]
