import React, { FC, useState, useEffect, useRef } from "react";

import { LoadingIndicator } from "./loading-indicator";
import { createChatGptFsInterface } from "../integrations/chat-gpt-fs-interface";

import "./settings-menu.css";

export const SettingsMenu:FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [persona, setPersona] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  const [chatGptInterface, setChatGptInterface] = useState<Record<string, any>>();
  
  useEffect(() => {
    (async () => {
      const fsInterface = await createChatGptFsInterface();
      setChatGptInterface(fsInterface);
    })();
  }, [])

  useEffect(() => {
    if (!chatGptInterface) return;
    
    (async () => {
      const config = await chatGptInterface.getConfig();

      setPersona(config.persona.value);
      setModel(config.model.value);
      setApiKey(config.apiKey.value);
    })();
  }, [
    chatGptInterface
  ])

  
  
  const update = async () => {
    try {
      setIsFetching(true);
      
      console.log({ chatGptInterface })

      await chatGptInterface?.updateConfigWithSimpleValues(persona, model, apiKey);
      
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