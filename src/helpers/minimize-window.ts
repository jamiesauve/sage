// @ts-ignore
const { appWindow} = window.__TAURI__.window

export const minimizeWindow = () => appWindow.minimize();