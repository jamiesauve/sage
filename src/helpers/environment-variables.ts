
export type Env = {
  platform?: string;
  isPWA?: boolean;
  encryptionKey?: string;
}

export const env: Env = {
  platform: undefined,
  isPWA: undefined,
  encryptionKey: undefined,
};

const loadOsData = async (): Promise<{ platform: string }> => {
  try {
    const tauriOs = await import("@tauri-apps/api/os");
    const platform = await tauriOs.platform();

    return { platform };
  } catch (e) {
    return { platform: "web" };
  }
}

const detectPWA = () => {
  window.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      env.isPWA = true;
    } else {
      env.isPWA = false;
    }
  });
}

const getDotenvVariables = async () => {
  // const url = `${import.meta.env.VITE_API_URL}/environment-variables`;

  // const response = await fetch(url as string, { headers: new Headers({ "x-referer": "self"}) });
  // const { ENCRYPTION_KEY } = await response.json();

  // return { ENCRYPTION_KEY };

  return { ENCRYPTION_KEY: "6e9f5789d9cd7089821aafb5d34509de" }
}

export const initializeEnvironmentVariables = async () => {
  detectPWA();

  const [
    osData,
    dotenvVariables,
  ] = await Promise.all([
    loadOsData(),
    getDotenvVariables(),
  ]);

  env.platform = osData.platform;
  env.encryptionKey = dotenvVariables.ENCRYPTION_KEY;

  return env;
}