import { useEffect, useState } from "react";

interface InputAreaProps {
  handleSubmit: (content: string) => void;
  isFetching: boolean;
}

export const InputArea = (props: InputAreaProps) => {
  const {
    handleSubmit,
    isFetching,
  } = props;

  const [content, setContent] = useState<string>("");

  const submitOnEnterListener = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSubmit(content);
      setContent("");
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", submitOnEnterListener)

    return () => {
      window.removeEventListener("keyup", submitOnEnterListener)
    }
  }, [ submitOnEnterListener ])

  return (
    <div className="input-area">
        <input
          autoFocus
          className="input"
          onChange={(e) => setContent(e.target.value)}
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
          }}
        >
          Submit
        </button>
      </div>
  )
}