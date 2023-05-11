
export type OsData = {
  platform?: string;
  isPWA?: boolean;
}

export const osData: OsData = {
  platform: undefined,
  isPWA: undefined,
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