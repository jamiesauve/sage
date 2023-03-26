import { snapToSidePosition } from "../helpers/snap-to-side-position";
import { minimizeWindow } from "../helpers/minimize-window";

import type { MessageInfo } from '../types/message-info';
import { speakText } from "../integrations/text-to-speech";

interface OptionsAreaProps {
  mostRecentMessage: string;
  setPastMessages: (messages: MessageInfo[]) => void;
}

export const OptionsArea = (props: OptionsAreaProps) => {
  const { 
    mostRecentMessage, 
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
          onClick={() => {
            minimizeWindow();
          }}
        >
          Hide
        </button>
        
        <button
          onClick={() => setPastMessages([])}
        >
          Clear input
        </button>

        <button
          onClick={() => speakText(mostRecentMessage)}
        >
          Repeat Reply
        </button>
      </div>
  )
}