import { BaseDirectory, createDir, exists, readTextFile } from "@tauri-apps/api/fs";

const openAIApiUrl = "https://api.openai.com/v1/chat/completions";

let hasBeenInitialized = false;
let openAiApiKey = "";

const initializeChatGpt = async () => {
  const pathExists = await exists('com.tauri.dev', { dir: BaseDirectory.App });

   try {   
     if (!pathExists) {
       // config is not actually used, but we can't write files without creating the parent directory
       await createDir('config', { dir: BaseDirectory.App, recursive: true });
      }
    } catch (e) {
      console.error('error creating directory', e)
    }
    
    try {
      openAiApiKey = await readTextFile('open-ai-api-key.txt', { dir: BaseDirectory.App })
    } catch (e) {
      console.error('error reading file:', e)
    }
}

export const askChatGpt = async (query: string): Promise<string> => {
  if (!hasBeenInitialized) {
    await initializeChatGpt();
    
    hasBeenInitialized = true;
  }

  const response = await fetch(
    openAIApiUrl, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`,
  
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