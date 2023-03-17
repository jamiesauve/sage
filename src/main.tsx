import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

const openAIApiKey = "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";
const openAIApiUrl = "https://api.openai.com/v1/chat/completions";

type MessageInfo = {
  message: string;
  fromUser: boolean;
}

const App = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [queryContent, setQueryContent] = useState<string>("");
  const [pastMessages, setPastMessages] = useState<MessageInfo[]>([]);

  const feedContainerElementRef = useRef<HTMLDivElement>(null);

  const submitOnEnterListener = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSubmit()
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", submitOnEnterListener)

    return () => window.removeEventListener("keyup", submitOnEnterListener)
  }, [ submitOnEnterListener ])


  const addPastMessage = (messageInfo: MessageInfo) => {
    setPastMessages((pastMessages) => [
      ...pastMessages,
      messageInfo
    ]);
  }

  const callChatApi = async () => {
    setIsFetching(true);

    const response = await fetch(
      openAIApiUrl, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`,

        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: queryContent
          }]
        })
      }
    )

    const decodedResponse = await response.json()

    setIsFetching(false);

    addPastMessage({ message: decodedResponse.choices[0].message.content, fromUser: false });
  }

  useEffect(() => {
    if (feedContainerElementRef?.current) {
      feedContainerElementRef.current.scrollTop = feedContainerElementRef.current.scrollHeight
    }
  }, [
    pastMessages,
    feedContainerElementRef.current
  ])

  const handleSubmit = () => {
    if(queryContent) {
      callChatApi();
      addPastMessage({ message: queryContent, fromUser: true })
      setQueryContent("")
    }
  }

  return (
    <div className="main">
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


      <div className="input-area">
        <input
          autoFocus
          className="input"
          onChange={(e) => setQueryContent(e.target.value)}
          value={queryContent}
          placeholder="Ask a question"
        />

        {isFetching &&
          <div className="lds-ripple"><div></div><div></div></div>
        }

        <button
          className="submit-button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
