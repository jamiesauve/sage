import { OPEN_AI_API_KEY } from "./DONT_COMMIT_THIS";

const openAIApiUrl = "https://api.openai.com/v1/chat/completions";

export const askChatGpt = async(query: string): Promise<string> => {
  const response = await fetch(
    openAIApiUrl, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPEN_AI_API_KEY}`,
  
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: query
        }]
      })
    }
  )

  const decodedResponse = await response.json()
  const responseAsText = decodedResponse.choices[0].message.content;
  return responseAsText;
}