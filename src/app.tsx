import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";

import { useCallback, useEffect, useRef, useState } from 'react'

import { askChatGpt, setOpenAiApiKey } from './integrations/chat-gpt';
import { formatResponse } from './helpers/format-response';
import { DecorativeImageSvg } from './components/svg/decorative-image-svg';
import { InputArea } from './components/input-area';
import { SettingsButton } from "./components/settings-button";

import { Entity, MessageInfo } from './types/message-info';

import './app.css'
import { LoadingIndicator } from './components/loading-indicator';

export const App = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [pastUserMessages, setPastUserMessages] = useState<string[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<MessageInfo[]>([]);
  const feedContainerElementRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef<number>(0);

  useEffect(() => {
    if (feedContainerElementRef?.current) {
      feedContainerElementRef.current.scrollTop = feedContainerElementRef.current.scrollHeight
    }
  }, [
    displayedMessages,
    feedContainerElementRef.current
  ])

  const addPastMessage = (messageInfo: MessageInfo) => {
    messageCountRef.current++;

    setDisplayedMessages(previous => [...previous, messageInfo])
    
    if (messageInfo.from === Entity.User) {
      setPastUserMessages(previous => [...previous, messageInfo.message])
    }
  };

  const handleUserQuery = async (queryContent?: string) => {
    if (!queryContent) return;
    setIsFetching(true);

    try {
      const response = await askChatGpt(queryContent);
      setIsFetching(false);
  
      const formattedResponse = formatResponse(response);
      addPastMessage({ message: response, messageJSX: formattedResponse, from: Entity.Api });
    } catch (e) {
      console.error("error calling ChatGPT", e);
      const failureMessage = "Failed to connect to ChatGPT. You can set your OpenAI API key using \"set-api-key <api-key>\""
      
      addPastMessage({ message: failureMessage, messageJSX: [<p className="text" key={`message${messageCountRef}`}>{failureMessage}</p>], from: Entity.Sage });
    }
  }

  const handleSubmit = useCallback(async (content: string) => {
    if(content) {
      if (content.startsWith("set-api-key ")) {
        try {
          const apiKey = content.split(" ")[1];
          await writeTextFile('open-ai-api-key.txt', apiKey, { dir: BaseDirectory.App });

          setOpenAiApiKey(apiKey);

          const successMessage = `API key successfully updated to "${apiKey}".`
          
          addPastMessage({ 
            message: successMessage,
            messageJSX: [<p className="text" key={`message${messageCountRef}`}>{successMessage}</p>], 
            from: Entity.Sage 
          });
        } catch (e) {
          console.error('error writing to file:', e)
          
          const failureMessage = "Failed to update the API key."
         
          addPastMessage({ 
            message: failureMessage,
            messageJSX: [<p className="text" key={`message${messageCountRef}`}>{failureMessage}</p>], 
            from: Entity.Sage 
          });
        }
      } else if (content === "clear") {
        setDisplayedMessages([]);
      } else {
        addPastMessage({ 
          message: content,
          messageJSX: [<p className="text" key={`message${messageCountRef}`}>{content}</p>], 
          from: Entity.User
         })

        handleUserQuery(content);
      }
    }
  },[
    handleUserQuery,
    addPastMessage
  ])
  
  return (
    <div className="app">
      <SettingsButton />

      <div className="decorative-image">
        <DecorativeImageSvg />
      </div>

      <div className="feed-container" ref={feedContainerElementRef}>
        <div className="feed">
          {
            displayedMessages.map(messageInfo => (
              <div 
                className={`message from-${messageInfo.from}`} 
                key={messageInfo.message}
              >
                {messageInfo.messageJSX}
              </div>
            ))
          }
        </div>
      </div>

      <InputArea
        handleSubmit={handleSubmit}
        pastQueries={[...pastUserMessages].reverse()}
      />

      <audio id="audioPlayback">
        <source id="audioSource" type="audio/mp3" src="" />
      </audio>

      {
        isFetching && <LoadingIndicator />
      }
    </div>
  )
}