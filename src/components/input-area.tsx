interface InputAreaProps {
  handleSubmit: () => void;
  isFetching: boolean;
  queryContent: string;
  setQueryContent: (queryContent: string) => void;
}

export const InputArea = (props: InputAreaProps) => {
  const {
    handleSubmit,
    isFetching,
    queryContent,
    setQueryContent,
  } = props;

  return (
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
  )
}