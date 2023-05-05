import { FC, useState, useEffect } from "react";

import { LoadingIndicator } from "./loading-indicator";
import { getConfig, updateConfigWithSimpleValues } from "../integrations/chat-gpt-config";

import "./settings-menu.css";

export const SettingsMenu:FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [persona, setPersona] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  
  useEffect(() => {
    (async () => {
      const config = await getConfig();

      setPersona(config.persona.value);
      setModel(config.model.value);
      setApiKey(config.apiKey.value);
    })();
  }, [])
  
  const update = async () => {
    try {
      setIsFetching(true);
      
      await updateConfigWithSimpleValues(persona, model, apiKey);
      
      setIsFetching(false);
  
      handleClose();
    } catch(e) {
      console.error("failed to update config", e);
      // TODO: notify user somehow
    }
  }

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
                  disabled={isFetching}
                  onChange={(e) => setPersona(e.target.value)}
                  value={persona}
                />
              </div>
          </div>

          <div className="row">
            <div className="cell label">
              Model
            </div>

            <div className="cell value"> 
              <select 
                disabled={isFetching}
                name="model" 
                onChange={(e) => setModel(e.target.value)}
                value={model} 
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
                disabled={isFetching}
                onChange={(e) => setApiKey(e.target.value)}
                type="text"
                value={apiKey}
              />
            </div>
          </div>
        </div>

        <div className="spacer" />

        <div className="button-container">
          <button onClick={update}>
            Update
          </button>
          
          <button onClick={handleClose}>
            Close
          </button>
        </div>
      </div>

      {isFetching && <LoadingIndicator />}
    </div>
  )
}