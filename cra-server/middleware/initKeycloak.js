const session = require('express-session');
const Keycloak = require('keycloak-connect');


const config = {
  clientId: process.env.NODE_ENV === 'production' ? 'egeria_production' : 'egeria_local',
  bearerOnly: true,
  serverUrl: 'https://keycloak.oregon.aiplatformpoc.com/auth/',
  realm: "React_UI",
  realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiyiPWpDliOibrwb/8LFiqxQp4TUftRlUMUTB4Sguoob+SHhTTL0irfYk4uby5nMPw3PRxEJ5Poe7gOf9498JUuvmMjWq4ZjBS4ruza6rtobRIjds+5J5twVFuqxV+Kd68XBOyRS9jY0uval2ygKv/dVU455PmtkUTlbI+14PNz+Ys7KL3JDMNhnycWjYMEIfCUrG8mSwwy6ZkaTCtA3tREUy5LmMwMZOcWbsFLFagH34SbNm6h/pgLvjfuPE4RROftBx8WNw9yiuXlkevoHPMnRLn3cZTdfNAVUxK/h5JiCFYD2twCzm12HfVdOcbO014LiBE3skR0cWAsL1Ax247QIDAQAB'
}

const initKeycloak = () => {

  const memoryStore = new session.MemoryStore();
  
  const keycloak = new Keycloak({
    store: memoryStore
  }, config);

  return keycloak;

}

module.exports = initKeycloak;