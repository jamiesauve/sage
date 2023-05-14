import CryptoJS from 'crypto-js';

import { osData } from './osData';

const key = osData.environmentVariables.encryptionKey;

export const useWebFsInterface = () => {
  const readFile = async (path: string) => {
    const encryptedConfig = localStorage.getItem(path);

    if (!encryptedConfig) return "";

    const wordArray = CryptoJS.AES.decrypt(encryptedConfig, key)
    
    return wordArray.toString(CryptoJS.enc.Utf8);

  }

  const writeFile = async (path: string, payload: string): Promise<undefined> => {
    const encryptedPayload = CryptoJS.AES.encrypt(payload, key).toString();

    localStorage.setItem(path, encryptedPayload);

    return undefined;
  };

  const createFile = async (path: string, payload: string): Promise<undefined> => {
    await writeFile(path, payload);

    return undefined;
  }

  const checkIfFileExists = async (path: string): Promise<boolean> => {
    const stringifiedConfig = localStorage.getItem(path);

    return !!stringifiedConfig;
  }
  
  return {
    readFile,
    writeFile,
    createFile,
    checkIfFileExists
  }
}