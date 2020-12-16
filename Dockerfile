FROM node
# Just assuming this uses the normal react port
EXPOSE 3000 
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV NODE_ENV=production
WORKDIR /app
COPY cra-client ./
COPY cra-server ./
COPY ssl ./
WORKDIR /app/cra-client 
RUN npm install
RUN npm run build
WORKDIR /app/cra-server 
RUN npm install
RUN npm run build
ENTRYPOINT node index.js