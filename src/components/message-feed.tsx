import { FC, useEffect, useRef } from "react"
import { MessageInfo } from "../types/message-info";

import "./message-feed.css";

export const MessageFeed: FC<{messages: MessageInfo[] }> = ({ messages }) => {
  const feedContainerElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedContainerElementRef?.current) {
      feedContainerElementRef.current.scrollTop = feedContainerElementRef.current.scrollHeight
    }
  }, [
    messages,
    feedContainerElementRef.current
  ])

  return (
    <div className="feed-container" ref={feedContainerElementRef}>
        <div className="feed">
          {
            messages.map(messageInfo => (
              <div 
                className={`message from-${messageInfo.from}`} 
                key={messageInfo.message}
              >
                {messageInfo.messageJSX}
              </div>
            ))
          }

          <div>Standalone? <div className="standalone">color</div></div>

          <div>IndexedDB? {window.indexedDB ? "yes": "no"}</div>

          <div>window.location.search: {window.location.search}</div>
        </div>
      </div>
  )
}