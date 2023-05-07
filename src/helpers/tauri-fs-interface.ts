import { BaseDirectory, createDir, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

const readFile = async (path: string): Promise<string> => {
  try {
    const exists = await checkIfFileExists(path);
  
    if (!exists) {
      throw new Error("Could not find a file at the specified path: " + path)
    }
  
    const stringifiedConfig = await readTextFile(path, { dir: BaseDirectory.App })
    return stringifiedConfig;
  } catch (e) {
    throw new Error("Error reading file: " + e)
  }
}

const writeFile = async (path: string, payload: string): Promise<undefined> => {
  try {
    const exists = await checkIfFileExists(path);

    if (!exists) {
      await createFile(path, payload);
    }

    await writeTextFile(path, payload, { dir: BaseDirectory.App });
    return;
  } catch (e) {
    throw new Error("Error writing file: " + e)
  }
}

const createFile = async (path: string, payload: string): Promise<undefined> => {
  try {   
    // config is not actually used, but we can't write files without creating the parent directory and this does that
    await createDir('config', { dir: BaseDirectory.App, recursive: true });

    await writeTextFile(path, payload, { dir: BaseDirectory.App });

    return;
  } catch (e) {
    throw new Error('error creating file: ' + path + " Error: " + e);
  }
}

let doesConfigExist = false;

const checkIfFileExists = async (path: string) => {
  try {
    if (doesConfigExist) {
      return true;
    } else {
      const result = await exists(path, { dir: BaseDirectory.App });
      if (result) {
        doesConfigExist = true;
      }

      return result;
    }
  } catch (e) {
    throw new Error("Error checking for file: " + path + " Error: " + e)
  }
}

export const TauriFsInterface = () => ({
  readFile,
  writeFile,
  createFile,
  checkIfFileExists
})