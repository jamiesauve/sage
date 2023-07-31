export const useWebFsInterface = () => {
  const readFile = async (path: string): Promise<string> => {
    const config = localStorage.getItem(path);
    return config ?? "";
  }

  const writeFile = async (path: string, payload: string): Promise<undefined> => {
    localStorage.setItem(path, payload);

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