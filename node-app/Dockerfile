# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
#WORKDIR /usr/src/app
WORKDIR /Users/mark/Documents/patient-incident-report-form/node-app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run your app
#CMD ["npm", "start"]
# Run app.js when the container launches
CMD ["node", "index.js"]