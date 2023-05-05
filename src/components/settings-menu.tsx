import { FC, useState, useEffect } from "react";

import { LoadingIndicator } from "./loading-indicator";

import "./settings-menu.css";

export const SettingsMenu:FC<{ handleClose: () => void }> = ({ handleClose }) => {
  return (
    <div className="settings-menu">
      <div className="settings-menu-backdrop" onClick={handleClose} />

      <div className="settings-menu-modal">
        <h1>
          Settings
        </h1>

        <div className="list">    
          <div className="row">
            <div className="cell label">
                Persona
            </div>

            <div className="cell value"> 
                <textarea
                  cols={3}
                />
              </div>
          </div>

          <div className="row">
            <div className="cell label">
              Model
            </div>

            <div className="cell value"> 
              <select 
                name="model" 
              >
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="cell label">
              API Key
            </div>

            <div className="cell value"> 
              <input
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="spacer" />

        <div className="button-container">
          
          <button onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}