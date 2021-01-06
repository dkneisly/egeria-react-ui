# stage 1
FROM node:erbium-alpine as build-client
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_OPTIONS=--max-old-space-size=8192

WORKDIR /app
COPY cra-client ./cra-client

WORKDIR /app/cra-client
RUN npm install
RUN npm run build
WORKDIR /app/cra-client/build

# stage 2
FROM node:erbium-alpine
ENV NODE_OPTIONS=--max-old-space-size=8192

WORKDIR /app
COPY --from=build-client /app/cra-client/build ./cra-client/build
COPY cra-client/public ./cra-client/public
COPY cra-server ./cra-server
COPY ssl ./ssl

WORKDIR /app/cra-server
RUN npm install

EXPOSE 8091
ENTRYPOINT node index.js
