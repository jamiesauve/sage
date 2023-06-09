import { useCallback, useRef, useState } from 'react'

import { askChatGpt } from './integrations/chat-gpt';
import { formatResponse } from './helpers/format-response';
import { DecorativeImageSvg } from './components/svg/decorative-image-svg';
import { InputArea } from './components/input-area';
import { SettingsButton } from "./components/settings-button";

import { Entity, MessageInfo } from './types/message-info';

import './app.css'
import { LoadingIndicator } from './components/loading-indicator';
import { MessageFeed } from './components/message-feed';

export const App = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [pastUserMessages, setPastUserMessages] = useState<string[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<MessageInfo[]>([]);
  
  const messageCountRef = useRef<number>(0);

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
      const response = await askChatGpt(queryContent, displayedMessages);
      const formattedResponse = formatResponse(response);
      addPastMessage({ message: response, messageJSX: formattedResponse, from: Entity.Api });
    } catch (e) {
      console.error("error calling ChatGPT", e);
      const failureMessage = "Failed to connect to ChatGPT. You might need to update your OpenAI API key in Settings."
      
      addPastMessage({ message: failureMessage, messageJSX: [<p className="text" key={`message${messageCountRef}`}>{failureMessage}</p>], from: Entity.Sage });
    } finally {
      setIsFetching(false);
    }
  }

  const handleSubmit = useCallback(async (content: string) => {
    if (content.toLowerCase().trim() === "clear") {
      setDisplayedMessages([]);
    } else if (content) {
      addPastMessage({ 
        message: content,
        messageJSX: [<p className="text" key={`message${messageCountRef}`}>{content}</p>], 
        from: Entity.User
        })

      handleUserQuery(content);
    }
  },[
    handleUserQuery,
    addPastMessage
  ])
  
  return (
    <div className="app">
      <div className="main">
        <SettingsButton />
        
        <DecorativeImageSvg />

        <MessageFeed messages={displayedMessages} />

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
    </div>
  )
}