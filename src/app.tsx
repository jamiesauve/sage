import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";

import { useCallback, useEffect, useRef, useState } from 'react'

import { askChatGpt, setOpenAiApiKey } from './integrations/chat-gpt';
import { formatResponse } from './helpers/format-response';
import { DecorativeImageSvg } from './components/decorative-image-svg';
import { InputArea } from './components/input-area';

import type { MessageInfo } from './types/message-info';

import './app.css'

export const App = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [pastUserMessages, setPastUserMessages] = useState<string[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<MessageInfo[]>([]);
  const feedContainerElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedContainerElementRef?.current) {
      feedContainerElementRef.current.scrollTop = feedContainerElementRef.current.scrollHeight
    }
  }, [
    pastMessages,
    feedContainerElementRef.current
  ])

  const addPastMessage = (messageInfo: MessageInfo) => {



    setDisplayedMessages(previous => [...previous, messageInfo])
    if (messageInfo.fromUser) {
      setPastUserMessages(previous => [...previous, messageInfo.message])
  }
  };

  const handleUserQuery = async (queryContent?: string) => {
    if (!queryContent) return;
    setIsFetching(true);
    const response = await askChatGpt(queryContent);
    setIsFetching(false);

    const formattedResponse = formatResponse(response);

    addPastMessage({ message: response, messageJSX: formattedResponse, fromUser: false });
  }

  const handleSubmit = useCallback(async (content: string) => {
    if(content) {
      if (content.startsWith("set-api-key ")) {
        try {
          const apiKey = content.split(" ")[1];
          await writeTextFile('open-ai-api-key.txt', apiKey, { dir: BaseDirectory.App });

          setOpenAiApiKey(apiKey);

        } catch (e) {
          console.error('error writing to file:', e)
        }
      } else if (content === "clear") {
        setDisplayedMessages([]);
      } else {
        addPastMessage({ message: content, messageJSX: [<p className="text">{content}</p>], fromUser: true })

        handleUserQuery(content);
      }
    }
  },[
    handleUserQuery,
    addPastMessage
  ])
  
  return (
    <div className="app">
      <div className="decorative-image">
        <DecorativeImageSvg />
      </div>

      <div className="feed-container" ref={feedContainerElementRef}>
        <div className="feed">
          {
            displayedMessages.map((messageInfo, index) => {          
              return (
              <div 
                className={`message ${messageInfo.fromUser ? "from-user" : "from-api"}`} 
                key={index}
              >
                {messageInfo.messageJSX}
              </div>
            )})
          }
        </div>
      </div>

      <InputArea
        handleSubmit={handleSubmit}
        isFetching={isFetching}
        pastQueries={[...pastUserMessages].reverse()}
      />

      <audio id="audioPlayback">
        <source id="audioSource" type="audio/mp3" src="" />
      </audio>
    </div>
  )
}