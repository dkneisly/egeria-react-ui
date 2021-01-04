/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

const axios = require('axios');

const fetchAccessServices = async (tenantId, userId) => {
  const fetchAccessServicesURL = `/open-metadata/platform-services/users/${userId}/server-platform/registered-services/access-services`;
  try {
    const fetchAccessServicesResponse = await axios.get(fetchAccessServicesURL, {
      params: {
        tenantId,
      },
      timeout: 30000,
    });
    console.debug({fetchAccessServicesResponse});
    if (fetchAccessServicesResponse.data.relatedHTTPCode === 200) {
      return fetchAccessServicesResponse.data.services;
    } else {
      throw new Error("Error in fetchAccessServicesResponse");
    }
  } catch(error) {
    if (error.code && error.code === 'ECONNABORTED') {
      console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
    } else {
      console.error("Error fetching access services from platform", { error });
    }
    throw error;
  }
}

export default fetchAccessServices;