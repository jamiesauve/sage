import { useEffect, useState } from "react";

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

  const onKeyUpListener = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSubmit(content);
      setContent("");
      setUnsubmittedContent("");
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


  useEffect(() => {
    document.addEventListener("keyup", onKeyUpListener)

    return () => {
      document.removeEventListener("keyup", onKeyUpListener)
    }
  }, [ onKeyUpListener ])

  return (
    <div className="input-area">
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

        {isFetching &&
          <div className="lds-ripple"><div></div><div></div></div>
        }

        <button
          className="submit-button"
          onClick={() => {
            handleSubmit(content);
            setContent("");
            setUnsubmittedContent("");
          }}
        >
          Submit
        </button>
      </div>
  )
}