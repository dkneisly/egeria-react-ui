/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

const axios = require('axios');

const fetchViewServices = async (tenantId, userId) => {
  const fetchViewServicesURL = `/open-metadata/platform-services/users/${userId}/server-platform/registered-services/view-services`;
  try {
    const fetchViewServicesResponse = await axios.get(fetchViewServicesURL, {
      params: {
        tenantId,
      },
      timeout: 30000,
    });
    console.debug({fetchViewServicesResponse});
    if (fetchViewServicesResponse.data.relatedHTTPCode === 200) {
      return fetchViewServicesResponse.data.services;
    } else {
      throw new Error("Error in fetchViewServicesResponse");
    }
  } catch(error) {
    if (error.code && error.code === 'ECONNABORTED') {
      console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
    } else {
      console.error("Error fetching view services from platform", { error });
    }
    throw error;
  }
}

export default fetchViewServices;