import { SenderEntity, Message, messageSetters } from "../state/messagesReducer"
import { getConfig } from "./chat-gpt-config";

type MessageInChatGptFormat = {
  role: string;
  content: string;
}

const MAX_CHARACTERS_IN_CONVERSATION = 16000; // this is approximate, it's actually measured in tokens
const MINIFY_CONVERSATION_THRESHOLD = 3000; // Reserve 4000 characters for the next user message

let currentConversationLength = 0;

export const getIsConversationHistoryTooLong = (messages: Message[]): boolean => {
  const conversationLengthInCharacters = messages.reduce((aggr: number, message: Message) => {
    return aggr + message.text.length
  }, 0)
  
  currentConversationLength = conversationLengthInCharacters;

  return conversationLengthInCharacters >= MINIFY_CONVERSATION_THRESHOLD;
}

const formatMessagesForChatGpt = async (messages: Message[], query: string): Promise<MessageInChatGptFormat[]> => {
  const config = await getConfig();
  return [
    {
      role: "user",
      content: config.persona.value,
    },
    ...messages.map((message) => ({
      role: message.from === SenderEntity.Api ? "assistant" : "user",
      content: message.text
    })),
    {
      role: "user",
      content: query
    }
  ];
}

export const condenseConversationHistory = async (dispatch: any, messages: Message[]): Promise<void> => {
  const query = `Please resume our conversation so far from my point of view, as concisely as
  possible and without leaving out important details. Your answer needs to be no longer than
  ${MAX_CHARACTERS_IN_CONVERSATION - currentConversationLength} characters.`

  const formattedMessages = await formatMessagesForChatGpt(messages, query);

  try {
    const response = await callChatGpt(formattedMessages);
    const condensedConversationHistory = response.choices[0].message.content;
  
    messageSetters.addMessage(dispatch, {
      appearsToUser: false,
      isSummarized: false,
      from: SenderEntity.Api,
      text: condensedConversationHistory,
    })
    
    messages.forEach(message => {
      messageSetters.updateMessageById(dispatch, message.id, { isSummarized: true })
    })
  
    // reset character tracking
    currentConversationLength = condensedConversationHistory.length;
  } catch (e) {
    console.error("error minifying the chat history", e);
  }
}

export const askChatGpt = async (dispatch: any, messages: Message[], query: string): Promise<void> => {

  const formattedMessages = await formatMessagesForChatGpt(messages, query);

  try {
    const answer = await callChatGpt(formattedMessages);
  
    messageSetters.addMessage(dispatch, {
      appearsToUser: true,
      isSummarized: false,
      from: SenderEntity.Api,
      text: answer,
    })
  } catch (e) {
    console.error(e);

    messageSetters.addMessage(dispatch, {
      appearsToUser: true,
      from: SenderEntity.Sage, 
      isSummarized: true, // we don't want this included in summaries or sent to ChatGPT
      text: "Failed to connect to ChatGPT.", 
    });
  }
}

const callChatGpt = async (messages: MessageInChatGptFormat[]) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      })
    }
  )

  const decodedResponse = await response.json();
  const answer = decodedResponse.body.choices[0].message.content; 
  
  return answer;
}