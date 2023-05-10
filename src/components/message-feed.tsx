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

          {window.navigator.userAgent}
        </div>
      </div>
  )
}

// in tauri-mac: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)
// in Brave browser on Mac, mobile devtools: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36
// in Brave browser on Mac: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36