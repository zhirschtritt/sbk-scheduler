FROM node:10.9.0-alpine

ENV NODE_ENV production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY index.js .

ENTRYPOINT [ "npm", "start" ]