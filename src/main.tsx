import React from 'react'
import ReactDOM from 'react-dom/client'

import { initializeEnvironmentVariables } from "./helpers/environment-variables";
import { setFsInterfacePlatform } from './helpers/fs-interface';
import { BeforeInstallPromptButton } from "./components/before-install-prompt-button";

import "./main.css";

if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("service-worker.js");
}

(async () => {
  /**
   * set up data needed by app. This has to happen before we import App since
   * that will build the component structure, which requires these things to be
   * done first
   */
  const env = await initializeEnvironmentVariables();
  await setFsInterfacePlatform(env?.platform ?? "error");

  const { App } = await import("./app");
  
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <BeforeInstallPromptButton />      
      <App />
    </React.StrictMode>,
  )
})();