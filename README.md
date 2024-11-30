** Instructions on running the Application**

## Prerequisites

- Install [Docker](https://www.docker.com/) and ensure it is running.
- Install [Node.js](https://nodejs.org/) (version 18 or higher is recommended).

Once all prerequisites are met and project is pulled, run the following command to obtain all the necessary dependancies:

npm install

Run the following command to build the Docker images and start the containers:

docker-compose up --build

After the backend is running, use the following curl command to pull activity points from the external API and store them in the local database:

curl -X POST http://localhost:3000/activityPoints/activeCoordinates

Once the above steps are completed, the backend should be running and ready to interact with the frontend application!
