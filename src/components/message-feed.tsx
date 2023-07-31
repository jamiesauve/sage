import { FC, useEffect, useRef } from "react"
import { Message } from "../state/messagesReducer";

import "./message-feed.css";

export const MessageFeed: FC<{messages: Message[] }> = ({ messages }) => {
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
            messages.map(message => (
              <div 
                className={`message from-${message.from}`} 
                key={message.id}
              >
                {message.JSX}
              </div>
            ))
          }
        </div>
      </div>
  )
}