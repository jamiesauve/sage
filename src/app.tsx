import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";

import { useEffect, useRef, useState } from 'react'

import { askChatGpt } from './integrations/chat-gpt';
import { formatResponse } from './helpers/format-response';
import { DecorativeImageSvg } from './components/decorative-image-svg';
import { InputArea } from './components/input-area';
import { OptionsArea } from './components/options-area';

import type { MessageInfo } from './types/message-info';

import './app.css'

export const App = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lastUserMessage, setLastUserMessage] = useState<MessageInfo>();
  const [pastMessages, setPastMessages] = useState<MessageInfo[]>([]);

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
    setPastMessages((pastMessages) => [
      ...pastMessages,
      messageInfo
    ]);
  }

  const handleUserQuery = async (queryContent?: string) => {
    if (!queryContent) return;

    setLastUserMessage({ message: queryContent, messageJSX: [<p className="text">{queryContent}</p>], fromUser: true });

    setIsFetching(true);
    const response = await askChatGpt(queryContent);
    setIsFetching(false);

    const formattedResponse = formatResponse(response);

    addPastMessage({ message: response, messageJSX: formattedResponse, fromUser: false });
  }

  const handleSubmit = (content: string) => {
    if(content) {
      if (content.startsWith("set-api-key ")) {
        try {
          writeTextFile('open-ai-api-key.txt', content.split(" ")[1], { dir: BaseDirectory.App });
        } catch (e) {
          console.error('error writing to file:', e)
        }
      } else {
        addPastMessage({ message: content, messageJSX: [<p className="text">{content}</p>], fromUser: true })

        handleUserQuery(content);
      }
    }
  }

  const regenerateReply = () => {
    handleUserQuery(lastUserMessage?.message);
  }
  
  return (
    <div className="app">
      <div className="decorative-image">
        <DecorativeImageSvg />
      </div>

      <div className="feed-container" ref={feedContainerElementRef}>
        <div className="feed">
          {
            pastMessages.map((messageInfo, index) => {          
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
        pastQueries={pastMessages?.filter(message => message.fromUser).map(message => message.message).reverse()}
      />

      <OptionsArea
        regenerateReply={regenerateReply}
        setPastMessages={setPastMessages}
      />

      <audio id="audioPlayback">
        <source id="audioSource" type="audio/mp3" src="" />
      </audio>
    </div>
  )
}