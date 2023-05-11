export type FsInterface = {
  readFile: ((path: string) => Promise<string>),
  writeFile: ((path: string, payload: string) => Promise<undefined>),
  createFile: ((path: string, payload: string) => Promise<undefined>),
  checkIfFileExists: ((path: string) => Promise<boolean>)
}

// set up with default values, these should never get used
export let fsInterface: FsInterface = {
  readFile: async (path) => "",
  writeFile: async () => undefined,
  createFile: async () => undefined,
  checkIfFileExists: async () => false
};

export const setFsInterfacePlatform = async (platform: string) => {
  if (platform === "tauri") {
    const { TauriFsInterface }  = await import("../helpers/tauri-fs-interface");
    fsInterface = TauriFsInterface();
  } else {
    const { useWebFsInterface } = await import("./web-fs-interface");
    fsInterface = useWebFsInterface();
  }
}
