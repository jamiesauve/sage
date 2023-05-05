import { Entity, MessageInfo } from "../types/message-info";
import { getConfig } from "./chat-gpt-config";

const openAIApiUrl = "https://api.openai.com/v1/chat/completions";

export const askChatGpt = async (query: string, pastMessages: MessageInfo[]): Promise<string> => {
  const config = await getConfig();

  const formattedMessages = [
    {
      role: "user",
      content: config.persona.value,
    },
    ...pastMessages.map((messageInfo) => ({
      role: messageInfo.from === Entity.Api ? "assistant" : "user",
      content: messageInfo.message
    })),
    {
      role: "user",
      content: query
    }
  ]

  const response = await fetch(
    openAIApiUrl, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey.value}`,
  
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: formattedMessages
      })
    }
  )

  const decodedResponse = await response.json()
  const responseAsText = decodedResponse.choices[0].message.content;
  return responseAsText;
}