import Keycloak from 'keycloak-js';


const keycloak = new Keycloak({
  realm: "Egeria",
  url: 'https://keycloak.oregon.aiplatformpoc.com/auth/',
  clientId: process.env.NODE_ENV === 'production' ? 'egeria_production' : 'egeria_local'
});

export default keycloak