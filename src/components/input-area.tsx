import { useEffect, useRef, useState } from "react";

import { isSafariOniOS } from "../helpers/detectSafariOniOS";
import { osData } from "../helpers/osData";

import "./input-area.css";

interface InputAreaProps {
  handleSubmit: (content: string) => void;
  pastQueries: string[];
}

export const InputArea = (props: InputAreaProps) => {
  const {
    handleSubmit,
    pastQueries,
  } = props;

  const [content, setContent] = useState<string>("");
  const [unsubmittedContent, setUnsubmittedContent] = useState<string>("");
  const [pastMessageIndex, setPastMessageIndex] = useState<number>(-1);

  const isUserOniOSSafari = useRef<boolean>(isSafariOniOS())
  const { isPWA } = osData;

  const onKeyUpListener = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSubmitButtonClicked();
    } else if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      handleMessageHistoryChange(e.key);
    }
  }

  const handleMessageHistoryChange = (keyName: string) => {
    let newIndex = pastMessageIndex;
    
    if (keyName === "ArrowDown" && pastMessageIndex >= 0) {
      newIndex = pastMessageIndex - 1;  
    } else if (keyName === "ArrowUp" && pastMessageIndex < pastQueries.length - 1) {
      newIndex = pastMessageIndex + 1;  
    }

    if (keyName === "ArrowUp" && newIndex !== -1) {
      setContent(pastQueries[newIndex]);
    } else if (keyName === "ArrowDown") {
      if (newIndex === -1) {
        setContent(unsubmittedContent)
      } else if (newIndex >= 0) {
        setContent(pastQueries[newIndex]);
      }
    }

    setPastMessageIndex(newIndex);
  }

  const handleSubmitButtonClicked = () => {
    handleSubmit(content);
    setContent("");
    setUnsubmittedContent("");
  }


  useEffect(() => {
    document.addEventListener("keyup", onKeyUpListener)

    return () => {
      document.removeEventListener("keyup", onKeyUpListener)
    }
  }, [ onKeyUpListener ])

  return (
    <div className={`input-area${isUserOniOSSafari.current && !isPWA ? " isSafariOniOS" : ""}`}>
        <textarea
          autoFocus
          className="input"
          onChange={(e) => {
            setContent(e.target.value);
            setUnsubmittedContent(e.target.value);
          }}
          rows={2}
          value={content}
          placeholder="Ask a question"
        />

        <button
          className="submit-button"
          onClick={handleSubmitButtonClicked}
        >
          Submit
        </button>
      </div>
  )
}