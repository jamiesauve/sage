
export type OsData = {
  platform?: string;
}

export const osData: OsData = {
  platform: undefined,
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