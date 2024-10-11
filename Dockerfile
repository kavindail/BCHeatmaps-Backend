FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y build-essential python3

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

