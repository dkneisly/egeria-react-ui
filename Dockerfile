# stage 1
FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:latest as client-build
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_OPTIONS=--max-old-space-size=8192

WORKDIR /app
COPY cra-client ./cra-client

WORKDIR /app/cra-client
RUN npm install
RUN npm run build

# stage 2
FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:latest
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV NODE_ENV=production
ENV EGERIA_PRESENTATIONSERVER_SERVER_datelake={"remoteServerName":"usafView1","remoteURL":"https://dev-kaiju-egeria-datalake:9443"}

WORKDIR /app
COPY --from=build /app/cra-client/build /cra-client/build
# COPY cra-client/build ./cra-client/build
COPY cra-client/public ./cra-client/public
COPY cra-server ./cra-server
COPY ssl ./ssl

WORKDIR /app/cra-server
RUN npm install

EXPOSE 8091
ENTRYPOINT node index.js