import React from 'react'
import ReactDOM from 'react-dom/client'

import { loadOsData } from "./helpers/osData";
import { App } from "./app";

import "./main.css";

(async () => {
  const osData = await loadOsData();
  
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})();