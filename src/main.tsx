import React from 'react'
import ReactDOM from 'react-dom/client'

import { loadOsData } from "./helpers/osData";
import { setFsInterfacePlatform } from './helpers/fs-interface';

import "./main.css";

(async () => {
  /**
   * set up data needed by app. This has to happen before we import App since
   * that will build the component structure, which requires these things to be
   * done first
   */
  const osData = await loadOsData();
  await setFsInterfacePlatform(osData?.platform ?? "error");

  const { App } = await import("./app");
  
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})();