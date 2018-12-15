FROM node:10.9.0-alpine as client
WORKDIR /client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client .
RUN npm run build

FROM node:10.9.0-alpine as server
WORKDIR /server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY --from=client client/dist ./client
COPY server .

FROM alpine as auth_proxy
RUN apk add --no-cache --virtual=build-dependencies ca-certificates
ENV OAUTH2_PROXY_VERSION 2.2
WORKDIR /
COPY scripts/run.sh /run.sh
COPY scripts/emails /oauth2/emails
COPY scripts/oauth2_proxy.cfg /oauth2/oauth2_proxy.cfg
RUN wget https://github.com/bitly/oauth2_proxy/releases/download/v2.2/oauth2_proxy-2.2.0.linux-amd64.go1.8.1.tar.gz -O /tmp/oauth2_proxy.tar.gz \
        && tar -xf /tmp/oauth2_proxy.tar.gz -C /oauth2 --strip-components=1 \
        && rm /tmp/*.tar.gz

EXPOSE 4180 
ENTRYPOINT [ "sh", "/run.sh" ]