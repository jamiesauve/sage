
export type OsData = {
  platform?: string;
  isPWA?: boolean;
  environmentVariables: Record<string, string>;
}

export const osData: OsData = {
  platform: undefined,
  isPWA: undefined,
  environmentVariables: {},
};

export const loadOsData = async (): Promise<OsData> => {
  try {
    const tauriOs = await import("@tauri-apps/api/os");
    const platform = await tauriOs.platform();

    osData.platform = platform;
  } catch (e) {
    osData.platform = "web";
  } finally {
    return osData;
  }
}

export const detectPWA = () => {
  window.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      osData.isPWA = true;
    } else {
      osData.isPWA = false;
    }
  });
}

export const getEnvironmentVariables = async () => {
  const url = `${import.meta.env.VITE_API_URL}/environment-variables`;

  const response = await fetch(url as string, { headers: new Headers({ "x-referer": "self"}) });
  const { ENCRYPTION_KEY } = await response.json();

  osData.environmentVariables.encryptionKey = ENCRYPTION_KEY;
}