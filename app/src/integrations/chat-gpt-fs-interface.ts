import { osData } from "../helpers/getOsData";

export type ConfigItem = {
  label: string;
  value: string;
}

export type Config = {
  persona: ConfigItem;
  model: ConfigItem;
  apiKey: ConfigItem;
};

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

export const createChatGptFsInterface = async () => {
  let fsInterface;

  if (osData.platform === "tauri") {
    const { TauriFsInterface }  = await import("../helpers/tauri-fs-interface");
    fsInterface = TauriFsInterface();
  } else {
    const { useMockWebFsInterface } = await import("../helpers/web-mock-fs-interface");
    fsInterface = useMockWebFsInterface();
  }
  
  const {
    readFile,
    writeFile,
    createFile,
    checkIfFileExists
  } = fsInterface;

  const chatGPTConfigFileName = "chat-gpt-config.txt";

  const getConfig = async (): Promise<Config> => {
    const doesFileExist = await checkIfFileExists(chatGPTConfigFileName);

    if (!doesFileExist) {
      await createFile(chatGPTConfigFileName, JSON.stringify(defaultConfig));
    }

    const stringifiedConfig = await readFile(chatGPTConfigFileName);
    return JSON.parse(stringifiedConfig);
  };

  const setConfig = async (config: Config) => {
      await writeFile(chatGPTConfigFileName, JSON.stringify(config));
  };

  const updateConfigWithSimpleValues = async (persona?: string, model?: string, apiKey?: string) => {
    console.log('in u', {persona, model, apiKey})
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

  return {
    getConfig,
    setConfig,
    updateConfigWithSimpleValues,
  }
}