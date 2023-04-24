import { snapToSidePosition } from "../helpers/snap-to-side-position";

import type { MessageInfo } from '../types/message-info';

interface OptionsAreaProps {
  regenerateReply: () => void;
  setPastMessages: (messages: MessageInfo[]) => void;
}

export const OptionsArea = (props: OptionsAreaProps) => {
  const {
    regenerateReply, 
    setPastMessages
  } = props;

  return (
    <div className="options-area">
        <button
          onClick={async () => {
            snapToSidePosition();
          }}
        >
          Dock
        </button>
        
        <button
          onClick={() => setPastMessages([])}
        >
          Clear input
        </button>

        <button
          onClick={regenerateReply}
        >
          Repeat Question
        </button>
      </div>
  )
}