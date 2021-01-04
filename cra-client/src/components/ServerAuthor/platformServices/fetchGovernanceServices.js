/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

const axios = require('axios');

const fetchGovernanceServices = async (tenantId, userId) => {
  const fetchGovernanceServicesURL = `/open-metadata/platform-services/users/${userId}/server-platform/registered-services/governance-services`;
  try {
    const fetchGovernanceServicesResponse = await axios.get(fetchGovernanceServicesURL, {
      params: {
        tenantId,
      },
      timeout: 30000,
    });
    console.debug({fetchGovernanceServicesResponse});
    if (fetchGovernanceServicesResponse.data.relatedHTTPCode === 200) {
      return fetchGovernanceServicesResponse.data.services;
    } else {
      throw new Error("Error in fetchGovernanceServicesResponse");
    }
  } catch(error) {
    if (error.code && error.code === 'ECONNABORTED') {
      console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
    } else {
      console.error("Error fetching governance services from platform", { error });
    }
    throw error;
  }
}

export default fetchGovernanceServices;