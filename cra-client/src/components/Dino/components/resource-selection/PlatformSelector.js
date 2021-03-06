/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */


import React, { useContext, useState, useEffect }         from "react";

import { ResourcesContext }                               from "../../contexts/ResourcesContext";

import { RequestContext }                                 from "../../contexts/RequestContext";

import { InteractionContext }                             from "../../contexts/InteractionContext";

import "./resource-selector.scss"


/*
 * The PlatformSelector displays the names of the permitted platforms that retrieved from
 * the view service at strartup.  
 * The platform selector control will present platforms by name to the user and allow the user to select
 * one. During platform load, the platformName is passed to the view service, which resolves it to the 
 * configured platformRootURL for that platform. 
 * The platform's details are retrieved and the platform will become the new focus object.
 */
export default function PlatformSelector() {
  
  const resourcesContext                      = useContext(ResourcesContext);

  const requestContext                        = useContext(RequestContext);

  const interactionContext                    = useContext(InteractionContext);


  const [platformsLoaded, setPlatformsLoaded] = useState(false);

  /*
   * availablePlatforms is a list of names of the platforms to which requests can be sent.
   * This list comes from the view-service on initialisation.
   * If the configuration of the V-S is changed, refresh the page - or we could provide a
   * list refresh capability behind a button. 
   */
  const [availablePlatforms, setAvailablePlatforms]       = useState({});

  /*
   * Populate the available platform list by retrieving the permitted platform names 
   * from the view-service
   */
  const getPlatforms = () => {
    requestContext.callGET("resource-endpoints", _getPlatforms);
    setPlatformsLoaded(true);
  }

  const _getPlatforms = (json) => {
    if (json !== null) {
      if (json.relatedHTTPCode === 200 ) {
        let platformList = json.platformList;
        if (platformList) {
          let newPlatforms = {};
          platformList.forEach(plt => {
            const newPlatform = { "platformName"    : plt.platformName, 
                                  "description"     : plt.resourceDescription, 
                                  "platformRootURL" : plt.resourceRootURL  };
            newPlatforms[plt.platformName] = newPlatform;
          });
          setAvailablePlatforms(newPlatforms);
          return;
        }
      }
      else {
        /*
         * This is not the best way to determine the type of error, but it will
         * suffice for now. The better solution requires an overhaul of index.js
         * to improve its error reporting.
         */
        let message = json.exceptionErrorMessage;

        if (message.includes("invalid supplied URL")) {
          let tokens = message.split("/");
          let tenantName = tokens[2];
          json.exceptionErrorMessage = "Check the Presentation Server for tenant "+tenantName+" is configured. [Detail "+ json.exceptionErrorMessage + "]";
        }
        else if (message.includes("ECONNREFUSED")) {
          let url = json.requestURL;
          let tokens = url.split("/");
          let tenantName = tokens[4];
          let detailedErrorMessage = json.exceptionErrorMessage;
          json.exceptionErrorMessage = "Could not connect to the view service";
          json.exceptionSystemAction = "The system could not connect to the view service [Detail "+ detailedErrorMessage + "]";
          json.exceptionUserAction = "Check the configuration of the Presentation Server for tenant "+tenantName+", and that the corresponding View Server is running";
        }
        else if (message.includes("OMAG-MULTI-TENANT-404-001")) {
          let skipLength = "OMAG-MULTI-TENANT-404-001".length+1;
          let shortMessage = message.substring(skipLength);
          json.exceptionErrorMessage = shortMessage;
          json.exceptionSystemAction = "The system could not retrieve the platforms because the view service is not running";
          json.exceptionUserAction = "Check the configuration of the Presentation Server and that the corresponding View Server is running, then retry the request.";
        }
        interactionContext.reportFailedOperation("get platforms from view service", json);
      }
    }
    else {
      /*
       * If there is no JSON in the response this constitutes a coding error, so raise
       * an alert to make it conspicuous...
       */
      alert("PlatformSelector received a response with no JSON. Please raise an issue on the Egeria github page.");
    }
  }


  if (!platformsLoaded) {
    getPlatforms();
  }

  /*
   * Handler for change to platform selector.
   *
   *
   * Get the platform.
   * view service url = dino/user/{userId}/platform/{platformName}
   * Behind the scenes the VS will take the configured platform resource and embellish it with live data
   * to fill in some details - e.g. it will get the origin, registered services, etc.
   * The details will be filled in by calling various backend (platform) URLs, such as:
   * platform url     = {platformRootURL}/open-metadata/platform-services/users/{userId}/server-platform/origin'
   */
  const platformSelected = (evt) => {
    let platformName = evt.target.value;
    resourcesContext.loadPlatform(platformName);
  }

  /*
   * Enable user to click on the same server again...
   */
  const selectorFocus = (evt) => {
    let selector = evt.target;
    selector.selectedIndex = -1;
    selector.blur();
  }



  /*
   * It's important to reset (clear) the selector if the focus changes to anything other than the selected
   * option - including (and especially) if an option from a different selector is chosen. This is to ensure
   * that if/when the user navigates back to this selector, if they click on the same (previously selected) 
   * option then we will see it as a change. Otherwise the user action will be ignored and the focus will 
   * not change.
   */

  useEffect(
    () => {
      let selectorValue;
      const focus = resourcesContext.focus;
      /*
       * If the focus is a platform then we need to ensure we track the current focus
       */
      if (focus.category === "platform") {
        selectorValue = (focus.name === "") ? "none" : focus.name;
        const selector = document.getElementById("platformSelector");
        if (selector)
          selector.value = selectorValue;
      }
      else {
        /*
         * If the focus is not a platform we need to clear the platform selector
         */
        selectorValue = "none";
        const selector = document.getElementById("platformSelector");
        if (selector)
          selector.value = selectorValue;
      }
    },
    [resourcesContext.focus]
  )
  
 
  const platformNameList = Object.keys(availablePlatforms);
  const platformNameListSorted = platformNameList.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
 
  
  return (
    <div className="resource-controls">

      <p  className="descriptive-text">Platforms</p>

      <select className="platform-selector"
              id="platformSelector"
              name="platformSelector"  
              onChange = { platformSelected }
              onFocus= { selectorFocus }  // Enable re-click of same entry in selector
              size = "5" >
      {
        platformNameListSorted.length === 0 && 
        ( <option value="dummy" disabled defaultValue>No platforms...</option> )
      }
      {
        platformNameListSorted.length > 0 && 
        (
          platformNameListSorted.map(platformName => 
            ( <option key={platformName} value={platformName}> {platformName} </option> )
          )      
        )                                         
      }      
     </select>

    </div>

  );
}
