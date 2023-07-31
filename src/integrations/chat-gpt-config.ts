import { fsInterface } from "../helpers/fs-interface";

const {
  readFile,
  writeFile,
  createFile,
  checkIfFileExists
} = fsInterface;

export type ConfigItem = {
  label: string;
  value: string;
}

export type Config = {
  persona: ConfigItem;
};

const chatGPTConfigFileName = "chat-gpt-config.txt";

export const defaultConfig = {
  persona: {
    label: "AI Requests",
    value: ``
  },
};

export const getConfig = async (): Promise<Config> => {
  const doesFileExist = await checkIfFileExists(chatGPTConfigFileName);

  if (!doesFileExist) {
    await createFile(chatGPTConfigFileName, JSON.stringify(defaultConfig));
  }

  try {
    let stringifiedConfig = await readFile(chatGPTConfigFileName);
    
    return {...JSON.parse(stringifiedConfig)}  
  } catch (e: any) {
    throw new Error(e);
  }
};

export const setConfig = async (config: Config) => {
  await writeFile(chatGPTConfigFileName, JSON.stringify(config));
};

export const updateConfigWithSimpleValues = async (persona: string) => {
  const {...config}: Config = await getConfig();

  config.persona.value = persona;

  await setConfig(config);
}