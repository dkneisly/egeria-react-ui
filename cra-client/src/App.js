/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */
import React, { useState } from "react";
import "./app.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./auth/login";
import Frame from "./Frame";
import IdentificationContext from "./contexts/IdentificationContext";
import axios from 'axios';

import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'


export default function App() {

  // Keycloak auth loading
  const [authLoaded, setAuthLoaded] = useState(false);  

  return (
    <div>
      <ReactKeycloakProvider 
        authClient={keycloak}
        initOptions={{ onLoad: "login-required" }}
        onTokens={(tokens) => {
          // send bearer token with requests
          axios.interceptors.request.use(
            config => {
              config.headers['Authorization'] = 'Bearer ' + tokens.token;
              return config;
            },
            error => {
              return Promise.reject(error);
            }
          );
          setAuthLoaded(true);
        }}
      >
        <IdentificationContext>
          <Router>
            <Switch>
              <Route path="/*/login" exact>
                <Login currentURL={window.location.href} />
              </Route>
              <Route path="/*/">
                <Frame />
              </Route>
            </Switch>
          </Router>
        </IdentificationContext>
      </ReactKeycloakProvider>
    </div>
  );
}
