interface MockFile {
  path: string;
  content: string;
}

export const useMockWebFsInterface = () => {
  let mockFolder: MockFile[] = [];

  const readFile = async (path: string) => {
    const file = mockFolder.find(mockFile => mockFile.path === path)

    if (!file) {
      throw new Error("file not found: " + path);
    }

    return file.content;
  }

  const writeFile = async (path: string, payload: string) => {
    const newMockFolder = mockFolder.filter(file => file.path !== path);

    const newFile = { path, content: payload } as MockFile;

    mockFolder = [
      ...newMockFolder,
      newFile,
    ]

    return undefined;
  };

  const createFile = async (path: string, payload: string) => {
    if (await checkIfFileExists(path)) {
      writeFile(path, payload)
    } else {
      const newFile = { path, content: payload } as MockFile;

      mockFolder = [
        ...mockFolder,
        newFile,
      ]
    }

    return undefined;
  }

  const checkIfFileExists = async (path: string) => {
    const index = mockFolder.findIndex(mockFile => mockFile.path === path)
    return index !== -1;
  }
  
  return {
    readFile,
    writeFile,
    createFile,
    checkIfFileExists
  }
}