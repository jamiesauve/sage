import { BaseDirectory, createDir, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

export type ConfigItem = {
  label: string;
  value: string;
}

export type Config = {
  persona: ConfigItem;
  model: ConfigItem;
  apiKey: ConfigItem;
};

const chatGPTConfigFileName = "chat-gpt-config.txt";

export const defaultConfig = {
  persona: {
    label: "AI Requests",
    value: ``
  },
  model: {
    label: "Model",
    value: "gpt-3.5-turbo",
  },
  apiKey: {
    label: "OpenAI API key",
    value: "",
  },
};

let doesConfigExist = false;

export const checkIfConfigExists = async () => {
    if (doesConfigExist) {
      return true;
    } else {
      const result = await exists(chatGPTConfigFileName, { dir: BaseDirectory.App });
      if (result) {
        doesConfigExist = true;
      }

      return result;
    }
}

export const createConfig = async () => {
  try {   
    // config is not actually used, but we can't write files without creating the parent directory and this does that
    await createDir('config', { dir: BaseDirectory.App, recursive: true });

    await writeTextFile(chatGPTConfigFileName, JSON.stringify(defaultConfig), { dir: BaseDirectory.App });
  } catch (e) {
    console.error('error creating new config file', e)
  }
} 

export const getConfig = async (): Promise<Config> => {
  const exists = await checkIfConfigExists();

  if (!exists) {
    await createConfig();
  }

  const stringifiedConfig = await readTextFile(chatGPTConfigFileName, { dir: BaseDirectory.App })
  const config: Config = JSON.parse(stringifiedConfig);
  return config;
};

export const setConfig = async (config: Config) => {
  const exists = await checkIfConfigExists();
  try {
    if (!exists) {
      await createConfig();
    }
    await writeTextFile(chatGPTConfigFileName, JSON.stringify(config), { dir: BaseDirectory.App });
  } catch (e) {
    throw new Error(e as string);
  }
};

export const updateConfigWithSimpleValues = async (persona?: string, model?: string, apiKey?: string) => {
  const {...config}: Config = await getConfig();

  if (persona) {
    config.persona.value = persona;
  }

  if (model) {
    config.model.value = model;
  }

  if (apiKey) {
    config.apiKey.value = apiKey;
  }

  await setConfig(config);
}