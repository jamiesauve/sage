import { LoadingIndicator } from "../loading-indicator";

import "./textarea-with-loading-indicator.css";

interface TextareaWithLoadingIndicatorProps {
  isFetching: boolean;
  onChange: (e: any) => void;
  value: string;
}

export const TextareaWithLoadingIndicator: React.FC<TextareaWithLoadingIndicatorProps> = ({
  isFetching,
  onChange,
  value
}) => {

  return (
    <div className="textarea-with-loading-indicator">
      <textarea
        autoFocus
        className="input"
        onChange={onChange}
        rows={2}
        value={value}
        placeholder="Ask a question"
      />

      { isFetching
        && <div className="detacher">
          <LoadingIndicator />
        </div>
      }
    </div>
  )
}