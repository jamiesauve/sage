
export type Env = {
  platform?: string;
  isPWA?: boolean;
}

export const env: Env = {
  platform: undefined,
  isPWA: undefined,
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

export const initializeEnvironmentVariables = async () => {
  detectPWA();

  const osData = await loadOsData();
  env.platform = osData.platform;

  return env;
}