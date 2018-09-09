FROM node:10.9.0-alpine as client
WORKDIR client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client .
RUN npm run build

FROM node:10.9.0-alpine as server
WORKDIR server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY --from=client client/dist ./client
COPY server .

EXPOSE 3030 

ENTRYPOINT [ "npm", "start" ]