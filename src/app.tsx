import { useEffect, useRef, useState } from 'react'

import { speakText } from './integrations/text-to-speech'
import { askChatGpt } from './integrations/chat-gpt';
import { minimizeWindow } from './helpers/minimize-window';
import { DecorativeImageSvg } from './components/decorative-image-svg';
import { InputArea } from './components/input-area';
import { OptionsArea } from './components/options-area';

import type { MessageInfo } from './types/message-info';

import './app.css'
import { snapToSidePosition } from './helpers/snap-to-side-position';

export const App = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [queryContent, setQueryContent] = useState<string>("");
  const [pastMessages, setPastMessages] = useState<MessageInfo[]>([]);
  const [mostRecentResponse, setMostRecentResponse] = useState<MessageInfo | null>(null);

  const feedContainerElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    snapToSidePosition();
  }, [])

  useEffect(() => {
    if (feedContainerElementRef?.current) {
      feedContainerElementRef.current.scrollTop = feedContainerElementRef.current.scrollHeight
    }
  }, [
    pastMessages,
    feedContainerElementRef.current
  ])

  const minimizeListener = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && e.shiftKey === true) {
      minimizeWindow();
    }
  }

  const submitOnEnterListener = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSubmit()
    }
  }

  // set up event listeners
  useEffect(() => {
    window.addEventListener("keyup", minimizeListener)
    window.addEventListener("keyup", submitOnEnterListener)

    return () => {
      window.removeEventListener("keyup", minimizeListener)
      window.removeEventListener("keyup", submitOnEnterListener)
    }
  }, [ submitOnEnterListener ])


  const addPastMessage = (messageInfo: MessageInfo) => {
    setPastMessages((pastMessages) => [
      ...pastMessages,
      messageInfo
    ]);

    setMostRecentResponse(messageInfo)
  }

  const handleUserQuery = async () => {
    setIsFetching(true);
    const response = await askChatGpt(queryContent);
    setIsFetching(false);

    addPastMessage({ message: response, fromUser: false });

    speakText(response);
  }

  const handleSubmit = () => {
    if(queryContent) {
      handleUserQuery();
      addPastMessage({ message: queryContent, fromUser: true })
      setQueryContent("")
    }
  }

  return (
    <div className="app">
      <div className="decorative-image">
        <DecorativeImageSvg />
      </div>

      <div className="feed-container" ref={feedContainerElementRef}>
        <div className="feed">
          {
            pastMessages.map((messageInfo, index) => (
              <p className={`message ${messageInfo.fromUser ? "from-user" : "from-api"}`} key={index}>
                {messageInfo.message}
              </p>
            ))
          }
        </div>
      </div>

      <InputArea
        handleSubmit={handleSubmit}
        isFetching={isFetching}
        queryContent={queryContent}
        setQueryContent={setQueryContent}
      />

      <OptionsArea
        mostRecentMessage={mostRecentResponse?.message ?? ""}
        setPastMessages={setPastMessages}
      />

      <audio id="audioPlayback">
        <source id="audioSource" type="audio/mp3" src="" />
      </audio>
    </div>
  )
}