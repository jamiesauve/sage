import { FC, useState, useEffect } from "react";

import { LoadingIndicator } from "./loading-indicator";
import { getConfig, updateConfigWithSimpleValues } from "../integrations/chat-gpt-config";
import { env } from "../helpers/environment-variables"; 

import "./settings-menu.css";

export const SettingsMenu:FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [persona, setPersona] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  // we can't save securely using web/PWA until we have a backend/authentication support
  const [shouldSaveApiKey, setShouldSaveApiKey] = useState<boolean>(env.platform !== "web");

  useEffect(() => {
    loadConfig();
  }, [])
  
  const update = async () => {
    try {
      setIsFetching(true);
      
      await updateConfigWithSimpleValues(shouldSaveApiKey, persona, model, apiKey);
      
      setIsFetching(false);
  
      handleClose();
    } catch(e) {
      console.error("failed to update config", e);
      // TODO: notify user somehow
    }
  }

  const loadConfig = async () => {
    const config = await getConfig();

    setPersona(config.persona.value);
    setModel(config.model.value);
    setApiKey(config.apiKey.value);
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
          
          { !apiKey && (
            <p className="api-key-info">
              If you don't have an API key, you can create one on the {" "} 
              <a 
                href="https://platform.openai.com/account/api-keys"
              >
                OpenAI platform
              </a>
              .
              </p>
          )}
          
          { env.platform === "web" && (
            <>
              <p className="api-key-security-message">
                Sage cannot securely store your API key on a mobile device. Your API key will be encrypted but complete security is not guaranteed. 
              </p>

              <div className="radio-button-item">
                <label>
                  <input
                    checked={shouldSaveApiKey}
                    className="radio-input"
                    name="should-save-api-key"
                    onChange={() => setShouldSaveApiKey(true)}
                    type="radio"
                  />
                    Save my API key anyway
                </label>
              </div>

              <div className="radio-button-item">
                <label>
                  <input
                    checked={!shouldSaveApiKey}
                    className="radio-input"
                    name="should-save-api-key"
                    onChange={() => setShouldSaveApiKey(false)}
                    type="radio"
                    />
                    Delete my API key when I {env.isPWA ? "restart the app" : "leave or refresh this page"}
                </label>
              </div>
            </>
          )}
        </div>

        <div className="spacer" />

        <div className="button-container">
          <button 
            className="destructive-action"
            onClick={async () => {
              await updateConfigWithSimpleValues(true, persona, model, "");

              loadConfig();
            }}
          >
            Clear API key
          </button>

          <div className="spacer" />
          
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