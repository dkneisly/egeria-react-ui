/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

const axios = require('axios');

const fetchKnownServers = async (tenantId, userId) => {
  console.log("called fetchKnownServers()");
  const servers = [];
  const fetchKnownServersURL = `/open-metadata/platform-services/users/${userId}/server-platform/servers`;
  try {
    const fetchKnownServersResponse = await axios.get(fetchKnownServersURL, {
      params: {
        tenantId,
      },
      timeout: 30000,
    });
    if (fetchKnownServersResponse.data.relatedHTTPCode === 200) {
      if (fetchKnownServersResponse.data.serverList.length) {
        for (const serverName of fetchKnownServersResponse.data.serverList) {
          const fetchServerStatusURL = `/open-metadata/platform-services/users/${userId}/server-platform/servers/${serverName}/status`;
          const fetchServerStatusResponse = await axios.get(fetchServerStatusURL, {
            params: {
              tenantId,
            },
            timeout: 30000,
          });
          if (fetchServerStatusResponse.data.relatedHTTPCode === 200) {
            servers.push({
              id: fetchServerStatusResponse.data.serverName,
              serverName: fetchServerStatusResponse.data.serverName,
              status: fetchServerStatusResponse.data.active ? "Active" : "Known",
              serverStartTime: fetchServerStatusResponse.data.serverStartTime,
            });
          }
        }
        return servers;
      } else {
        return [];
      }
    } else {
      throw new Error(fetchKnownServersResponse.data.exceptionErrorMessage);
    }
  } catch(error) {
    if (error.code && error.code === 'ECONNABORTED') {
      console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
    } else {
      console.error("Error fetching known servers.", { error });
    }
    throw error;
  }
}

export default fetchKnownServers;