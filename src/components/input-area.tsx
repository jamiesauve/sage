import { useEffect, useState } from "react";

import { env } from "../helpers/environment-variables";

import "./input-area.css";
import { TextareaWithLoadingIndicator } from "./ui/textarea-with-loading-indicator";

interface InputAreaProps {
  handleSubmit: (content: string) => void;
  isFetching: boolean;
  pastQueries: string[];
}

export const InputArea = (props: InputAreaProps) => {
  const {
    handleSubmit,
    isFetching,
    pastQueries,
  } = props;

  const [content, setContent] = useState<string>("");
  const [unsubmittedContent, setUnsubmittedContent] = useState<string>("");
  const [pastMessageIndex, setPastMessageIndex] = useState<number>(-1);

  const { isPWA } = env;

  const onKeyUpListener = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSubmitButtonClicked();
    } else if (["ArrowUp", "ArrowDown"].includes(e.key) && e.altKey) {
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
    <div className={`input-area`}>
        <TextareaWithLoadingIndicator
          isFetching={isFetching}
          onChange={(e) => {
            setContent(e.target.value);
            setUnsubmittedContent(e.target.value);
          }}
          value={content}
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