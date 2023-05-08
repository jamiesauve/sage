import React from 'react'
import ReactDOM from 'react-dom/client'

import { getOsData } from "./helpers/getOsData";
import { App } from "./app";

import "./main.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

(async () => {
  await getOsData();
  
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})();