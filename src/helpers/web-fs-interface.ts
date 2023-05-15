import CryptoJS from 'crypto-js';

import { env } from './environment-variables';

const key = env.encryptionKey;

export const useWebFsInterface = () => {
  const readFile = async (path: string) => {
    const encryptedConfig = localStorage.getItem(path);

    if (!encryptedConfig || !key) return "";

    const wordArray = CryptoJS.AES.decrypt(encryptedConfig, key)
    
    return wordArray.toString(CryptoJS.enc.Utf8);

  }

  const writeFile = async (path: string, payload: string): Promise<undefined> => {
    if (!key) throw new Error("Failure to encrypt - data not saved");
    
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