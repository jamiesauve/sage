import { FC, useState, useEffect } from "react";

import { LoadingIndicator } from "./loading-indicator";
import { getConfig, updateConfigWithSimpleValues } from "../integrations/chat-gpt-config";

import "./settings-menu.css";

export const SettingsMenu:FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [persona, setPersona] = useState<string>("");

  useEffect(() => {
    loadConfig();
  }, [])
  
  const update = async () => {
    try {
      setIsFetching(true);
      
      await updateConfigWithSimpleValues(persona);
      
      handleClose();
    } catch(e) {
      console.error("failed to update config", e);
      // TODO: notify user somehow
    } finally {
      setIsFetching(false);
    }
  }

  const loadConfig = async () => {
    const config = await getConfig();

    setPersona(config.persona.value);
  };

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


          <p className="secondary-text">
            This is 'who' your assistant will be. Try 'Please speak like a pirate.'
          </p>
        </div>

        <div className="spacer" />

        <div className="button-container">
          <button 
            className="secondary-action"
            onClick={handleClose}
          >
            Close
          </button>

          <button 
            className="primary-action"
            onClick={update}
          >
            Update
          </button>
        </div>
      </div>

      {isFetching && <LoadingIndicator />}
    </div>
  )
}