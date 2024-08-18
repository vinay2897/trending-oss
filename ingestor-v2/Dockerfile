FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./
COPY ./repoCountByYear ./repoCountByYear

COPY tsconfig.json ./

RUN npm run build
