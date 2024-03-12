docker build -t gcr.io/qapi-elamj/node-app:v1 .
docker push gcr.io/qapi-elamj/node-app:v1
gcloud run deploy node-app --image gcr.io/qapi-elamj/node-app:v1 --platform managed --port 8080