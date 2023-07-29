import { formatMessage } from "../helpers/format-message";

let messageIndex = 0;

export enum SenderEntity {
  User = "user",
  Sage = "sage",
  Api = "api"
}

type MessageCreateData = {
  appearsToUser: boolean;
  from: SenderEntity;
  isSummarized: boolean;
  text: string;
}

type MessageUpdateData = {
  appearsToUser?: boolean;
  from?: SenderEntity;
  isSummarized?: boolean;
  text?: string;
}

export type Message = MessageCreateData & {
  id: number;
  JSX: JSX.Element[];
}

const messageTypes = {
  ADD_MESSAGE: "ADD_MESSAGE",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
  MARK_MESSAGES_AS_SUMMARIZED: "MARK_MESSAGES_AS_SUMMARIZED",
  UPDATE_MESSAGE_BY_ID: "UPDATE_MESSAGE_BY_ID",
} 

export interface MessagesInitialState {
  messages: Message[]
}

type Action = {
  type: string,
  payload?: any,
}

export const messageInitialState: MessagesInitialState = {
  messages: [],
};

export function messagesReducer(state: typeof messageInitialState, action: Action) {
  switch (action.type) {
    case messageTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          action.payload.message,
        ]
      };
    case messageTypes.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    case messageTypes.UPDATE_MESSAGE_BY_ID:
      const newMessagesArray = [ ...state.messages ];

      // make sure the message exists
      const messageToUpdate = newMessagesArray.find(message => message.id === action.payload.id);
      if (!messageToUpdate) throw new Error("message could not be found");

      const updatedMessage = {
        ...messageToUpdate,
        ...action.payload.message,
        JSX: action.payload.message.text 
          ? formatMessage(action.payload.message.text)
          : messageToUpdate.JSX,
      }
      
      const updatedMessageArray = [
        ...state.messages.filter(message => message.id !== action.payload.id),
        updatedMessage,
      ]
      
      
      return {
        ...state,
        // sort in ascending order by id
        messages: updatedMessageArray.sort((a: Message, b: Message) => a.id > b.id ? 1 : -1),
      }
    default:
      throw new Error();
  }
}

export const messageSetters = {
  addMessage: (dispatch: any, message: MessageCreateData) => {
    const id = messageIndex;
    messageIndex++;

    dispatch({
      type: messageTypes.ADD_MESSAGE,
      payload: {
        message: {
          ...message,
          id,
          JSX: formatMessage(message.text), 
        },
      }
    });
  },
  clearMessages: (dispatch: any) => {
    dispatch({
      type: messageTypes.CLEAR_MESSAGES,
    });
  },
  updateMessageById: (dispatch: any, id: number, message: MessageUpdateData) => {
    dispatch({
      type: messageTypes.UPDATE_MESSAGE_BY_ID,
      payload: {
        id,
        message
      }
    })
  }
}

export const messageGetters = {
  messagesFromUser: (state: typeof messageInitialState): Message[] => {
    return state.messages.filter((message: Message) => message.from === SenderEntity.User)
  },
  unsummarizedMessages: (state: typeof messageInitialState): Message[] => {
    return state.messages.filter((message: Message) => message.isSummarized === false)
  },
  messagesThatAppearToTheUser: (state: typeof messageInitialState): Message[] => {
    return state.messages.filter((message: Message) => message.appearsToUser === true)
  },
}