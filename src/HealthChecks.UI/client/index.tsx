import "../assets/material.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from './App';
import { HashRouter } from "react-router-dom";
import uiSettings from "./config/UISettings";
let endpoint = `${window.location.origin}${window.uiEndpoint}`;
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { useQuery } from "react-query";
import fetchers from './api/fetchers';
import { FunctionComponent } from 'react';

const Application: FunctionComponent = () => {
  const { data: apiSettings } = useQuery("uiApiSettings", fetchers.getUIApiSettings, { retry: 1 });
  const oidcConfig: AuthProviderProps = {
    authority: apiSettings?.authority ?? '',
    client_id: apiSettings?.clientId ?? '',
    redirect_uri: apiSettings?.redirectUri ?? '',
    scope: apiSettings?.scope ?? '',
    loadUserInfo: true
  };

  if (apiSettings) {
    return <AuthProvider {...oidcConfig} >
      <HashRouter>
        <App uiSettings={uiSettings} />
      </HashRouter>
    </AuthProvider>;
  }
  return null;
}

export default Application;

ReactDOM.render(
  <Application></Application>,
  document.getElementById("app")
);
