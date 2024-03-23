# patient-incident-report-form
A form for reporting patient incidents

The form is an HTML document designed for reporting incidents involving patients. It collects various details related to the incident, including patient information (name, medical record number, date of birth), details of the incident (date, time, description), pre- and post-occurrence conditions, nature of the injury, follow-up actions, and signatures. The form utilizes Bootstrap for styling and includes JavaScript for dynamic behavior, such as showing/hiding input fields based on user selections. It features input fields, dropdown menus, and text areas to capture comprehensive information about the incident.

#### Notes to build/push/deploy app to Googe Cloud
cd node-app  
nvm use v20.5.0  
open Docker Engine app  
./docker-build-push-deploy.sh

## Explanation of commands in docker-build-push-deploy.sh
1. docker build -t gcr.io/qapi-elamj/node-app:v1 .  
Purpose:  
This command builds a Docker image from the Dockerfile located in the current directory (.), and tags it with the name gcr.io/qapi-elamj/node-app:v1.  
Explanation:  
docker build: This command is used to build a Docker image from a Dockerfile.  
-t gcr.io/qapi-elamj/node-app:v1: The -t flag is used to tag the Docker image with a name and optionally a tag. In this case, gcr.io/qapi-elamj/node-app:v1 is the name and tag for the Docker image.  
.: The dot (.) at the end of the command specifies the build context. It tells Docker to look for the Dockerfile in the current directory.  
  
2. docker push gcr.io/qapi-elamj/node-app:v1  
Purpose:  
This command pushes a Docker image with the tag gcr.io/qapi-elamj/node-app:v1 to a container registry (in this case, gcr.io).  
Explanation:  
docker push: This command is used to push a Docker image to a registry.  
gcr.io/qapi-elamj/node-app:v1: This is the name and tag of the Docker image that will be pushed to the registry. It specifies the image's location in the registry.  
  
3. gcloud run deploy node-app --image gcr.io/qapi-elamj/node-app:v1 --platform managed --port 8080  
Purpose:  
This command deploys a containerized application to Google Cloud Run, specifying the Docker image to deploy, the platform as managed, and the port to expose.  
Explanation:  
gcloud run deploy: This command is used to deploy an application to Google Cloud Run.  
node-app: This is the name of the service or application being deployed.  
--image gcr.io/qapi-elamj/node-app:v1: This flag specifies the Docker image to deploy.  
--platform managed: This flag specifies the platform to deploy the application on. In this case, it's Google Cloud Run in managed mode.  
--port 8080: This flag specifies the port on which the application will listen for incoming traffic.  